import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { addToCart } from '../redux/cartSlice';
import { useDispatch } from 'react-redux';
import { FaCartPlus } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';
import CompareButton from '../components/CompareButton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [activeTab, setActiveTab] = useState('specification');
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrand = async (brandId) => {
      const res = await axios.get(`/products/brands/${brandId}`)
      setBrand(res.data);
    }
    if (product?.brandId) {
      fetchBrand(product.brandId);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const buildBreadcrumbPath = async (categoryId) => {
      const path = [];
      let currentId = categoryId;
      while (currentId) {
        try {
          const res = await axios.get(`/categories/${currentId}`);
          const currentCategory = res.data;
          path.unshift(currentCategory);
          currentId = currentCategory.parentId;
        } catch (err) {
          console.error('Error fetching category path:', err);
          break;
        }
      }
      setBreadcrumbPath(path);
    };

    if (product?.categoryId) {
      buildBreadcrumbPath(product.categoryId);
    }
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb pathArray={breadcrumbPath} productTitle={product.title} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left - Image section */}
        <div>
          <img
            src={
              product.imageUrls?.[currentImageIndex]
                ? `http://localhost:8080${product.imageUrls[currentImageIndex]}`
                : '/placeholder.jpg'
            }
            alt={`${product.title} image`}
            className="object-contain h-[400px] w-full"
          />
          <div className="flex mt-4 justify-center gap-2">
            {product.imageUrls?.map((imgUrl, index) => (
              <img
                key={index}
                src={`http://localhost:8080${imgUrl}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-contain cursor-pointer border-2 ${
                  index === currentImageIndex ? 'border-black' : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div>
          <div className="flex mb-3">
            <div>
              <img
                src={
                  brand?.icon
                    ? `http://localhost:8080${brand.icon}`
                    : '/placeholder.jpg'
                }
                alt={`${brand?.name} image`}
                className="object-contain h-[25px]"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-5xl font-bold text-indigo-400 mb-4">${product.price}</p>
          <p className="mb-2">{product.description}</p>
          <p className="mb-2">Stock: {product.stock}</p>

          <button
            className="bg-black text-white px-4 py-2 rounded flex items-center mb-3"
            onClick={handleAddToCart}
          >
            <FaCartPlus className="mr-2" /> Add to Cart
          </button>

          <CompareButton product={product} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex space-x-4 pb-2 mb-6">
          {['specification', 'warehouse', 'together'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize py-4 ml-0 text-2xl rounded-t ${
                activeTab === tab ? 'text-black font-bold border-b-[4px] border-indigo-400' : 'text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'specification' && product.attributes?.length > 0 && (
          <div>
            {Object.entries(
              product.attributes.reduce((groups, attr) => {
                const group = attr.group || 'Общие характеристики';
                if (!groups[group]) groups[group] = [];
                groups[group].push(attr);
                return groups;
              }, {})
            ).map(([groupName, attrs]) => (
              <div key={groupName} className="mb-8">
                <h3 className="text-lg font-semibold mb-3">{groupName.toUpperCase()}</h3>
                <table className="w-full border-separate border-spacing-y-2">
                  <tbody>
                    {attrs.map((attr, idx) => (
                      <tr key={idx}>
                        <td className="text-gray-600 w-1/3">{attr.attributeName}:</td>
                        <td className="text-black font-medium">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'warehouse' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Warehouse Info</h3>
            <p>Coming soon...</p>
          </div>
        )}

        {activeTab === 'together' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Frequently Bought Together</h3>
            <p>Bundle suggestions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
