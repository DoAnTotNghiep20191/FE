import { useEffect, useState } from 'react';
import { countryCode } from 'src/constants/countryCode';
import { getCountyUser } from 'src/helpers';

export const useCountry = () => {
  const [country, setCountry] = useState('');

  const getDialCode = (country: string) => {
    return countryCode.find((item) => item?.code === country)?.dial_code;
  };

  useEffect(() => {
    (async () => {
      const data = await getCountyUser();
      setCountry(data);
    })();
  }, []);

  return {
    country,
    getDialCode,
  };
};
