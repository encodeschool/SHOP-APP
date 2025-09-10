import { FaHeart, FaThumbsUp, FaTruck, FaUndoAlt, FaMoneyBillWave } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const FeatureStrip = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <FaHeart size={32} className="text-red-600 mr-4" />,
      title: '17 Years',
      subtitle: 'With you!',
    },
    {
      icon: <FaThumbsUp size={32} className="text-red-600 mr-4" />,
      title: '99% Positive',
      subtitle: 'Feedbacks',
    },
    {
      icon: <FaTruck size={32} className="text-red-600 mr-4" />,
      title: 'Fast shipping',
      subtitle: 'Worldwide',
    },
    {
      icon: <FaUndoAlt size={32} className="text-red-600 mr-4" />,
      title: '14 Days',
      subtitle: 'to return',
    },
    {
      icon: <FaMoneyBillWave size={32} className="text-red-600 mr-4" />,
      title: 'Payment',
      subtitle: 'Secure System',
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-10 mt-6 mb-2">
      <h1 className="w-fit border-b-[4px] border-red-600 text-xl mb-5">{t("Why Us?")}</h1>
      <div className="grid p-4 md:p-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-white shadow-sm rounded-xl border-[3px] border-red-600 md:py-4">
        {features.map((f, index) => (
          <div key={index} className="flex justify-left md:justify-center items-center text-left md:text-center border-red">
            {f.icon}
            <div>
              <p className="font-semibold text-sm mt-2">{t(f.title)}</p>
              <p className="text-xs text-gray-600">{t(f.subtitle)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureStrip;
