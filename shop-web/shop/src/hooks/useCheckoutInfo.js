import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useCheckoutInfo = () => {
  const reduxCheckoutInfo = useSelector((state) => state.checkout.checkoutInfo);

  const fallbackCheckoutInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('checkoutInfo')) || {};
    } catch (e) {
      return {};
    }
  }, []);

  return reduxCheckoutInfo || fallbackCheckoutInfo;
};
