# 🛒 E-Commerce Web Application

A **full-stack ecommerce application** built with **Spring Boot** (backend) and **React.js** (frontend).  
Supports user authentication (JWT), product management, brands, categories, dynamic attributes, favorites, shopping cart, and admin dashboard with analytics.

---

## 🚀 Features

### 🔐 Authentication
- **Register / Login** with JWT tokens
- Role-based access (**Admin / User**)
- Protected API routes
- Global auth state in React via `AuthContext`

### 🛍️ Shop Features
- Product listing with search & filters
- Category & subcategory navigation
- Brand support with icons
- Product detail page with:
  - Image gallery
  - Dynamic specifications
  - Tabs for details, connection info, warehouse stock
- Add to **Cart**
- Add to **Favorites**
- Related & bundled products

### 📊 Admin Dashboard
- CRUD for products, brands, categories
- Manage product dynamic attributes
- Product image upload
- Dashboard analytics with charts (sales, orders, stock)
- User management

### 💡 UI Enhancements
- Responsive navbar with mobile menu (hamburger)
- Cart item count in navbar
- Sticky footer
- Loading indicators for async actions
- Tooltips for product info

---

## 🛠️ Tech Stack

### Backend (Spring Boot)
- Java 17
- Spring Boot 3+
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL (or MySQL)
- Lombok
- Validation (Jakarta)
- JUnit + MockMvc for testing

### Frontend (React.js)
- React 18+
- React Router v6
- Axios
- Context API for auth & loading
- TailwindCSS for styling
- Chart.js / Recharts for analytics
- Vite for development

---

## 📂 Project Structure

```yaml
/backend
├── src/main/java/uz/encode/ecommerce
│ ├── User/ (entities, controller, service, repository)
│ ├── Product/
│ ├── Category/
│ ├── Brand/
│ ├── Favorite/
│ ├── Cart/
│ └── config/ (Security, JWT)
└── src/test/java/... (JUnit tests)

/frontend
├── src/
│ ├── components/ (Navbar, Footer, Loading, etc.)
│ ├── pages/ (Login, Register, Products, ProductDetail, Dashboard, etc.)
│ ├── context/ (AuthContext, LoadingContext)
│ ├── services/ (API calls)
│ └── App.jsx
```

## 🔧 Installation & Setup

### 1️⃣ Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
````

- Backend runs on http://localhost:8080
- Update application.properties with DB credentials.

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs on http://localhost:5173 (Vite default)

## 🔐 Environment Variables

Backend (application.properties):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
spring.datasource.username=postgres
spring.datasource.password=yourpassword
jwt.secret=your_jwt_secret
```

Frontend (.env):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🧪 Testing
Backend
- JUnit + MockMvc

```bash
./mvnw test
```

Write tests under src/test/java/... for controllers, services, and repositories.

Frontend
- Jest + React Testing Library (optional)
```bash
npm test
```

📈 Future Improvements
- Payment gateway integration (Stripe/PayPal)
- Order tracking system
- Product reviews & ratings
- Inventory management
- Email notifications
- Multi-language support

## 📜 License
This project is licensed under the MIT License.

```yaml
If you want, I can **add installation screenshots & API documentation** to make it more professional. That would make the README look like a real open-source shop app.  

Do you want me to extend it with that?
```