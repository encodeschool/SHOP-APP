import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { addToCart } from '../redux/cartSlice';
import { useDispatch } from 'react-redux';
import { FaCartPlus } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';
import CompareButton from '../components/CompareButton';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useLoading } from '../contexts/LoadingContext';
import FavoriteButton from '../components/FavoriteButton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [activeTab, setActiveTab] = useState('specification');
  const [brand, setBrand] = useState(null);
  const [weight, setWeight] = useState(1);
  const { setLoading } = useLoading();
  const [favorites, setFavorites] = useState([]);
  const [options, setOptions] = useState({
    vacuum: false,
    debone: false,
    mince: false,
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { t } = useTranslation();

  const optionPrices = {
    vacuum: 40,
    debone: 55,
    mince: 45,
  };

  // ✅ UPDATED: Determine if product is measured in kg
  const isKgUnit = product?.unit?.code === 'kg';

  useEffect(() => {
    setLoading(true);
    const fetchFavorites = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (userId && token) {
        try {
          const res = await axios.get(`/favorites/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const productIds = res.data.map((fav) => fav.productId);
          setFavorites(productIds);
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
          setFavorites([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFavorites();
  }, [setLoading]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiLang = language === 'lv' ? 'en' : language;
        const res = await axios.get(`/products/lang/${id}?lang=${apiLang}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id, language]);

  useEffect(() => {
    const fetchBrand = async (brandId) => {
      try {
        const res = await axios.get(`/products/brands/${brandId}`);
        setBrand(res.data);
      } catch (err) {
        console.error('Error fetching brand:', err);
      }
    };
    if (product?.brandId) {
      fetchBrand(product.brandId);
    }
  }, [product]);

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
    const totalPrice = getTotalPrice();
    dispatch(addToCart({ ...product, weight, options, totalPrice }));
  };

  // ✅ UPDATED: Adjust weight/quantity controls based on unit
  const increaseWeight = () =>
    isKgUnit ? setWeight((w) => +(w + 0.1).toFixed(1)) : setWeight((w) => w + 1);
  const decreaseWeight = () =>
    isKgUnit
      ? setWeight((w) => (w > 0.1 ? +(w - 0.1).toFixed(1) : w))
      : setWeight((w) => (w > 1 ? w - 1 : w));

  const handleOptionChange = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ UPDATED: Update total price calculation for kg or pcs
  const getTotalPrice = () => {
    if (!product?.price) return 0;
    const base = product.price * weight;
    const extras = Object.entries(options)
      .filter(([key, value]) => value)
      .reduce((sum, [key]) => sum + optionPrices[key] * (isKgUnit ? weight : 1), 0);
    return base + extras;
  };

  if (!product) return <div className="p-6">{t('Loading...')}</div>;

  return (
    <div className="container mx-auto px-4 md:px-10 py-6">
      <Breadcrumb pathArray={breadcrumbPath} productTitle={product.title} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left - Image section */}
        <div>
          <img
            src={
              product.imageUrls?.[currentImageIndex]
                ? `${BASE_URL}${product.imageUrls[currentImageIndex]}`
                : '/placeholder.jpg'
            }
            alt={product.title}
            className="object-contain h-[400px] w-full rounded-lg"
          />
          <div className="flex mt-4 justify-center gap-2">
            {product.imageUrls?.map((imgUrl, index) => (
              <img
                key={index}
                src={`${BASE_URL}${imgUrl}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-contain cursor-pointer border-2 rounded ${
                  index === currentImageIndex ? 'border-red-700' : 'border-gray-300'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div>
          {/* ✅ UPDATED: Dynamic Order by tab */}
          <div className="grid grid-cols-2">
            <div className="bg-gray-50 p-6 pinkish">
              <p className="text-center">
                {isKgUnit ? 'Order by Kg' : 'Order by number'}
              </p>
            </div>
            <div className="bg-white p-6">{/* optional additional info */}</div>
          </div>

          <div className="bg-gray-50 p-6 pinkish relative">
            <FavoriteButton
              productId={product.id}
              favorites={favorites}
              setFavorites={setFavorites}
            />
            {brand && (
              <div className="flex mb-3">
                <img
                  src={brand.icon ? `${BASE_URL}${brand.icon}` : '/placeholder.jpg'}
                  alt={brand.name}
                  className="object-contain h-[25px]"
                />
              </div>
            )}

            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>

            {/* ✅ UPDATED: Conditional weight/quantity selector */}
            {isKgUnit ? (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-semibold">{t('Weight')}:</span>
                <button
                  className="border px-2 py-1 bg-white rounded hover:bg-gray-200"
                  onClick={decreaseWeight}
                >
                  −
                </button>
                <span className="text-xl font-bold">{weight.toFixed(1)} kg</span>
                <button
                  className="border px-2 py-1 bg-white rounded hover:bg-gray-200"
                  onClick={increaseWeight}
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg font-semibold">{t('Quantity')}:</span>
                <button
                  className="border px-2 py-1 bg-white rounded hover:bg-gray-200"
                  onClick={decreaseWeight}
                >
                  −
                </button>
                <span className="text-xl font-bold">{Math.floor(weight)}</span>
                <button
                  className="border px-2 py-1 bg-white rounded hover:bg-gray-200"
                  onClick={increaseWeight}
                >
                  +
                </button>
              </div>
            )}

            {/* Base price */}
            <p className="text-2xl font-bold text-red-800 mb-3">
              {getTotalPrice().toLocaleString()} ₽
            </p>

            {/* Options */}
            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.vacuum}
                  onChange={() => handleOptionChange('vacuum')}
                />
                <span>Упаковать под вакуумом + {optionPrices.vacuum} ₽/кг</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.debone}
                  onChange={() => handleOptionChange('debone')}
                />
                <span>Снять с кости + {optionPrices.debone} ₽/кг</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.mince}
                  onChange={() => handleOptionChange('mince')}
                />
                <span>Фарш из этого куска + {optionPrices.mince} ₽/кг</span>
              </label>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-4 border-t pt-3">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-red-700">
                {getTotalPrice().toLocaleString()} ₽
              </span>
            </div>

            <button
              className="bg-red-700 text-white px-6 py-3 rounded-full text-lg flex items-center justify-center w-full hover:bg-red-800 transition"
              onClick={handleAddToCart}
            >
              <FaCartPlus className="mr-2" /> В корзину
            </button>

            <CompareButton product={product} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex space-x-4 mb-6 border-b-[1px] border-red-800">
          {['specification', 'warehouse', 'together'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize py-4 ml-0 text-2xl border-red-800 px-[25px] py-[12px] rounded-t ${
                activeTab === tab ? 'text-black font-bold border-[1px] border-red-600 border-b-[0]' : 'text-gray-800'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        {activeTab === 'specification' && product.attributes?.length > 0 && (
          <div>
            {Object.entries(
              product.attributes.reduce((groups, attr) => {
                const group = attr.group || '';
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
            <h3 className="text-lg font-semibold mb-2">{t("Warehouse Info")}</h3>
            <p>{t("Coming soon..")}.</p>
          </div>
        )}

        {activeTab === 'together' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("Frequently Bought Together")}</h3>
            <p>{t("Bundle suggestions will appear here.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
