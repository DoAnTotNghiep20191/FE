import { RefObject, useEffect } from 'react';

export default function useDidClickOutside(ref: RefObject<HTMLInputElement>, onClick: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref?.current && !ref.current.contains(event.target as Node | null)) {
        onClick && onClick();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClick, ref]);
}
