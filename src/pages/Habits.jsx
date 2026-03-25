import { useState, useEffect } from 'react';
import { Plus, Flame } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  useEffect(() => { initializeData(allMockData); setHabits(getData('habits', [])); }, []);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Habits</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Build better routines</p>
        </div>
        <Button variant="primary"><Plus size={16}/> New Habit</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map(habit => {
          const done = habit.completedDates?.includes(today);
          return (
            <Card key={habit.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: habit.color}} />
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{habit.name}</h3>
                </div>
                <Badge color={done ? 'green' : 'gray'}>{done ? 'Done' : 'Pending'}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Flame size={16} className="text-orange-400" />
                <span className="text-sm font-mono font-bold text-text-dark dark:text-text-light">{habit.streak}</span>
                <span className="text-xs text-gray-400">day streak</span>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({length: 7}).map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - 6 + i);
                  const ds = d.toISOString().split('T')[0];
                  const done2 = habit.completedDates?.includes(ds);
                  return <div key={i} className={`flex-1 h-2 rounded-full ${done2 ? '' : 'bg-gray-100 dark:bg-white/10'}`} style={done2 ? {backgroundColor: habit.color} : {}} />;
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Habits;
