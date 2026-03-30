import { useState } from 'react';
import { CheckSquare, Target, BookOpen, TrendingUp, Activity, Dumbbell, Banknote } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import { getData } from '../utils/localStorage';
import { computeWeeklyData } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

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
  const [tasks] = useState(() => getData('tasks', []));
  const [habits] = useState(() => getData('habits', []));
  const [studyLog] = useState(() => getData('studyLog', []));
  const [healthLog] = useState(() => getData('healthLog', []));
  const [financeLog] = useState(() => getData('financeLog', []));

  const weeklyData = computeWeeklyData(studyLog, tasks);

  const today = new Date().toISOString().split('T')[0];
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
    </div>
  );
};

export default Dashboard;
