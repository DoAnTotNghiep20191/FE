import { useContext, createContext } from 'react';

export const createSafeContext = <T,>() => {
  const ctx = createContext<T | undefined>(undefined);

  const useSafeContext = () => {
    const c = useContext(ctx);
    if (!c) {
      throw new Error('useSafeContext must be inside a Provider with a value');
    }
    return c;
  };

  const Provider = ({ value, children }: { value: T; children: React.ReactNode }) => {
    return <ctx.Provider value={value}>{children}</ctx.Provider>;
  };

  return [Provider, useSafeContext] as const;
};
