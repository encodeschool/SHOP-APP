import { Disclosure } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setBrands, setInStock, setPriceRange } from '../redux/filterSlice';

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.filters.brands);
  const inStock = useSelector((state) => state.filters.inStock);
  const priceRange = useSelector((state) => state.filters.priceRange);

  const brandsList = ['ABYstyle', 'Bandai Banpresto', 'Blizzard', 'Funko', 'Iron Studios'];

  const handleBrandChange = (brand) => {
    const newBrands = brands.includes(brand)
      ? brands.filter((b) => b !== brand)
      : [...brands, brand];
    dispatch(setBrands(newBrands));
  };

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="w-full p-2 bg-indigo-500 text-white">
            {open ? 'Hide Filters' : 'Show Filters'}
          </Disclosure.Button>

          <Disclosure.Panel className="md:block">
            <div className="space-y-6 p-4 border-r">
              <div>
                <h2 className="font-bold">Brands</h2>
                {brandsList.map((brand) => (
                  <label key={brand} className="block">
                    <input
                      type="checkbox"
                      checked={brands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="mr-2"
                    />
                    {brand}
                  </label>
                ))}
              </div>

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
