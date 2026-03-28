const PREFIX = 'lifeos-';

export const formatIDR = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

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

// Compute last-7-days chart data from real localStorage entries
export const computeWeeklyData = (studyLog = [], tasks = [], moodLog = []) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const date = d.toISOString().split('T')[0];
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const studyMinutes = studyLog
      .filter(s => s.date === date)
      .reduce((sum, s) => sum + s.duration, 0);
    const taskCount = tasks.filter(t => t.completed === true && t.dueDate === date).length;
    const moodEntry = moodLog.find(m => m.date === date);
    return {
      day,
      study: Math.round(studyMinutes / 60 * 10) / 10,
      tasks: taskCount,
      mood: moodEntry?.intensity ?? 0,
    };
  });
};
