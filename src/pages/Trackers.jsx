import { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Plus, Moon, Trash2, Droplets, Dumbbell, Banknote, TrendingUp, TrendingDown, Scale } from 'lucide-react';
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

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Education', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

const defaultMoodForm = { mood: 'happy', intensity: 3, notes: '', date: new Date().toISOString().split('T')[0] };
const defaultSleepForm = { bedtime: '23:00', wakeTime: '07:00', quality: 4, notes: '', date: new Date().toISOString().split('T')[0] };
const defaultHealthForm = { water: 8, exercise: 30, weight: '', date: new Date().toISOString().split('T')[0], notes: '' };
const defaultFinanceForm = { type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] };

const formatIDR = (amount) => `Rp ${Math.round(amount).toLocaleString('id-ID')}`;

const calcSleepDuration = (bedtime, wakeTime) => {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round(mins / 60 * 10) / 10;
};

const TABS = [
  { key: 'mood',    label: 'Mood',    emoji: '😊' },
  { key: 'sleep',   label: 'Sleep',   emoji: '🌙' },
  { key: 'health',  label: 'Health',  emoji: '💪' },
  { key: 'finance', label: 'Finance', emoji: '💰' },
];

const Trackers = () => {
  const [moodLog, setMoodLog] = useState(() => getData('moodLog', []));
  const [sleepLog, setSleepLog] = useState(() => getData('sleepLog', []));
  const [healthLog, setHealthLog] = useState(() => getData('healthLog', []));
  const [financeLog, setFinanceLog] = useState(() => getData('financeLog', []));
  const [tab, setTab] = useState('mood');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [moodForm, setMoodForm] = useState(defaultMoodForm);
  const [sleepForm, setSleepForm] = useState(defaultSleepForm);
  const [healthForm, setHealthForm] = useState(defaultHealthForm);
  const [financeForm, setFinanceForm] = useState(defaultFinanceForm);
  const [sleepErrors, setSleepErrors] = useState({});
  const [financeErrors, setFinanceErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const moodTrendData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const entries = moodLog.filter(e => e.date === dateStr);
      const avg = entries.length ? parseFloat((entries.reduce((s, e) => s + e.intensity, 0) / entries.length).toFixed(1)) : null;
      return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), intensity: avg };
    });
  }, [moodLog]);

  const persistMood = (updated) => { setMoodLog(updated); saveData('moodLog', updated); };
  const persistSleep = (updated) => { setSleepLog(updated); saveData('sleepLog', updated); };
  const persistHealth = (updated) => { setHealthLog(updated); saveData('healthLog', updated); };
  const persistFinance = (updated) => { setFinanceLog(updated); saveData('financeLog', updated); };

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

  const handleHealthSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: healthForm.date,
      water: Number(healthForm.water),
      exercise: Number(healthForm.exercise),
      weight: healthForm.weight ? Number(healthForm.weight) : null,
      notes: healthForm.notes.trim(),
    };
    persistHealth([entry, ...healthLog]);
    addToast('Health logged!', 'success');
    setShowHealthModal(false);
    setHealthForm(defaultHealthForm);
  };

  const validateFinance = () => {
    const e = {};
    if (!financeForm.amount || isNaN(Number(financeForm.amount)) || Number(financeForm.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!financeForm.date) e.date = 'Date is required';
    setFinanceErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFinanceSubmit = (e) => {
    e.preventDefault();
    if (!validateFinance()) return;
    const entry = {
      id: Date.now(),
      type: financeForm.type,
      amount: Math.round(Number(financeForm.amount)),
      category: financeForm.category,
      description: financeForm.description.trim(),
      date: financeForm.date,
    };
    persistFinance([entry, ...financeLog]);
    addToast(`${financeForm.type === 'income' ? 'Income' : 'Expense'} logged!`, 'success');
    setShowFinanceModal(false);
    setFinanceForm(defaultFinanceForm);
    setFinanceErrors({});
  };

  const handleDelete = () => {
    if (tab === 'mood') persistMood(moodLog.filter(e => e.id !== deleteConfirm));
    else if (tab === 'sleep') persistSleep(sleepLog.filter(e => e.id !== deleteConfirm));
    else if (tab === 'health') persistHealth(healthLog.filter(e => e.id !== deleteConfirm));
    else persistFinance(financeLog.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Entry deleted.', 'info');
  };

  const setMoodField = (key, val) => setMoodForm(f => ({ ...f, [key]: val }));
  const setSleepField = (key, val) => setSleepForm(f => ({ ...f, [key]: val }));
  const setHealthField = (key, val) => setHealthForm(f => ({ ...f, [key]: val }));
  const setFinanceField = (key, val) => setFinanceForm(f => ({ ...f, [key]: val }));

  // Finance summary
  const totalIncome = financeLog.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpense = financeLog.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const openLogModal = () => {
    if (tab === 'mood') setShowMoodModal(true);
    else if (tab === 'sleep') setShowSleepModal(true);
    else if (tab === 'health') setShowHealthModal(true);
    else setShowFinanceModal(true);
  };

  const logLabel = { mood: 'Mood', sleep: 'Sleep', health: 'Health', finance: 'Finance' };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Trackers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mood, Sleep, Health &amp; Finance tracking</p>
        </div>
        <Button variant="primary" onClick={openLogModal}>
          <Plus size={16} /> Log {logLabel[tab]}
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${tab === t.key ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'}`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── MOOD TAB ── */}
      {tab === 'mood' && (
        <div className="grid gap-3">
          <Card>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Mood Intensity — Last 7 Days</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={moodTrendData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => (v !== null ? [`${v}/5`, 'Intensity'] : ['—', 'Intensity'])} />
                <Line type="monotone" dataKey="intensity" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3, fill: '#7c3aed' }} connectNulls activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
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

      {/* ── SLEEP TAB ── */}
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

      {/* ── HEALTH TAB ── */}
      {tab === 'health' && (
        <div className="space-y-4">
          {healthLog.length > 0 && (() => {
            const avgWater = Math.round(healthLog.reduce((s,e)=>s+e.water,0)/healthLog.length);
            const avgExercise = Math.round(healthLog.reduce((s,e)=>s+e.exercise,0)/healthLog.length);
            const latestWithWeight = healthLog.find(e=>e.weight);
            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Water', value: `${avgWater} cups`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Avg Exercise', value: `${avgExercise} min`, icon: Dumbbell, color: 'text-accent', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { label: 'Latest Weight', value: latestWithWeight ? `${latestWithWeight.weight} kg` : '—', icon: Scale, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map(s => (
                  <Card key={s.label} className={`${s.bg} border-0`}>
                    <div className="flex items-center gap-2">
                      <s.icon size={16} className={s.color} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
                    </div>
                    <p className={`text-xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
                  </Card>
                ))}
              </div>
            );
          })()}
          <div className="grid gap-3">
            {healthLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No health entries yet. Start tracking!</p></Card>}
            {healthLog.map(entry => (
              <Card key={entry.id} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 flex-shrink-0">
                  <Dumbbell size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{entry.date}</h3>
                    <Badge color="blue"><Droplets size={10} className="inline" /> {entry.water} cups</Badge>
                    <Badge color="green"><Dumbbell size={10} className="inline" /> {entry.exercise} min</Badge>
                    {entry.weight && <Badge color="purple">{entry.weight} kg</Badge>}
                  </div>
                  {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                </div>
                <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── FINANCE TAB ── */}
      {tab === 'finance' && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-green-50 dark:bg-green-900/20 border-0">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Income</span>
              </div>
              <p className="text-xl font-bold font-mono mt-1 text-green-600">{formatIDR(totalIncome)}</p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/20 border-0">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-red-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Expenses</span>
              </div>
              <p className="text-xl font-bold font-mono mt-1 text-red-500">{formatIDR(totalExpense)}</p>
            </Card>
            <Card className={`border-0 ${balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
              <div className="flex items-center gap-2">
                <Banknote size={16} className={balance >= 0 ? 'text-primary' : 'text-orange-500'} />
                <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
              </div>
              <p className={`text-xl font-bold font-mono mt-1 ${balance >= 0 ? 'text-primary' : 'text-orange-500'}`}>{formatIDR(balance)}</p>
            </Card>
          </div>

          <div className="grid gap-3">
            {financeLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No finance entries yet. Start tracking!</p></Card>}
            {financeLog.map(entry => (
              <Card key={entry.id} className="flex items-center gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${entry.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  {entry.type === 'income' ? <TrendingUp size={18} className="text-green-600" /> : <TrendingDown size={18} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm text-text-dark dark:text-text-light truncate">{entry.description || entry.category}</h3>
                    <Badge color={entry.type === 'income' ? 'green' : 'red'}>{entry.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-sm font-mono ${entry.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatIDR(entry.amount)}
                  </p>
                </div>
                <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
              </Card>
            ))}
          </div>
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

      {/* Log Health Modal */}
      <Modal isOpen={showHealthModal} onClose={() => setShowHealthModal(false)} title="Log Health" size="sm">
        <form onSubmit={handleHealthSubmit} className="space-y-4">
          <Input label="Date" type="date" value={healthForm.date} onChange={e => setHealthField('date', e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">💧 Water Intake: {healthForm.water} cups</label>
            <input type="range" min="0" max="20" value={healthForm.water} onChange={e => setHealthField('water', Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400"><span>0</span><span>20 cups</span></div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">🏃 Exercise: {healthForm.exercise} min</label>
            <input type="range" min="0" max="180" step="5" value={healthForm.exercise} onChange={e => setHealthField('exercise', Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400"><span>0</span><span>180 min</span></div>
          </div>
          <Input label="Weight (kg, optional)" type="number" step="0.1" placeholder="e.g. 65.5" value={healthForm.weight} onChange={e => setHealthField('weight', e.target.value)} />
          <Input label="Notes (optional)" placeholder="How do you feel?" value={healthForm.notes} onChange={e => setHealthField('notes', e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowHealthModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log Health</Button>
          </div>
        </form>
      </Modal>

      {/* Log Finance Modal */}
      <Modal isOpen={showFinanceModal} onClose={() => { setShowFinanceModal(false); setFinanceErrors({}); }} title="Log Finance" size="sm">
        <form onSubmit={handleFinanceSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button key={t} type="button" onClick={() => {
                setFinanceField('type', t);
                setFinanceField('category', t === 'income' ? 'Salary' : 'Food');
              }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all border-2 ${financeForm.type === t ? (t === 'income' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400') : 'border-gray-100 dark:border-white/10 text-gray-500 hover:border-gray-200'}`}>
                {t === 'income' ? '📈' : '📉'} {t}
              </button>
            ))}
          </div>
          <Input label="Amount (Rp)" type="number" step="1" placeholder="0" value={financeForm.amount} onChange={e => setFinanceField('amount', e.target.value)} error={financeErrors.amount} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
            <select value={financeForm.category} onChange={e => setFinanceField('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 text-text-dark dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {(financeForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input label="Description (optional)" placeholder="e.g. Lunch at cafe" value={financeForm.description} onChange={e => setFinanceField('description', e.target.value)} />
          <Input label="Date" type="date" value={financeForm.date} onChange={e => setFinanceField('date', e.target.value)} error={financeErrors.date} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowFinanceModal(false); setFinanceErrors({}); }} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log {financeForm.type === 'income' ? 'Income' : 'Expense'}</Button>
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
