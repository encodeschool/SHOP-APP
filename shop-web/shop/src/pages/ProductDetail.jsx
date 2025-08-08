import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('product_detail');

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
          path.unshift(currentCategory); // add to beginning
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



  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (!product || !breadcrumbPath) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb pathArray={breadcrumbPath} productTitle={product.title} />

        <div className="grid grid-cols-2 gap-6">
          <div className='col-span-1'>
            <img
              src={
                product.imageUrls?.[currentImageIndex]
                  ? `http://localhost:8080${product.imageUrls[currentImageIndex]}`
                  : '/placeholder.jpg'
              }
              alt={`${product.title} - image ${currentImageIndex + 1}`}
              className="object-contain h-[400px] w-full"
            />
            <div className="flex mt-4 mx-auto justify-center space-x-2">
              {product.imageUrls?.map((imgUrl, index) => (
                <img
                  key={index}
                  src={`http://localhost:8080${imgUrl}`}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-contain cursor-pointer border-2 ${
                    index === currentImageIndex ? 'border-black' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-black-600 text-7xl mt-6 mb-6 font-bold mb-2">${product.price}</p>
            <p className="mb-4">{product.description}</p>
            <p className="mb-4">Available: {product.stock}</p>
            <button 
              className="bg-black text-white px-4 mb-3 py-2 rounded flex items-center"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product);
              }}
            >
              <FaCartPlus className='mr-2'/>
              Add to Cart
            </button>      
            <CompareButton product={product} />
          </div>
        </div>

        {['specification', 'warehouse', 'together'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 mt-10 mx-6 ml-0 rounded ${activeTab === tab ? 'bg-black text-white' : 'bg-gray-100'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        {/* Adding tabs - first tabe */}
        {activeTab === 'specification' && (
          product.attributes && product.attributes.length > 0 && (
            <div className="mt-10">
              {/* Group attributes */}
              {Object.entries(
                product.attributes.reduce((groups, attr) => {
                  const group = attr.group || "Общие характеристики";
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
          )
        )}
        
        {/* Second tab */}

        {/* Third tab */}
      </div>
    </div>
  );
};

export default ProductDetail;
