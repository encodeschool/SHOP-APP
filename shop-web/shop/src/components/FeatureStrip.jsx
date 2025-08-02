import { FaHeart, FaThumbsUp, FaTruck, FaUndoAlt, FaMoneyBillWave } from 'react-icons/fa';

const FeatureStrip = () => {
  const features = [
    {
      icon: <FaHeart size={32} className="text-indigo-400 mr-4" />,
      title: '17 Years',
      subtitle: 'With you!',
    },
    {
      icon: <FaThumbsUp size={32} className="text-indigo-400 mr-4" />,
      title: '99% Positive',
      subtitle: 'Feedbacks',
    },
    {
      icon: <FaTruck size={32} className="text-indigo-400 mr-4" />,
      title: 'Fast shipping',
      subtitle: 'Worldwide',
    },
    {
      icon: <FaUndoAlt size={32} className="text-indigo-400 mr-4" />,
      title: '14 Days',
      subtitle: 'to return',
    },
    {
      icon: <FaMoneyBillWave size={32} className="text-indigo-400 mr-4" />,
      title: 'Payment',
      subtitle: 'Secure System',
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-6 mb-2">
      <h1 className="text-xl mb-5">Why Us?</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-white shadow-sm rounded border py-4">
        {features.map((f, index) => (
          <div key={index} className="flex justify-center items-center text-center border-indigo">
            {f.icon}
            <div>
              <p className="font-semibold text-sm mt-2">{f.title}</p>
              <p className="text-xs text-gray-600">{f.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureStrip;
