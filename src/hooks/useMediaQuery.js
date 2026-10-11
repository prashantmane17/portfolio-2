import { useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query and returns whether it currently matches. */
export function useMediaQuery(query) {
    return useSyncExternalStore(
        (notify) => {
            const mql = window.matchMedia(query);
            mql.addEventListener('change', notify);
            return () => mql.removeEventListener('change', notify);
        },
        () => window.matchMedia(query).matches,
        () => false
    );
}
