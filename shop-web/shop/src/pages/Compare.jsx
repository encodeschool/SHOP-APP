// pages/Compare.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCompare, clearCompare, selectCompareItems } from '../redux/compareSlice';
import { Trash2 } from 'lucide-react';

const Compare = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCompareItems);

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold">No products selected for comparison</h2>
      </div>
    );
  }

  const featureList = [
    'Brand',
    'Condition',
    'Price',
    'Category',
    'Stock',
    'Rating',
    'Description',
  ];

  return (
    <div className="container mx-auto p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Compare Products</h1>
        <button
          onClick={() => dispatch(clearCompare())}
          className="text-red-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(250px,1fr))] gap-4">
        <div className="font-semibold text-gray-700">
          <div className='mb-[12.3rem]'>Feature</div>
          {featureList.map((feature) => (
            <div key={feature} className="my-0 text-gray-400 py-2 border-b">{feature}</div>
          ))}
        </div>

        {items.map((product) => (
          <div key={product.id} className="border rounded shadow p-4 bg-white">
            <div className="flex justify-between items-start">
              <div className="text-lg font-semibold">{product.title}</div>
              <button
                onClick={() => dispatch(removeFromCompare(product.id))}
                title="Remove"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
            <img
              src={
                product.imageUrls?.[0]
                  ? `http://localhost:8085${product.imageUrls[0]}`
                  : '/placeholder.jpg'
              }
              alt={product.title}
              className="w-full h-40 object-contain my-2"
            />
            {featureList.map((feature) => {
              let value = '—';

              switch (feature) {
                case 'Brand':
                  value = product.brand || '—';
                  break;
                case 'Condition':
                  value = product.condition;
                  break;
                case 'Price':
                  value = `$${product.price}`;
                  break;
                case 'Category':
                  value = product.category?.name || '—';
                  break;
                case 'Stock':
                  value = product.stock ?? '—';
                  break;
                case 'Rating':
                  value = product.rating ?? '—';
                  break;
                case 'Description':
                  value = product.description || '—';
                  break;
                default:
                  value = product[feature] || '—';
              }

              return (
                <div key={feature} className="py-2 border-b">
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
