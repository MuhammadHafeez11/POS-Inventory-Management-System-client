import { useState, useEffect } from 'react';

// Custom debounce hook
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);  // Cleanup to avoid multiple calls
    };
  }, [value, delay]);

  return debouncedValue;
};
