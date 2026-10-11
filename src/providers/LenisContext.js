import { createContext, use } from 'react';

export const LenisContext = createContext(null);

/** Current Lenis instance, or null (reduced motion / not ready yet). */
export const useLenis = () => use(LenisContext);
