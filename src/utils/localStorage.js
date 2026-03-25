const PREFIX = 'lifeos-';

export const saveData = (key, data) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const getData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return defaultValue;
  }
};

export const clearData = (key) => {
  if (key) {
    localStorage.removeItem(PREFIX + key);
  } else {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};

export const initializeData = (mockData) => {
  Object.entries(mockData).forEach(([key, value]) => {
    if (!localStorage.getItem(PREFIX + key)) {
      saveData(key, value);
    }
  });
};
