import { useDispatch } from 'react-redux';
import { addToCompare } from '../redux/compareSlice';
import {FaSyncAlt} from 'react-icons/fa';

const CompareButton = ({ product }) => {
  const dispatch = useDispatch();

  const handleCompare = () => {
    dispatch(addToCompare(product));
    console.log("Added: " + product)
  };

  return (
    <button
      onClick={handleCompare}
      className="text-black flex items-center text-gray-400 justify-center mt-2 py-1 rounded text-indigo-400 hover:underline"
    >
      <FaSyncAlt className='mr-2' size={13} />
      Compare
    </button>
  );
};

export default CompareButton;