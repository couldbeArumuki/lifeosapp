import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const categoryColor = { Learning: 'purple', Personal: 'pink', Career: 'blue', Health: 'green' };

const Goals = () => {
  const [goals, setGoals] = useState([]);
  useEffect(() => { initializeData(allMockData); setGoals(getData('goals', [])); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{goals.filter(g => g.status === 'completed').length}/{goals.length} completed</p>
        </div>
        <Button variant="primary"><Plus size={16}/> New Goal</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-dark dark:text-text-light">{goal.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{goal.description}</p>
                </div>
                <Badge color={categoryColor[goal.category] || 'gray'}>{goal.category}</Badge>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span><span>{goal.progress}/{goal.target} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{width: `${pct}%`}} />
                </div>
              </div>
              <p className="text-xs text-gray-400">Deadline: {goal.deadline}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
