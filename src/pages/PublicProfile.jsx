import { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getData } from '../utils/localStorage';
import { Globe, BookOpen, Target, Trophy, Sun, Moon, Music2, Droplets, Dumbbell, Heart } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const MJ_ALBUM_ID = '3OBhnTLrvkoEEETjFA3Qfk';

const moodEmoji = { happy: '😊', focused: '🎯', motivated: '🚀', calm: '🌿', tired: '😴', anxious: '😰' };
const moodColor = { happy: 'text-green-500', focused: 'text-blue-500', motivated: 'text-purple-500', calm: 'text-teal-500', tired: 'text-gray-400', anxious: 'text-red-400' };

const PublicProfile = () => {
  const [goals] = useState(() => getData('goals', []));
  const [habits] = useState(() => getData('habits', []));
  const [japanese] = useState(() => getData('japanese', null));
  const [studyLog] = useState(() => getData('studyLog', []));
  const [moodLog] = useState(() => getData('moodLog', []));
  const [healthLog] = useState(() => getData('healthLog', []));
  const { isDark, toggleTheme } = useTheme();

  const totalStudyMinutes = studyLog.reduce((sum, s) => sum + (s.duration || 0), 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = totalStudyMinutes % 60;

  const booksRead = (() => {
    const booksGoal = goals.find(g => g.title?.toLowerCase().includes('book'));
    return booksGoal ? booksGoal.progress : 0;
  })();

  // Mood trend – last 7 entries
  const recentMoods = moodLog.slice(0, 7).reverse();

  // Mood frequency for top mood
  const moodCounts = moodLog.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Health – last 7 days average
  const recentHealth = healthLog.slice(0, 7);
  const avgWater = recentHealth.length > 0
    ? Math.round(recentHealth.reduce((s, e) => s + (e.water || 0), 0) / recentHealth.length)
    : 0;
  const avgExercise = recentHealth.length > 0
    ? Math.round(recentHealth.reduce((s, e) => s + (e.exercise || 0), 0) / recentHealth.length)
    : 0;
  const totalExerciseMin = healthLog.reduce((s, e) => s + (e.exercise || 0), 0);
  const waterGoal = 8; // cups per day target

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xs">L</span>
          </div>
          <span className="font-heading font-bold text-text-dark dark:text-text-light text-sm">LifeOS</span>
          <Badge color="blue" className="ml-1"><Globe size={10} className="inline mr-1" />Public</Badge>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-16">

        {/* Profile Header */}
        <Card className="text-center py-8">
          <div className="flex justify-center mb-4">
            <img
              src={`${import.meta.env.BASE_URL}profile.png`}
              alt="Zizou"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/30 shadow-lg"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary items-center justify-center hidden"
              aria-hidden="true"
            >
              <span className="text-white text-4xl font-bold">Z</span>
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-dark dark:text-text-light">Zizou</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Personal Growth Journey 🚀</p>
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <Badge color="blue"><Globe size={10} className="inline mr-1" />@Public Profile</Badge>
            <Badge color="purple">JLPT N3 Student</Badge>
          </div>
        </Card>

        {/* Activity Recap */}
        <div>
          <h2 className="text-base font-heading font-semibold text-text-dark dark:text-text-light mb-3 px-1">📈 Activity Recap</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Habits', value: habits.length || 5, icon: Target, color: 'text-primary' },
              { label: 'Total Goals', value: goals.length || 5, icon: Trophy, color: 'text-secondary' },
              { label: 'Japanese Level', value: japanese?.currentLevel || 'N3', icon: BookOpen, color: 'text-accent' },
              { label: 'Books Read', value: `${booksRead || 24} this year`, icon: BookOpen, color: 'text-tertiary' },
              {
                label: 'Study Time',
                value: totalStudyMinutes > 0 ? `${studyHours}h ${studyMins}m` : '5h 45m',
                icon: Target,
                color: 'text-primary',
              },
              { label: 'Streak 🔥', value: `${Math.max(...(habits.map(h => h.streak || 0)), 14)} days`, icon: Trophy, color: 'text-secondary' },
            ].map(({ label, value, icon, color }) => {
              const Icon = icon;
              return (
                <Card key={label} className="text-center py-4">
                  <Icon size={20} className={`${color} mx-auto mb-1`} />
                  <p className={`text-xl font-bold font-mono ${color} leading-tight`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mood Trends */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} className="text-primary" />
            <h2 className="font-heading font-semibold text-text-dark dark:text-text-light">😊 Mood Trends</h2>
            {topMood && (
              <Badge color="green" className="ml-auto">
                Top: {moodEmoji[topMood[0]] || '😊'} {topMood[0]}
              </Badge>
            )}
          </div>
          {recentMoods.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No mood data recorded yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-20">
              {recentMoods.map((entry, i) => (
                <div key={entry.id ?? i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-lg leading-none" title={entry.mood}>{entry.emoji || moodEmoji[entry.mood] || '😊'}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary opacity-70"
                    style={{ height: `${(entry.intensity / 5) * 40 + 8}px` }}
                  />
                  <span className="text-xs text-gray-400 truncate w-full text-center">{entry.date?.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
          {moodLog.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-2">
              {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
                <span key={mood} className={`text-xs font-medium ${moodColor[mood] || 'text-gray-500'}`}>
                  {moodEmoji[mood] || '😊'} {mood} ×{count}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Health Stats */}
        <Card>
          <h2 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">💪 Health Stats</h2>
          <div className="space-y-4">
            {/* Water intake */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Droplets size={15} className="text-blue-500" />
                <span className="text-sm font-medium text-text-dark dark:text-text-light">Daily Water Intake</span>
                <span className="ml-auto text-sm font-mono text-gray-500 dark:text-gray-400">
                  {healthLog.length > 0 ? `${avgWater}/${waterGoal} cups avg` : '— / 8 cups'}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${Math.min(100, (avgWater / waterGoal) * 100)}%` }}
                />
              </div>
              {healthLog.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {healthLog.slice(0, 7).reverse().map((entry, i) => (
                    <div key={entry.id ?? i} className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{entry.water >= waterGoal ? '💧' : '🫗'}</span>
                      <span className="text-xs text-gray-400">{entry.date?.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exercise */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell size={15} className="text-green-500" />
                <span className="text-sm font-medium text-text-dark dark:text-text-light">Exercise</span>
                <span className="ml-auto text-sm font-mono text-gray-500 dark:text-gray-400">
                  {healthLog.length > 0
                    ? `${avgExercise} min/day avg · ${Math.floor(totalExerciseMin / 60)}h total`
                    : '— min/day'}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-700"
                  style={{ width: `${Math.min(100, (avgExercise / 60) * 100)}%` }}
                />
              </div>
              {healthLog.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {healthLog.slice(0, 7).reverse().map((entry, i) => (
                    <div key={entry.id ?? i} className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{entry.exercise >= 30 ? '🏃' : entry.exercise > 0 ? '🚶' : '😴'}</span>
                      <span className="text-xs text-gray-400">{entry.exercise}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Goals Progress */}
        <Card>
          <h2 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">🎯 Goals Progress</h2>
          <div className="space-y-4">
            {(goals.length > 0 ? goals : [
              { id: 1, title: 'Pass JLPT N3', progress: 65, target: 100 },
              { id: 2, title: 'Read 24 books this year', progress: 5, target: 24 },
              { id: 3, title: 'Build 3 portfolio projects', progress: 1, target: 3 },
            ]).map(goal => {
              const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
              return (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-text-dark dark:text-text-light">{goal.title}</span>
                    <span className="text-gray-400 font-mono">{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Spotify Music Player */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Music2 size={16} className="text-primary" />
            <h2 className="font-heading font-semibold text-text-dark dark:text-text-light">🎵 NOW PLAYING</h2>
          </div>

          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px', border: 0 }}
            src={`https://open.spotify.com/embed/album/${MJ_ALBUM_ID}?utm_source=generator`}
            width="100%"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Michael Jackson Album"
          />
        </Card>

        <p className="text-center text-xs text-gray-400 pb-4">📖 Read-only public profile • Powered by LifeOS</p>
      </main>
    </div>
  );
};

export default PublicProfile;

