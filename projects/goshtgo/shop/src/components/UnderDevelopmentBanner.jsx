import { useTranslation } from 'react-i18next';

export default function UnderDevelopmentBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-yellow-50 border-b border-yellow-300 text-yellow-900 px-4 py-3 text-center">
      <div className="mx-auto max-w-screen-xl text-sm sm:text-base">
        {t('Website is under development. Thank you for your patience.')}
      </div>
    </div>
  );
}
