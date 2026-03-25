import { useState, useEffect } from 'react';
import { Plus, Moon } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const moodColors = { happy: 'green', focused: 'blue', tired: 'gray', motivated: 'purple', calm: 'green', anxious: 'red' };

const Trackers = () => {
  const [moodLog, setMoodLog] = useState([]);
  const [sleepLog, setSleepLog] = useState([]);
  const [tab, setTab] = useState('mood');

  useEffect(() => {
    initializeData(allMockData);
    setMoodLog(getData('moodLog', []));
    setSleepLog(getData('sleepLog', []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Trackers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mood &amp; Sleep tracking</p>
        </div>
        <Button variant="primary"><Plus size={16}/> Log Entry</Button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('mood')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab==='mood' ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
          😊 Mood
        </button>
        <button onClick={() => setTab('sleep')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab==='sleep' ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
          🌙 Sleep
        </button>
      </div>

      {tab === 'mood' && (
        <div className="grid gap-3">
          {moodLog.map(entry => (
            <Card key={entry.id} className="flex items-center gap-4">
              <span className="text-3xl">{entry.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light capitalize">{entry.mood}</h3>
                  <Badge color={moodColors[entry.mood] || 'gray'}>Intensity {entry.intensity}/5</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>
                <p className="text-xs text-gray-300 mt-1">{entry.date}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'sleep' && (
        <div className="grid gap-3">
          {sleepLog.map(entry => (
            <Card key={entry.id} className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Moon size={18} className="text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{entry.date}</h3>
                  <Badge color="blue">{entry.duration}h sleep</Badge>
                  <Badge color={entry.quality >= 4 ? 'green' : entry.quality >= 3 ? 'yellow' : 'red'}>Quality {entry.quality}/5</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-1">{entry.bedtime} → {entry.wakeTime} • {entry.notes}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trackers;
