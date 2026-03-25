import { useState } from 'react';
import { Plus, Moon, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const moodColors = { happy: 'green', focused: 'blue', tired: 'gray', motivated: 'purple', calm: 'green', anxious: 'red' };

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Happy' },
  { key: 'focused', emoji: '🎯', label: 'Focused' },
  { key: 'motivated', emoji: '🚀', label: 'Motivated' },
  { key: 'calm', emoji: '🌿', label: 'Calm' },
  { key: 'tired', emoji: '😴', label: 'Tired' },
  { key: 'anxious', emoji: '😰', label: 'Anxious' },
];

const defaultMoodForm = { mood: 'happy', intensity: 3, notes: '', date: new Date().toISOString().split('T')[0] };
const defaultSleepForm = { bedtime: '23:00', wakeTime: '07:00', quality: 4, notes: '', date: new Date().toISOString().split('T')[0] };

const calcSleepDuration = (bedtime, wakeTime) => {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round(mins / 60 * 10) / 10;
};

const Trackers = () => {
  const [moodLog, setMoodLog] = useState(() => {
    return getData('moodLog', []);
  });
  const [sleepLog, setSleepLog] = useState(() => getData('sleepLog', []));
  const [tab, setTab] = useState('mood');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [moodForm, setMoodForm] = useState(defaultMoodForm);
  const [sleepForm, setSleepForm] = useState(defaultSleepForm);
  const [sleepErrors, setSleepErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const persistMood = (updated) => { setMoodLog(updated); saveData('moodLog', updated); };
  const persistSleep = (updated) => { setSleepLog(updated); saveData('sleepLog', updated); };

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    const mood = MOODS.find(m => m.key === moodForm.mood);
    const entry = { id: Date.now(), mood: moodForm.mood, emoji: mood.emoji, intensity: Number(moodForm.intensity), notes: moodForm.notes.trim(), date: moodForm.date };
    persistMood([entry, ...moodLog]);
    addToast('Mood logged!', 'success');
    setShowMoodModal(false);
    setMoodForm(defaultMoodForm);
  };

  const validateSleep = () => {
    const e = {};
    if (!sleepForm.date) e.date = 'Date is required';
    const dur = calcSleepDuration(sleepForm.bedtime, sleepForm.wakeTime);
    if (dur <= 0 || dur > 24) e.wakeTime = 'Invalid sleep duration';
    setSleepErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSleepSubmit = (e) => {
    e.preventDefault();
    if (!validateSleep()) return;
    const duration = calcSleepDuration(sleepForm.bedtime, sleepForm.wakeTime);
    const entry = { id: Date.now(), date: sleepForm.date, bedtime: sleepForm.bedtime, wakeTime: sleepForm.wakeTime, duration, quality: Number(sleepForm.quality), notes: sleepForm.notes.trim() };
    persistSleep([entry, ...sleepLog]);
    addToast('Sleep logged!', 'success');
    setShowSleepModal(false);
    setSleepForm(defaultSleepForm);
    setSleepErrors({});
  };

  const handleDelete = () => {
    if (tab === 'mood') persistMood(moodLog.filter(e => e.id !== deleteConfirm));
    else persistSleep(sleepLog.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Entry deleted.', 'info');
  };

  const setMoodField = (key, val) => setMoodForm(f => ({ ...f, [key]: val }));
  const setSleepField = (key, val) => setSleepForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Trackers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mood &amp; Sleep tracking</p>
        </div>
        <Button variant="primary" onClick={() => tab === 'mood' ? setShowMoodModal(true) : setShowSleepModal(true)}>
          <Plus size={16} /> Log {tab === 'mood' ? 'Mood' : 'Sleep'}
        </Button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('mood')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'mood' ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
          😊 Mood
        </button>
        <button onClick={() => setTab('sleep')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'sleep' ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
          🌙 Sleep
        </button>
      </div>

      {tab === 'mood' && (
        <div className="grid gap-3">
          {moodLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No mood entries yet. Log your mood!</p></Card>}
          {moodLog.map(entry => (
            <Card key={entry.id} className="flex items-center gap-4">
              <span className="text-3xl">{entry.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light capitalize">{entry.mood}</h3>
                  <Badge color={moodColors[entry.mood] || 'gray'}>Intensity {entry.intensity}/5</Badge>
                </div>
                {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                <p className="text-xs text-gray-300 mt-1">{entry.date}</p>
              </div>
              <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'sleep' && (
        <div className="grid gap-3">
          {sleepLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No sleep entries yet. Log your sleep!</p></Card>}
          {sleepLog.map(entry => (
            <Card key={entry.id} className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-secondary/10 flex-shrink-0">
                <Moon size={18} className="text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{entry.date}</h3>
                  <Badge color="blue">{entry.duration}h sleep</Badge>
                  <Badge color={entry.quality >= 4 ? 'green' : entry.quality >= 3 ? 'yellow' : 'red'}>Quality {entry.quality}/5</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-1">{entry.bedtime} → {entry.wakeTime}{entry.notes ? ` • ${entry.notes}` : ''}</p>
              </div>
              <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
            </Card>
          ))}
        </div>
      )}

      {/* Log Mood Modal */}
      <Modal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} title="Log Mood" size="sm">
        <form onSubmit={handleMoodSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">How are you feeling?</label>
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map(m => (
                <button key={m.key} type="button" onClick={() => setMoodField('mood', m.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${moodForm.mood === m.key ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-white/10 hover:border-gray-200'}`}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Intensity: {moodForm.intensity}/5</label>
            <input type="range" min="1" max="5" value={moodForm.intensity} onChange={e => setMoodField('intensity', Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <Input label="Date" type="date" value={moodForm.date} onChange={e => setMoodField('date', e.target.value)} />
          <Input label="Notes (optional)" placeholder="How was your day?" value={moodForm.notes} onChange={e => setMoodField('notes', e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowMoodModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log Mood</Button>
          </div>
        </form>
      </Modal>

      {/* Log Sleep Modal */}
      <Modal isOpen={showSleepModal} onClose={() => { setShowSleepModal(false); setSleepErrors({}); }} title="Log Sleep">
        <form onSubmit={handleSleepSubmit} className="space-y-4">
          <Input label="Date" type="date" value={sleepForm.date} onChange={e => setSleepField('date', e.target.value)} error={sleepErrors.date} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Bedtime" type="time" value={sleepForm.bedtime} onChange={e => setSleepField('bedtime', e.target.value)} />
            <Input label="Wake Time" type="time" value={sleepForm.wakeTime} onChange={e => setSleepField('wakeTime', e.target.value)} error={sleepErrors.wakeTime} />
          </div>
          {sleepForm.bedtime && sleepForm.wakeTime && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Duration: <strong>{calcSleepDuration(sleepForm.bedtime, sleepForm.wakeTime)}h</strong>
            </p>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Sleep Quality: {sleepForm.quality}/5</label>
            <input type="range" min="1" max="5" value={sleepForm.quality} onChange={e => setSleepField('quality', Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400"><span>Poor</span><span>Excellent</span></div>
          </div>
          <Input label="Notes (optional)" placeholder="How was your sleep?" value={sleepForm.notes} onChange={e => setSleepField('notes', e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowSleepModal(false); setSleepErrors({}); }} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log Sleep</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Entry" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Delete this entry? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Trackers;
