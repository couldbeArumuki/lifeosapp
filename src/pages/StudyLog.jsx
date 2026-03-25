import { useState, useEffect } from 'react';
import { Plus, Clock, PenLine } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const subjects = { Japanese: 'purple', Programming: 'blue', Math: 'green', Other: 'gray' };

const StudyLog = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => { initializeData(allMockData); setLogs(getData('studyLog', [])); }, []);
  const totalMin = logs.reduce((s, l) => s + l.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Study Log</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total: {Math.floor(totalMin/60)}h {totalMin%60}min logged</p>
        </div>
        <Button variant="primary"><Plus size={16}/> Log Session</Button>
      </div>

      <div className="grid gap-3">
        {logs.map(log => (
          <Card key={log.id} className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <PenLine size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{log.subject}</h3>
                <Badge color={subjects[log.subject] || 'gray'}>{log.subject}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">{log.notes}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs flex items-center gap-1 text-gray-500"><Clock size={12}/> {log.duration} min</span>
                <span className="text-xs text-gray-400">{log.date}</span>
                <span className="text-xs text-yellow-500">{'★'.repeat(log.rating)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyLog;
