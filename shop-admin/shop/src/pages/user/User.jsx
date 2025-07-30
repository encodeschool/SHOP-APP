import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    roles: "BUYER",
  });
  const [editingId, setEditingId] = useState(null);

  // Store the actual File object if user selects a new file
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Store the preview URL for img src - can be object URL or backend URL string
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Flag to know if current preview is object URL (so we can revoke)
  const [isObjectUrl, setIsObjectUrl] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Clean up object URL if preview changes and it was an object URL
  useEffect(() => {
    return () => {
      if (isObjectUrl && profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview, isObjectUrl]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Revoke old object URL if exists
    if (isObjectUrl && profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview);
    }

    setProfilePictureFile(file);

    if (file) {
      // Create new object URL preview for selected file
      const objectUrl = URL.createObjectURL(file);
      setProfilePicturePreview(objectUrl);
      setIsObjectUrl(true);
    } else {
      setProfilePicturePreview(null);
      setIsObjectUrl(false);
    }
  };

  const handleEdit = (user) => {
    setNewUser({
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
      roles: Array.isArray(user.roles) ? user.roles[0] : user.roles,
    });

    // Revoke old object URL if exists
    if (isObjectUrl && profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview);
    }

    setProfilePictureFile(null);

    // Set preview to backend URL if available
    if (user.profilePictureUrl) {
      // Add full URL if backend URL is relative
      const fullUrl = user.profilePictureUrl.startsWith("http")
        ? user.profilePictureUrl
        : `http://localhost:8080${user.profilePictureUrl}`;
      setProfilePicturePreview(fullUrl);
      setIsObjectUrl(false); // this is not an object URL
    } else {
      setProfilePicturePreview(null);
      setIsObjectUrl(false);
    }

    setEditingId(user.id);
  };

  const handleCreateOrUpdate = async () => {
    try {
      const dataToSend = {
        ...newUser,
        roles: Array.isArray(newUser.roles) ? newUser.roles : [newUser.roles],
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(dataToSend));
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      if (editingId) {
        await axios.put(`/users/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setNewUser({
        username: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        roles: "BUYER",
      });

      // Clean up object URL if any
      if (isObjectUrl && profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }

      setProfilePictureFile(null);
      setProfilePicturePreview(null);
      setIsObjectUrl(false);
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error creating/updating user:", error);
      alert("Failed to save user. Check console for details.");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <div className="mb-6 bg-white p-4 shadow">
        <h3 className="font-semibold mb-2">{editingId ? "Edit" : "Add"} User</h3>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-1 m-1"
        />
        {profilePicturePreview && (
          <img
            src={profilePicturePreview}
            alt="Profile Preview"
            style={{ width: 100, height: 100, objectFit: "cover", marginTop: 10 }}
          />
        )}

        <input
          name="username"
          placeholder="Username"
          className="border p-1 m-1"
          value={newUser.username}
          onChange={handleInputChange}
        />
        <input
          name="name"
          placeholder="Full name"
          className="border p-1 m-1"
          value={newUser.name}
          onChange={handleInputChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-1 m-1"
          value={newUser.email}
          onChange={handleInputChange}
          disabled={editingId !== null}
        />
        <input
            name="password"
            type="password"
            placeholder="Password"
            className="border p-1 m-1"
            value={newUser.password}
            onChange={handleInputChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          className="border p-1 m-1"
          value={newUser.phone || ""}
          onChange={handleInputChange}
        />
        <select
          name="roles"
          className="border p-1 m-1"
          value={newUser.roles}
          onChange={handleInputChange}
        >
          <option value="SELLER">SELLER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="BUYER">BUYER</option>
        </select>

        <button
          onClick={handleCreateOrUpdate}
          className="bg-blue-500 text-white px-3 py-1 ml-2"
        >
          {editingId ? "Update" : "Create"}
        </button>
      </div>

      <table className="w-full border bg-white shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Profile Image</th>
            <th className="p-2">Username</th>
            <th className="p-2">Full name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2">
                {u.profilePictureUrl ? (
                  <img
                    src={`http://localhost:8080${u.profilePictureUrl}`}
                    alt="Profile"
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 50 }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.phone}</td>
              <td className="p-2">
                {Array.isArray(u.roles) ? u.roles.join(", ") : u.roles}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-500 text-white px-2 py-1 text-sm mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white px-2 py-1 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
