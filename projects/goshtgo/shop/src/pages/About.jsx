import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
      <p className="mb-4">{t('about.intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('about.stopTitle')}</h2>
      <p className="mb-4">{t('about.stopIntro')}</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        {t('about.stopList', { returnObjects: true }).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('about.solutionTitle')}</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        {t('about.solutionList', { returnObjects: true }).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('about.philosophyTitle')}</h2>
      <p className="mb-4">{t('about.philosophyText1')}</p>
      <p className="mb-4">{t('about.philosophyText2')}</p>

      <p className="font-semibold mt-8">{t('about.finalLine')}</p>
    </div>
  );
};

export default About;
