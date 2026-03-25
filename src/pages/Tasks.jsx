import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const priorityColor = { high: 'red', medium: 'yellow', low: 'green' };
const statusColor = { completed: 'green', 'in-progress': 'blue', todo: 'gray' };

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    initializeData(allMockData);
    setTasks(getData('tasks', []));
  }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{tasks.filter(t=>t.completed).length}/{tasks.length} completed</p>
        </div>
        <Button variant="primary"><Plus size={16}/> Add Task</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'todo', 'in-progress', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter===f ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(task => (
          <Card key={task.id} className="flex items-start gap-4">
            <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ${task.completed ? 'bg-accent border-accent' : 'border-gray-300 dark:border-gray-600'}`} />
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${task.completed ? 'line-through text-gray-400' : 'text-text-dark dark:text-text-light'}`}>{task.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
                <Badge color={statusColor[task.status]}>{task.status}</Badge>
                <span className="text-xs text-gray-400">{task.dueDate}</span>
              </div>
            </div>
            <Badge color="gray">{task.category}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
