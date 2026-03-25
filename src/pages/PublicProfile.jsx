import { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getData } from '../utils/localStorage';
import { computeWeeklyData } from '../utils/localStorage';
import { Globe, BookOpen, Target, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PublicProfile = () => {
  const [goals] = useState(() => getData('goals', []));
  const [habits] = useState(() => getData('habits', []));
  const [japanese] = useState(() => getData('japanese', null));
  const [studyLog] = useState(() => getData('studyLog', []));
  const weeklyData = computeWeeklyData(studyLog, [], []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">Z</span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Zizou</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Personal Growth Journey 🌱</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge color="blue"><Globe size={10} /> Public Profile</Badge>
          <Badge color="purple">JLPT N3 Student</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Habits', value: habits.length, icon: Target, color: 'text-primary' },
          { label: 'Goals', value: goals.length, icon: Trophy, color: 'text-secondary' },
          { label: 'Japanese', value: japanese?.currentLevel || 'N3', icon: BookOpen, color: 'text-accent' },
        ].map(({ label, value, icon, color }) => {
          const Icon = icon;
          return (
            <Card key={label} className="text-center">
              <Icon size={24} className={`${color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">🎯 Goals Progress</h3>
        <div className="space-y-4">
          {goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
            return (
              <div key={goal.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-text-dark dark:text-text-light">{goal.title}</span>
                  <span className="text-gray-400">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">📊 Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B9BD1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6B9BD1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="study" stroke="#6B9BD1" fill="url(#pubGrad)" strokeWidth={2} name="Study Hours" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <p className="text-center text-xs text-gray-400">📖 Read-only public profile • Powered by LifeOS</p>
    </div>
  );
};

export default PublicProfile;
