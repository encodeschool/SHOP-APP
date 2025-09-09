import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard'; // New component
import { useTranslation } from "react-i18next";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all categories to determine subcategories and build paths
        const allCategoriesRes = await axios.get('/categories');
        const allCategoriesData = allCategoriesRes.data;
        setAllCategories(allCategoriesData);
        
        // Find the current category and its subcategories
        const currentCategory = allCategoriesData.find(cat => cat.id === categoryId);
        if (currentCategory) {
          setCategoryName(currentCategory.name);
          setSubcategories(currentCategory.subcategories);
        }

        // Fetch products for the current category
        const productRes = await axios.get(`/products/category/${categoryId}`);
        setProducts(productRes.data);

      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [categoryId]);

  // Helper function to build the full category path from a flat list
  const getCategoryPath = (currentCategoryId) => {
    const path = [];
    let currentCategory = allCategories.find(cat => cat.id === currentCategoryId);

    while (currentCategory) {
      path.unshift(currentCategory.name);
      currentCategory = allCategories.find(cat => cat.id === currentCategory.parentId);
    }
    return path;
  };

  if (loading) return <div className="p-6">{t("Loading...")}</div>;

  const contentToDisplay = subcategories.length > 0 ? (
    subcategories.map(category => (
      <CategoryCard key={category.id} category={category} />
    ))
  ) : products.length > 0 ? (
    products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        categoryPath={getCategoryPath(product.categoryId)}
      />
    ))
  ) : (
    <p>{t("No subcategories or products found in this category.")}</p>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{t("Category")}: {categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {contentToDisplay}
      </div>
    </div>
  );
};

export default CategoryPage;
