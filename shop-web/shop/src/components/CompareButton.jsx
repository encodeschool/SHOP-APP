import { useDispatch } from 'react-redux';
import { addToCompare } from '../redux/compareSlice';

const CompareButton = ({ product }) => {
  const dispatch = useDispatch();

  const handleCompare = () => {
    dispatch(addToCompare(product));
    console.log("Added: " + product)
  };

  return (
    <button
      onClick={handleCompare}
      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
    >
      Compare
    </button>
  );
};

export default CompareButton;