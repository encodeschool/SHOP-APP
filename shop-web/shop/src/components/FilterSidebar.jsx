import { Disclosure } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from '../api/axios'; // your centralized axios instance
import { setBrands, setInStock, setPriceRange } from '../redux/filterSlice';
import {useLoading} from '../contexts/LoadingContext';

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const selectedBrands = useSelector((state) => state.filters.brands);
  const inStock = useSelector((state) => state.filters.inStock);
  const priceRange = useSelector((state) => state.filters.priceRange);

  const [brands, setBrandsList] = useState([]);
  const { setLoading } = useLoading();

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/products/brands');
        setBrandsList(res.data); // expects array like [{id, name}, ...]
        console.log(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [setLoading]);

  const handleBrandChange = (brandName) => {
    const newBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter((b) => b !== brandName)
      : [...selectedBrands, brandName];
    dispatch(setBrands(newBrands));
  };

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="w-full rounded-t-xl p-2 bg-indigo-400 text-white">
            {open ? 'Hide Filters' : 'Show Filters'}
          </Disclosure.Button>

          <Disclosure.Panel className="md:block">
            <div className="space-y-6 p-4 border-[4px] border-indigo-400 rounded-b-xl">
              
              {/* Brands Filter */}
              <div>
                <h2 className="font-bold">Brands</h2>
                {brands.map((brand) => (
                  <label key={brand.id} className="block">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                      className="mr-2"
                    />
                    {brand.name}
                  </label>
                ))}
              </div>

              {/* In Stock Filter */}
              <div>
                <h2 className="font-bold">In stock</h2>
                <label>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={() => dispatch(setInStock(!inStock))}
                    className="mr-2"
                  />
                  Show in stock only
                </label>
              </div>

              {/* Price Range Filter */}
              <div>
                <h2 className="font-bold">Price range</h2>
                <input
                  type="range"
                  min={0}
                  max={220}
                  value={priceRange[1]}
                  onChange={(e) =>
                    dispatch(setPriceRange([0, parseInt(e.target.value)]))
                  }
                />
                <p>Price: €0 — €{priceRange[1]}</p>
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
