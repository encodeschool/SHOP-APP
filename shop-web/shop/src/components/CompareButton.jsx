import { useDispatch } from 'react-redux';
import { addToCompare } from '../redux/compareSlice';
import {FaSyncAlt} from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const CompareButton = ({ product }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      {t("Compare")}
    </button>
  );
};

export default CompareButton;