import { useState } from 'react';
import { Plus, Moon, Trash2, Droplets, Dumbbell } from 'lucide-react';
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

const EXERCISE_TYPES = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Walking', 'Other'];
const WATER_GOAL = 8;

const defaultMoodForm = { mood: 'happy', intensity: 3, notes: '', date: new Date().toISOString().split('T')[0] };
const defaultSleepForm = { bedtime: '23:00', wakeTime: '07:00', quality: 4, notes: '', date: new Date().toISOString().split('T')[0] };
const defaultExerciseForm = { type: 'Running', duration: '', calories: '', notes: '', date: new Date().toISOString().split('T')[0] };

const calcSleepDuration = (bedtime, wakeTime) => {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round(mins / 60 * 10) / 10;
};

const Trackers = () => {
  const [moodLog, setMoodLog] = useState(() => getData('moodLog', []));
  const [sleepLog, setSleepLog] = useState(() => getData('sleepLog', []));
  const [waterLog, setWaterLog] = useState(() => getData('waterLog', []));
  const [exerciseLog, setExerciseLog] = useState(() => getData('exerciseLog', []));
  const [tab, setTab] = useState('mood');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [moodForm, setMoodForm] = useState(defaultMoodForm);
  const [sleepForm, setSleepForm] = useState(defaultSleepForm);
  const [exerciseForm, setExerciseForm] = useState(defaultExerciseForm);
  const [exerciseErrors, setExerciseErrors] = useState({});
  const [sleepErrors, setSleepErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLog.find(w => w.date === today);
  const todayGlasses = todayWater?.glasses || 0;

  const persistMood = (u) => { setMoodLog(u); saveData('moodLog', u); };
  const persistSleep = (u) => { setSleepLog(u); saveData('sleepLog', u); };
  const persistWater = (u) => { setWaterLog(u); saveData('waterLog', u); };
  const persistExercise = (u) => { setExerciseLog(u); saveData('exerciseLog', u); };

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

  const adjustWater = (delta) => {
    const newGlasses = Math.max(0, Math.min(20, todayGlasses + delta));
    if (todayWater) {
      const updated = waterLog.map(w => w.date === today ? { ...w, glasses: newGlasses } : w);
      persistWater(updated);
    } else {
      persistWater([{ id: Date.now(), date: today, glasses: newGlasses }, ...waterLog]);
    }
    if (delta > 0) addToast('Water logged! 💧', 'success');
  };

  const validateExercise = () => {
    const e = {};
    if (!exerciseForm.duration || isNaN(Number(exerciseForm.duration)) || Number(exerciseForm.duration) <= 0) e.duration = 'Enter valid duration';
    if (!exerciseForm.date) e.date = 'Date is required';
    setExerciseErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleExerciseSubmit = (e) => {
    e.preventDefault();
    if (!validateExercise()) return;
    const entry = { id: Date.now(), type: exerciseForm.type, duration: Number(exerciseForm.duration), calories: exerciseForm.calories ? Number(exerciseForm.calories) : null, notes: exerciseForm.notes.trim(), date: exerciseForm.date };
    persistExercise([entry, ...exerciseLog]);
    addToast('Exercise logged! 💪', 'success');
    setShowExerciseModal(false);
    setExerciseForm(defaultExerciseForm);
    setExerciseErrors({});
  };

  const handleDelete = () => {
    const deleteTab = tab;
    if (deleteTab === 'mood') persistMood(moodLog.filter(e => e.id !== deleteConfirm));
    else if (deleteTab === 'sleep') persistSleep(sleepLog.filter(e => e.id !== deleteConfirm));
    else if (deleteTab === 'exercise') persistExercise(exerciseLog.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Entry deleted.', 'info');
  };

  const setMoodField = (key, val) => setMoodForm(f => ({ ...f, [key]: val }));
  const setSleepField = (key, val) => setSleepForm(f => ({ ...f, [key]: val }));
  const setExerciseField = (key, val) => setExerciseForm(f => ({ ...f, [key]: val }));

  const waterPct = Math.min(100, (todayGlasses / WATER_GOAL) * 100);

  const getAddButtonLabel = () => {
    if (tab === 'mood') return 'Log Mood';
    if (tab === 'sleep') return 'Log Sleep';
    if (tab === 'exercise') return 'Log Exercise';
    return null;
  };

  const handleAddButton = () => {
    if (tab === 'mood') setShowMoodModal(true);
    else if (tab === 'sleep') setShowSleepModal(true);
    else if (tab === 'exercise') setShowExerciseModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Trackers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mood, Sleep, Water & Exercise</p>
        </div>
        {tab !== 'water' && (
          <Button variant="primary" onClick={handleAddButton}>
            <Plus size={16} /> {getAddButtonLabel()}
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'mood', label: '😊 Mood' },
          { key: 'sleep', label: '🌙 Sleep' },
          { key: 'water', label: '💧 Water' },
          { key: 'exercise', label: '💪 Exercise' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t.key ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'mood' && (
        <div className="grid gap-3">
          {moodLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No mood entries yet. Log your mood!</p></Card>}
          {moodLog.map(entry => (
            <Card key={entry.id} className="flex items-center gap-4 animate-fade-in">
              <span className="text-3xl">{entry.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light capitalize">{entry.mood}</h3>
                  <Badge color={moodColors[entry.mood] || 'gray'}>Intensity {entry.intensity}/5</Badge>
                </div>
                {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
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
            <Card key={entry.id} className="flex items-start gap-4 animate-fade-in">
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

      {tab === 'water' && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <div className="text-center space-y-4">
              <div>
                <h3 className="font-heading font-semibold text-text-dark dark:text-text-light">Daily Water Intake</h3>
                <p className="text-sm text-gray-400">Goal: {WATER_GOAL} glasses per day</p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" className="dark:stroke-white/10" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6B9BD1" strokeWidth="2.5"
                      strokeDasharray={`${waterPct} 100`} strokeLinecap="round" className="transition-all duration-500" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl">💧</span>
                    <span className="text-2xl font-bold font-mono text-primary">{todayGlasses}</span>
                    <span className="text-xs text-gray-400">of {WATER_GOAL}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                {Array.from({ length: WATER_GOAL }).map((_, i) => (
                  <span key={i} className={`text-xl transition-all duration-300 ${i < todayGlasses ? 'opacity-100' : 'opacity-20'}`}>🥤</span>
                ))}
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2">
                <div className="h-full bg-gradient-to-r from-blue-400 to-primary rounded-full transition-all duration-500" style={{ width: `${waterPct}%` }} />
              </div>
              <p className="text-sm text-gray-500">{waterPct >= 100 ? '🎉 Daily goal reached!' : `${WATER_GOAL - todayGlasses} more to reach your goal`}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" onClick={() => adjustWater(-1)} disabled={todayGlasses === 0}>
                  − Remove
                </Button>
                <Button variant="primary" onClick={() => adjustWater(1)} disabled={todayGlasses >= 20}>
                  <Droplets size={16} /> + Add Glass
                </Button>
              </div>
            </div>
          </Card>
          <div className="grid gap-3">
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">History</h3>
            {waterLog.length === 0 && <Card><p className="text-center text-gray-400 py-2 text-sm">No water history yet.</p></Card>}
            {waterLog.slice(0, 7).map(entry => (
              <Card key={entry.id} className="flex items-center gap-4 py-3">
                <span className="text-2xl">💧</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-text-dark dark:text-text-light">{entry.date}</span>
                    <Badge color={entry.glasses >= WATER_GOAL ? 'green' : 'blue'}>{entry.glasses} glasses</Badge>
                  </div>
                  <div className="mt-1 w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, (entry.glasses / WATER_GOAL) * 100)}%` }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'exercise' && (
        <div className="grid gap-3">
          {exerciseLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No exercise entries yet. Log your workout!</p></Card>}
          {exerciseLog.map(entry => (
            <Card key={entry.id} className="flex items-start gap-4 animate-fade-in">
              <div className="p-3 rounded-xl bg-accent/10 flex-shrink-0">
                <Dumbbell size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{entry.type}</h3>
                  <Badge color="green">{entry.duration} min</Badge>
                  {entry.calories && <Badge color="yellow">{entry.calories} cal</Badge>}
                </div>
                {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
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

      {/* Log Exercise Modal */}
      <Modal isOpen={showExerciseModal} onClose={() => { setShowExerciseModal(false); setExerciseErrors({}); }} title="Log Exercise">
        <form onSubmit={handleExerciseSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Exercise Type</label>
            <select value={exerciseForm.type} onChange={e => setExerciseField('type', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Duration (min)" type="number" placeholder="30" value={exerciseForm.duration} onChange={e => setExerciseField('duration', e.target.value)} error={exerciseErrors.duration} min="1" />
            <Input label="Calories (optional)" type="number" placeholder="200" value={exerciseForm.calories} onChange={e => setExerciseField('calories', e.target.value)} min="0" />
          </div>
          <Input label="Date" type="date" value={exerciseForm.date} onChange={e => setExerciseField('date', e.target.value)} error={exerciseErrors.date} />
          <Input label="Notes (optional)" placeholder="How was your workout?" value={exerciseForm.notes} onChange={e => setExerciseField('notes', e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowExerciseModal(false); setExerciseErrors({}); }} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log Exercise</Button>
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
