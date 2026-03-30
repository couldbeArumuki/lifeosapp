import { useState } from 'react';
import { CheckSquare, Target, BookOpen, TrendingUp, Activity, Dumbbell, Banknote, Smile, Moon, Map } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';
import { computeWeeklyData } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

const MOODS = [
  { key: 'happy',     emoji: '😊', label: 'Happy' },
  { key: 'focused',   emoji: '🎯', label: 'Focused' },
  { key: 'motivated', emoji: '🚀', label: 'Motivated' },
  { key: 'calm',      emoji: '🌿', label: 'Calm' },
  { key: 'tired',     emoji: '😴', label: 'Tired' },
  { key: 'anxious',   emoji: '😰', label: 'Anxious' },
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

const StatCard = ({ icon, label, value, sub, color, bg, progress }) => {
  const Icon = icon;
  return (
    <Card className={`${bg} border-0 card-hover`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color} bg-white/60 dark:bg-white/10`}>
          <Icon size={18} />
        </div>
      </div>
      {progress !== undefined && (
        <div className="progress-track mt-2">
          <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}
    </Card>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Good night', emoji: '🌙' };
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  return { text: 'Good evening', emoji: '🌆' };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [tasks] = useState(() => getData('tasks', []));
  const [habits] = useState(() => getData('habits', []));
  const [studyLog] = useState(() => getData('studyLog', []));
  const [healthLog] = useState(() => getData('healthLog', []));
  const [financeLog] = useState(() => getData('financeLog', []));
  const [japanPlans] = useState(() => getData('japanPlans', []));

  // Mood & Sleep quick-log state
  const [moodLog, setMoodLog] = useState(() => getData('moodLog', []));
  const [sleepLog, setSleepLog] = useState(() => getData('sleepLog', []));
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [moodForm, setMoodForm] = useState(defaultMoodForm);
  const [sleepForm, setSleepForm] = useState(defaultSleepForm);
  const [sleepErrors, setSleepErrors] = useState({});

  const setMoodField = (k, v) => setMoodForm(f => ({ ...f, [k]: v }));
  const setSleepField = (k, v) => setSleepForm(f => ({ ...f, [k]: v }));

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    const mood = MOODS.find(m => m.key === moodForm.mood);
    const entry = { id: Date.now(), mood: moodForm.mood, emoji: mood.emoji, intensity: Number(moodForm.intensity), notes: moodForm.notes.trim(), date: moodForm.date };
    const updated = [entry, ...moodLog];
    setMoodLog(updated);
    saveData('moodLog', updated);
    addToast('Mood logged! 😊', 'success');
    setShowMoodModal(false);
    setMoodForm(defaultMoodForm);
  };

  const validateSleep = () => {
    const e = {};
    if (!sleepForm.date) e.date = 'Date is required';
    const dur = calcSleepDuration(sleepForm.bedtime, sleepForm.wakeTime);
    if (dur <= 0 || dur > 24) e.wakeTime = 'Wake time must be after bedtime (max 24h)';
    setSleepErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSleepSubmit = (e) => {
    e.preventDefault();
    if (!validateSleep()) return;
    const duration = calcSleepDuration(sleepForm.bedtime, sleepForm.wakeTime);
    const entry = { id: Date.now(), date: sleepForm.date, bedtime: sleepForm.bedtime, wakeTime: sleepForm.wakeTime, duration, quality: Number(sleepForm.quality), notes: sleepForm.notes.trim() };
    const updated = [entry, ...sleepLog];
    setSleepLog(updated);
    saveData('sleepLog', updated);
    addToast('Sleep logged! 🌙', 'success');
    setShowSleepModal(false);
    setSleepForm(defaultSleepForm);
    setSleepErrors({});
  };

  const today = new Date().toISOString().split('T')[0];
  const todayMood = moodLog.find(m => m.date === today);
  const todaySleep = sleepLog.find(s => s.date === today);

  const weeklyData = computeWeeklyData(studyLog, tasks);

  const todayTasks = tasks.filter(t => t.dueDate === today);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const todayStudy = studyLog.filter(s => s.date === today).reduce((sum, s) => sum + s.duration, 0);
  const habitsCompletedToday = habits.filter(h => h.completedDates?.includes(today)).length;
  const todayHealth = healthLog.find(h => h.date === today);

  const monthStart = today.slice(0, 7);
  const monthExpenses = financeLog.filter(e => e.type === 'expense' && e.date?.startsWith(monthStart)).reduce((s, e) => s + e.amount, 0);

  const { text: greetText, emoji: greetEmoji } = getGreeting();

  const recentActivities = [
    ...studyLog.slice(0, 2).map(s => ({ type: 'study', text: `Studied ${s.subject} for ${s.duration} min`, time: s.date })),
    ...tasks.filter(t => t.completed).slice(0, 2).map(t => ({ type: 'task', text: `Completed: ${t.title}`, time: t.dueDate })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const STUDY_GOAL_MINS = 120;
  const WATER_GOAL_CUPS = 8;

  const taskProgress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;
  const habitProgress = habits.length > 0 ? (habitsCompletedToday / habits.length) * 100 : 0;
  const studyProgress = Math.min(100, (todayStudy / STUDY_GOAL_MINS) * 100);
  const waterProgress = todayHealth ? Math.min(100, (todayHealth.water / WATER_GOAL_CUPS) * 100) : 0;

  const japanTotal = japanPlans.length;
  const japanCompleted = japanPlans.filter(p => p.status === 'completed').length;
  const japanInProgress = japanPlans.filter(p => p.status === 'in-progress').length;
  const japanNotStarted = japanPlans.filter(p => p.status === 'not-started').length;
  const japanPct = japanTotal > 0 ? Math.round((japanCompleted / japanTotal) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">
            {greetText}! {greetEmoji}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here&apos;s your daily overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard icon={CheckSquare} label="Tasks Today" value={`${completedToday}/${todayTasks.length}`} sub="completed" color="text-primary" bg="bg-primary/5 dark:bg-primary/10" progress={taskProgress} />
        <StatCard icon={Target} label="Habits" value={`${habitsCompletedToday}/${habits.length}`} sub="done today" color="text-secondary" bg="bg-secondary/5 dark:bg-secondary/10" progress={habitProgress} />
        <StatCard icon={BookOpen} label="Study Time" value={`${Math.round(todayStudy / 60 * 10) / 10}h`} sub="today" color="text-accent" bg="bg-accent/5 dark:bg-accent/10" progress={studyProgress} />
        <StatCard icon={Dumbbell} label="Exercise" value={todayHealth ? `${todayHealth.exercise}m` : '—'} sub={todayHealth ? `💧 ${todayHealth.water} cups` : 'not logged'} color="text-accent" bg="bg-green-50 dark:bg-green-900/10" progress={waterProgress} />
        <StatCard icon={Banknote} label="Month Spend" value={`Rp ${Math.round(monthExpenses).toLocaleString('id-ID')}`} sub="this month" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B9BD1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6B9BD1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="study" stroke="#6B9BD1" fill="url(#studyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
            <Activity size={18} className="text-secondary" /> Weekly Tasks
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#B19CD9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Task', icon: CheckSquare, color: 'primary', path: '/tasks' },
              { label: 'Study Session', icon: BookOpen, color: 'tertiary', path: '/study-log' },
              { label: 'Trackers', icon: Activity, color: 'outline', path: '/trackers' },
              { label: 'Goals', icon: Banknote, color: 'ghost', path: '/goals' },
            ].map(({ label, icon, color, path }) => {
              const Icon = icon;
              return (
                <Button key={label} variant={color} onClick={() => navigate(path)} className="justify-center py-3 text-xs">
                  <Icon size={16} /> {label}
                </Button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.length === 0 && <p className="text-sm text-gray-400">No recent activity yet.</p>}
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 bg-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-text-dark dark:text-text-light">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* MYJapan Plans Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light flex items-center gap-2">
            <Map size={18} className="text-primary" /> 🇯🇵 MYJapan Plans
          </h3>
          <Button variant="ghost" onClick={() => navigate('/myjapan-plans')} className="py-1.5 px-3 text-xs">
            View Plans
          </Button>
        </div>
        {japanTotal === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">No Japan plans added yet.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</span>
              <span className="text-lg font-bold font-mono text-primary">{japanPct}%</span>
            </div>
            <div className="progress-track mb-4">
              <div className="progress-bar" style={{ width: `${japanPct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Completed', value: japanCompleted, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
                { label: 'In Progress', value: japanInProgress, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
                { label: 'Not Started', value: japanNotStarted, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-white/5' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`text-center p-2 rounded-xl ${bg}`}>
                  <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">{japanCompleted} of {japanTotal} plans completed</p>
          </>
        )}
      </Card>

      {/* M&S Trace — Quick Mood & Sleep Log */}
      <Card>
        <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
          <Smile size={18} className="text-pink-500" /> M&amp;S Trace
          <span className="text-xs font-normal text-gray-400 ml-1">— quick mood &amp; sleep log</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mood quick log */}
          <div className="rounded-xl bg-pink-50 dark:bg-pink-900/10 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-dark dark:text-text-light flex items-center gap-1"><Smile size={15} className="text-pink-500" /> Mood</p>
                {todayMood
                  ? <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{todayMood.emoji} {MOODS.find(m => m.key === todayMood.mood)?.label ?? todayMood.mood} · intensity {todayMood.intensity}/5</p>
                  : <p className="text-xs text-gray-400 mt-0.5">Not logged today</p>
                }
              </div>
              <Button variant="primary" onClick={() => setShowMoodModal(true)} className="py-1.5 px-3 text-xs">
                Log Mood
              </Button>
            </div>
          </div>

          {/* Sleep quick log */}
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/10 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-dark dark:text-text-light flex items-center gap-1"><Moon size={15} className="text-indigo-500" /> Sleep</p>
                {todaySleep
                  ? <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{todaySleep.duration}h · quality {todaySleep.quality}/5</p>
                  : <p className="text-xs text-gray-400 mt-0.5">Not logged today</p>
                }
              </div>
              <Button variant="secondary" onClick={() => setShowSleepModal(true)} className="py-1.5 px-3 text-xs">
                Log Sleep
              </Button>
            </div>
          </div>
        </div>
      </Card>

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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Dashboard;
