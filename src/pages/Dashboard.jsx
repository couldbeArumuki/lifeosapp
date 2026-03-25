import { useState, useEffect } from 'react';
import { CheckSquare, Target, BookOpen, Smile, Moon, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData, mockWeeklyData } from '../data/mockData';

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <Card className={`${bg} border-0`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-3xl font-bold font-mono mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-white/50 dark:bg-white/10`}>
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [studyLog, setStudyLog] = useState([]);
  const [moodLog, setMoodLog] = useState([]);
  const [sleepLog, setSleepLog] = useState([]);

  useEffect(() => {
    initializeData(allMockData);
    setTasks(getData('tasks', []));
    setHabits(getData('habits', []));
    setStudyLog(getData('studyLog', []));
    setMoodLog(getData('moodLog', []));
    setSleepLog(getData('sleepLog', []));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === today);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const todayStudy = studyLog.filter(s => s.date === today).reduce((sum, s) => sum + s.duration, 0);
  const todayMood = moodLog.find(m => m.date === today);
  const lastSleep = sleepLog[0];
  const habitsCompletedToday = habits.filter(h => h.completedDates?.includes(today)).length;

  const recentActivities = [
    ...studyLog.slice(0, 2).map(s => ({ type: 'study', text: `Studied ${s.subject} for ${s.duration} min`, time: s.date })),
    ...moodLog.slice(0, 1).map(m => ({ type: 'mood', text: `Logged mood: ${m.mood} ${m.emoji}`, time: m.date })),
    ...tasks.filter(t => t.completed).slice(0, 2).map(t => ({ type: 'task', text: `Completed: ${t.title}`, time: t.dueDate })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here&apos;s your daily overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={CheckSquare} label="Tasks Today" value={`${completedToday}/${todayTasks.length}`} sub="completed" color="text-primary" bg="bg-primary/5 dark:bg-primary/10" />
        <StatCard icon={Target} label="Habits" value={`${habitsCompletedToday}/${habits.length}`} sub="done today" color="text-secondary" bg="bg-secondary/5 dark:bg-secondary/10" />
        <StatCard icon={BookOpen} label="Study Time" value={`${Math.round(todayStudy/60*10)/10}h`} sub="today" color="text-accent" bg="bg-accent/5 dark:bg-accent/10" />
        <StatCard icon={Smile} label="Mood" value={todayMood?.emoji || '—'} sub={todayMood?.mood || 'not logged'} color="text-tertiary" bg="bg-tertiary/5 dark:bg-tertiary/10" />
        <StatCard icon={Moon} label="Sleep" value={lastSleep ? `${lastSleep.duration}h` : '—'} sub={lastSleep ? `Quality ${lastSleep.quality}/5` : 'no data'} color="text-primary" bg="bg-blue-50 dark:bg-blue-900/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockWeeklyData}>
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
            <Activity size={18} className="text-secondary" /> Weekly Tasks &amp; Mood
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#B19CD9" radius={[4,4,0,0]} />
              <Bar dataKey="mood" fill="#7EC8A3" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Task', icon: CheckSquare, color: 'primary' },
              { label: 'Log Mood', icon: Smile, color: 'secondary' },
              { label: 'Study Session', icon: BookOpen, color: 'tertiary' },
              { label: 'Log Sleep', icon: Moon, color: 'ghost' },
            ].map(({ label, icon: Icon, color }) => (
              <Button key={label} variant={color} className="justify-center py-3 text-xs">
                <Icon size={16} /> {label}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-4">Recent Activity</h3>
          <div className="space-y-3">
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
