import { createContext, useContext, useEffect, useState } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

interface Props {
  children: React.ReactNode;
}

export interface WalletContextStates {
  rudderAnalytics: RudderAnalytics | null;
}

export const RudderStackContext = createContext<WalletContextStates>({
  rudderAnalytics: null,
});

export function useRudderStack(): WalletContextStates {
  return useContext(RudderStackContext);
}

const RudderStackProvider = ({ children }: Props) => {
  const [rudderAnalytics, setRudderAnalytics] = useState<RudderAnalytics | null>(null);

  const init = async () => {
    const rudderKey = import.meta.env.VITE_RUDDER_STACK_WRITE_KEY;
    const rudderUrl = import.meta.env.VITE_RUDDER_STACK_PLANE_URL;
    if (rudderKey && rudderUrl) {
      const analytics = new RudderAnalytics();
      analytics.load(rudderKey, rudderUrl);
      setRudderAnalytics(analytics);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <RudderStackContext.Provider
      value={{
        rudderAnalytics,
      }}
    >
      {children}
    </RudderStackContext.Provider>
  );
};

export default RudderStackProvider;
