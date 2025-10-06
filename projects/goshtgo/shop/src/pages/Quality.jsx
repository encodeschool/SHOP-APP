import React from 'react';
import { useTranslation } from 'react-i18next';

const Quality = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{t('quality.title')}</h1>
      <p className="mb-4">{t('quality.intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('quality.section1Title')}</h2>
      <p className="mb-4">{t('quality.section1Text')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('quality.section2Title')}</h2>
      <p className="mb-4">{t('quality.section2Text')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('quality.section3Title')}</h2>
      <p className="mb-4">{t('quality.section3Text')}</p>

      <p className="font-semibold mt-8">{t('quality.finalLine')}</p>
    </div>
  );
};

export default Quality;
