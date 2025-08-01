import { useEffect, useState } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { setSort } from '../redux/filterSlice';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

export default function FilterPage() {
  const dispatch = useDispatch();
  const { brands = [], inStock = false, priceRange = [0, 220], sort = 'default' } = useSelector((state) => state.filters || {});
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]); // fetched products
  const [filtered, setFiltered] = useState([]);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Sync URL params -> Redux state (sort only here)
  useEffect(() => {
    if (searchParams.has('sort')) {
      dispatch(setSort(searchParams.get('sort')));
    }
  }, [searchParams, dispatch]);

  // Filter, sort products based on Redux filters and update URL params
  useEffect(() => {
    let results = [...products];

    if (brands.length) results = results.filter((p) => brands.includes(p.brand));
    if (inStock) results = results.filter((p) => p.inStock);
    results = results.filter((p) => p.price <= priceRange[1]);

    if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);

    setFiltered(results);

    // Update URL search params with current sort state
    const params = new URLSearchParams();
    if (sort !== 'default') params.set('sort', sort);
    setSearchParams(params);
  }, [products, brands, inStock, priceRange, sort, setSearchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-64">
        <FilterSidebar />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Collectible Figures</h1>
          <select
            className="border px-3 py-2 rounded"
            value={sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
          >
            <option value="default">Default sorting</option>
            <option value="price-asc">Sort by price: low to high</option>
            <option value="price-desc">Sort by price: high to low</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="border p-4 rounded shadow">
              <h2 className="font-bold">{p.title}</h2>
              <p>Brand: {p.brand}</p>
              <p>€{p.price.toFixed(2)}</p>
              <button className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded">
                Add to cart
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p>No products found.</p>}
        </div>
      </div>
    </div>
  );
}
