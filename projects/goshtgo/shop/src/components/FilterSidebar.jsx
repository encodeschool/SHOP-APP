import { Disclosure } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from '../api/axios'; // your centralized axios instance
import { setBrands, setInStock, setPriceRange } from '../redux/filterSlice';
import {useLoading} from '../contexts/LoadingContext';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const selectedBrands = useSelector((state) => state.filters.brands);
  const [brandsToShow, setBrandsToShow] = useState(1);
  const inStock = useSelector((state) => state.filters.inStock);
  const priceRange = useSelector((state) => state.filters.priceRange);

  const [brands, setBrandsList] = useState([]);
  const { setLoading } = useLoading();
  const { t } = useTranslation();

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

  const handleExpand = () => {
    setBrandsToShow(prev => prev + 6);
  }

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="w-full rounded-t-xl p-2 bg-red-800 text-white">
            {open ? 'Hide Filters' : 'Show Filters'}
          </Disclosure.Button>

          <Disclosure.Panel className="md:block">
            <div className="space-y-6 p-4 border-[4px] border-red-800 rounded-b-xl">
              
              {/* Brands Filter */}
              <div className='border border-gray-[5px] p-3'>
                <h2 className="font-bold">{t("Brands")}</h2>
                {brands.slice(0, brandsToShow).map((brand, index) => (
                  <label key={`${brand.id}-${index}`} className="block">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                      className="mr-2"
                    />
                    {brand.name}
                  </label>
                ))}
                {brandsToShow < brands.length && (
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={handleExpand}
                      className="text-red-600 px-6 rounded-full hover:underline transition delay-150"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </div>

              {/* In Stock Filter */}
              <div className='border border-gray-[5px] p-3'>
                <h2 className="font-bold">{t("In stock")}</h2>
                <label>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={() => dispatch(setInStock(!inStock))}
                    className="mr-2"
                  />
                  {t("Show in stock only")}
                </label>
              </div>

              {/* Price Range Filter */}
              <div className='border border-gray-[5px] p-3'>
                <h2 className="font-bold">{t("Price range")}</h2>
                <input
                  type="range"
                  min={0}
                  max={220}
                  value={priceRange[1]}
                  onChange={(e) =>
                    dispatch(setPriceRange([0, parseInt(e.target.value)]))
                  }
                />
                <p>{t("Price")}: €0 — €{priceRange[1]}</p>
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
