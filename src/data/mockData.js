export const mockTasks = [
  { id: 1, title: 'Review Japanese vocabulary', status: 'in-progress', priority: 'high', dueDate: '2026-03-26', category: 'Learning', completed: false },
  { id: 2, title: 'Complete morning workout', status: 'completed', priority: 'medium', dueDate: '2026-03-25', category: 'Health', completed: true },
  { id: 3, title: 'Read 30 pages of book', status: 'todo', priority: 'low', dueDate: '2026-03-27', category: 'Personal', completed: false },
  { id: 4, title: 'Practice JLPT N3 grammar', status: 'todo', priority: 'high', dueDate: '2026-03-25', category: 'Learning', completed: false },
  { id: 5, title: 'Weekly meal prep', status: 'completed', priority: 'medium', dueDate: '2026-03-24', category: 'Health', completed: true },
  { id: 6, title: 'Update study notes', status: 'in-progress', priority: 'medium', dueDate: '2026-03-26', category: 'Study', completed: false },
];

export const mockHabits = [
  { id: 1, name: 'Morning Meditation', frequency: 'daily', streak: 7, completedDates: ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22', '2026-03-23', '2026-03-24', '2026-03-25'], color: '#6B9BD1' },
  { id: 2, name: 'Japanese Study (30 min)', frequency: 'daily', streak: 14, completedDates: ['2026-03-12','2026-03-13','2026-03-14','2026-03-15','2026-03-16','2026-03-17','2026-03-18','2026-03-19','2026-03-20','2026-03-21','2026-03-22','2026-03-23','2026-03-24','2026-03-25'], color: '#B19CD9' },
  { id: 3, name: 'Exercise', frequency: 'daily', streak: 5, completedDates: ['2026-03-21', '2026-03-22', '2026-03-23', '2026-03-24', '2026-03-25'], color: '#7EC8A3' },
  { id: 4, name: 'Read Books', frequency: 'daily', streak: 3, completedDates: ['2026-03-23', '2026-03-24', '2026-03-25'], color: '#F4A6C1' },
  { id: 5, name: 'Drink 2L Water', frequency: 'daily', streak: 10, completedDates: ['2026-03-16','2026-03-17','2026-03-18','2026-03-19','2026-03-20','2026-03-21','2026-03-22','2026-03-23','2026-03-24','2026-03-25'], color: '#6B9BD1' },
];

export const mockJapanese = {
  currentLevel: 'N3',
  totalVocab: 1250,
  totalKanji: 320,
  weeklyGoal: 50,
  weeklyProgress: 35,
  vocabulary: [
    { id: 1, word: '頑張る', reading: 'がんばる', meaning: "to do one's best", jlptLevel: 'N4', learned: true },
    { id: 2, word: '勉強', reading: 'べんきょう', meaning: 'study', jlptLevel: 'N5', learned: true },
    { id: 3, word: '難しい', reading: 'むずかしい', meaning: 'difficult', jlptLevel: 'N5', learned: true },
    { id: 4, word: '経験', reading: 'けいけん', meaning: 'experience', jlptLevel: 'N3', learned: false },
    { id: 5, word: '目標', reading: 'もくひょう', meaning: 'goal/target', jlptLevel: 'N3', learned: true },
  ],
  kanji: [
    { id: 1, character: '日', meaning: 'sun/day', onyomi: 'にち、じつ', kunyomi: 'ひ、か', jlptLevel: 'N5' },
    { id: 2, character: '本', meaning: 'book/origin', onyomi: 'ほん', kunyomi: 'もと', jlptLevel: 'N5' },
    { id: 3, character: '学', meaning: 'study/learn', onyomi: 'がく', kunyomi: 'まな', jlptLevel: 'N5' },
  ],
};

export const mockStudyLog = [
  { id: 1, subject: 'Japanese', duration: 45, date: '2026-03-25', notes: 'Reviewed N3 grammar patterns', rating: 4 },
  { id: 2, subject: 'Programming', duration: 120, date: '2026-03-25', notes: 'Worked on React components', rating: 5 },
  { id: 3, subject: 'Japanese', duration: 30, date: '2026-03-24', notes: 'Vocabulary flashcards', rating: 3 },
  { id: 4, subject: 'Math', duration: 60, date: '2026-03-23', notes: 'Calculus practice problems', rating: 4 },
  { id: 5, subject: 'Programming', duration: 90, date: '2026-03-22', notes: 'Learned about React hooks', rating: 5 },
];

export const mockMoodLog = [
  { id: 1, mood: 'happy', intensity: 4, date: '2026-03-25', notes: 'Great day overall!', emoji: '😊' },
  { id: 2, mood: 'focused', intensity: 5, date: '2026-03-24', notes: 'Very productive session', emoji: '🎯' },
  { id: 3, mood: 'tired', intensity: 2, date: '2026-03-23', notes: "Didn't sleep well", emoji: '😴' },
  { id: 4, mood: 'motivated', intensity: 5, date: '2026-03-22', notes: 'Started new project!', emoji: '🚀' },
  { id: 5, mood: 'calm', intensity: 3, date: '2026-03-21', notes: 'Relaxing day', emoji: '🌿' },
  { id: 6, mood: 'happy', intensity: 4, date: '2026-03-20', notes: 'Good progress on goals', emoji: '😊' },
  { id: 7, mood: 'anxious', intensity: 2, date: '2026-03-19', notes: 'Big exam coming up', emoji: '😰' },
];

export const mockSleepLog = [
  { id: 1, date: '2026-03-25', bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 4, notes: 'Slept well' },
  { id: 2, date: '2026-03-24', bedtime: '00:30', wakeTime: '07:30', duration: 7, quality: 3, notes: 'Woke up once' },
  { id: 3, date: '2026-03-23', bedtime: '02:00', wakeTime: '07:00', duration: 5, quality: 2, notes: 'Late night coding' },
  { id: 4, date: '2026-03-22', bedtime: '22:30', wakeTime: '06:30', duration: 8, quality: 5, notes: 'Perfect sleep!' },
  { id: 5, date: '2026-03-21', bedtime: '23:30', wakeTime: '07:00', duration: 7.5, quality: 4, notes: 'Good rest' },
  { id: 6, date: '2026-03-20', bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 4, notes: 'Consistent schedule' },
  { id: 7, date: '2026-03-19', bedtime: '01:00', wakeTime: '08:00', duration: 7, quality: 3, notes: 'Watched movie late' },
];

export const mockGoals = [
  { id: 1, title: 'Pass JLPT N3', category: 'Learning', progress: 65, target: 100, deadline: '2026-07-01', status: 'in-progress', description: 'Study vocabulary and grammar for N3 level' },
  { id: 2, title: 'Read 24 books this year', category: 'Personal', progress: 5, target: 24, deadline: '2026-12-31', status: 'in-progress', description: 'Read at least 2 books per month' },
  { id: 3, title: 'Build 3 portfolio projects', category: 'Career', progress: 1, target: 3, deadline: '2026-06-01', status: 'in-progress', description: 'Create projects to showcase skills' },
  { id: 4, title: 'Exercise 5x per week', category: 'Health', progress: 80, target: 100, deadline: '2026-12-31', status: 'in-progress', description: 'Maintain consistent exercise routine' },
  { id: 5, title: 'Learn 1000 Japanese kanji', category: 'Learning', progress: 320, target: 1000, deadline: '2026-09-01', status: 'in-progress', description: 'Master joyo kanji set' },
];

export const mockWeeklyData = [
  { day: 'Mon', study: 2.5, tasks: 4, mood: 4 },
  { day: 'Tue', study: 1.5, tasks: 3, mood: 3 },
  { day: 'Wed', study: 3, tasks: 5, mood: 5 },
  { day: 'Thu', study: 2, tasks: 3, mood: 2 },
  { day: 'Fri', study: 4, tasks: 6, mood: 4 },
  { day: 'Sat', study: 1, tasks: 2, mood: 4 },
  { day: 'Sun', study: 2.5, tasks: 3, mood: 3 },
];

export const allMockData = {
  tasks: mockTasks,
  habits: mockHabits,
  japanese: mockJapanese,
  studyLog: mockStudyLog,
  moodLog: mockMoodLog,
  sleepLog: mockSleepLog,
  goals: mockGoals,
  weeklyData: mockWeeklyData,
};
