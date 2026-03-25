import { useState } from 'react';
import { saveData, getData } from '../utils/localStorage';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => getData(key, initialValue));

  const setStoredValue = (newValue) => {
    const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
    setValue(valueToStore);
    saveData(key, valueToStore);
  };

  return [value, setStoredValue];
};
