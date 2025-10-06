import React from 'react';
import { useTranslation } from 'react-i18next';
import AppStore from '../static/img/appstore.png';
import PlayMarket from '../static/img/playmarket.png';

const Delivery = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 md:px-10 py-6 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">{t('delivery.title')}</h1>
      <p className="mb-4">{t('delivery.intro')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.standardTitle')}</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>{t('delivery.standard1')}</li>
        <li>{t('delivery.standard2')}</li>
        <li>{t('delivery.standard3')}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.expressTitle')}</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>{t('delivery.express1')}</li>
        <li>{t('delivery.express2')}</li>
        <li>{t('delivery.express3')}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.individualTitle')}</h2>
      <p className="mb-4">{t('delivery.individualText')}</p>
      <p className="font-semibold mb-4">{t('delivery.guarantee')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.noticeTitle')}</h2>
      <p className="mb-4">{t('delivery.noticeText1')}</p>
      <p className="mb-4">{t('delivery.noticeText2')}</p>
      <p className="mb-4 font-semibold">{t('delivery.noticeBottom')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.appTitle')}</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>{t('delivery.app1')}</li>
        <li>{t('delivery.app2')}</li>
        <li>{t('delivery.app3')}</li>
      </ul>
      <p className="mt-4 mb-4">{t('delivery.appBottom')}</p>
      <div className="flex gap-4">
        <img src={AppStore} alt="App Store" className="h-10" />
        <img src={PlayMarket} alt="Google Play" className="h-10" />
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.cashbackTitle')}</h2>
      <p className="mb-4">{t('delivery.cashbackText')}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">{t('delivery.howToUse')}</h3>
      <ul className="list-disc ml-6 space-y-2">
        <li>{t('delivery.cashbackUse1')}</li>
        <li>{t('delivery.cashbackUse2')}</li>
        <li>{t('delivery.cashbackUse3')}</li>
        <li>{t('delivery.cashbackUse4')}</li>
      </ul>
      <p className="mt-4 font-semibold">{t('delivery.cashbackBottom')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.paymentTitle')}</h2>
      <p className="mb-4">{t('delivery.paymentText')}</p>
      <p className="mb-4 font-semibold">{t('delivery.paymentTip')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.coolingTitle')}</h2>
      <p className="mb-4">{t('delivery.coolingText')}</p>
      <p className="font-semibold mb-4">{t('delivery.coolingBottom')}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t('delivery.qualityTitle')}</h2>
      <p className="mb-4">{t('delivery.qualityText')}</p>
      <p className="font-semibold mb-4">{t('delivery.qualityPolicy')}</p>
      <p className="font-semibold mt-4">{t('delivery.qualityFinal')}</p>
    </div>
  );
};

export default Delivery;
