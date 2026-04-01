import { useState } from 'react';
import { User, CheckSquare, Target, BookOpen, PenLine, Heart, Activity, Trophy, Music2, Map, Star } from 'lucide-react';
import { getData, saveData } from '../utils/localStorage';

const USER_NAME_KEY = 'userName';

// ─── Small helpers ────────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children, accent = 'text-primary' }) => (
  <div className="mb-8">
    <div className={`flex items-center gap-2 mb-3 ${accent}`}>
      <Icon size={18} />
      <h2 className="font-heading font-semibold text-lg text-text-dark dark:text-text-light">{title}</h2>
    </div>
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
      {children}
    </div>
  </div>
);

const Row = ({ label, value, sub }) => (
  <div className="flex items-start justify-between px-4 py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 mr-4">{label}</span>
    <span className="text-sm font-medium text-text-dark dark:text-text-light text-right">
      {value}
      {sub && <span className="block text-xs text-gray-400 font-normal">{sub}</span>}
    </span>
  </div>
);

const Empty = ({ msg = 'No data yet.' }) => (
  <p className="px-4 py-6 text-sm text-gray-400 text-center">{msg}</p>
);

const Stars = ({ n }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={12} className={i <= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
    ))}
  </span>
);

// ─── Login gate ───────────────────────────────────────────────────────────────

const NamePrompt = ({ onSave }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name.'); return; }
    saveData(USER_NAME_KEY, trimmed);
    onSave(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-white/10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
        </div>
        <h1 className="font-heading font-bold text-2xl text-text-dark dark:text-text-light text-center mb-1">Welcome to LifeOS</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Enter your name to personalise your Recap.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your name…"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-text-dark dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
          >
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Main Recap page ──────────────────────────────────────────────────────────

const Recap = () => {
  const [userName, setUserName] = useState(() => getData(USER_NAME_KEY, null));

  if (!userName) {
    return <NamePrompt onSave={setUserName} />;
  }

  // ── Load all data ──────────────────────────────────────────────────────────
  const tasks     = getData('tasks', []);
  const habits    = getData('habits', []);
  const goals     = getData('goals', []);
  const studyLog  = getData('studyLog', []);
  const moodLog   = getData('moodLog', []);
  const healthLog = getData('healthLog', []);
  const jpSessions = getData('japanese_study_sessions', []);
  const japanPlans = getData('japanPlans', []);
  const albums    = getData('music_albums', []);

  const today = new Date().toISOString().split('T')[0];

  // ── Derived stats ──────────────────────────────────────────────────────────
  const completedTasks = tasks.filter(t => t.completed || t.status === 'completed');
  const pendingTasks   = tasks.filter(t => !t.completed && t.status !== 'completed');

  const totalStudyMins = studyLog.reduce((s, l) => s + (l.duration || 0), 0);
  const studyHours = (totalStudyMins / 60).toFixed(1);

  const latestMood = [...moodLog].sort((a, b) => b.date?.localeCompare(a.date ?? ''))[0];

  const avgWater = healthLog.length
    ? (healthLog.reduce((s, h) => s + (h.water || 0), 0) / healthLog.length).toFixed(1)
    : null;
  const avgExercise = healthLog.length
    ? (healthLog.reduce((s, h) => s + (h.exercise || 0), 0) / healthLog.length).toFixed(1)
    : null;

  const jpTotalMins = jpSessions.reduce((s, sess) => s + (sess.minutes || 0), 0);
  const jpTotalKanji = jpSessions.reduce((s, sess) => s + (sess.kanjiCount || 0), 0);

  const plansCompleted = japanPlans.filter(p => p.status === 'completed').length;
  const plansInProgress = japanPlans.filter(p => p.status === 'in-progress').length;

  const topAlbums = [...albums].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 mb-4">
          <User size={28} className="text-white" />
        </div>
        <h1 className="font-heading font-bold text-3xl text-text-dark dark:text-text-light">
          {userName}'s Recap
        </h1>
        <p className="text-sm text-gray-400 mt-1">A full overview of your LifeOS journey</p>
      </div>

      {/* ── Tasks ────────────────────────────────────────────────── */}
      <Section icon={CheckSquare} title="Tasks">
        {tasks.length === 0 ? <Empty msg="No tasks recorded yet." /> : (
          <>
            <Row label="Total tasks" value={tasks.length} />
            <Row label="Completed" value={completedTasks.length} />
            <Row label="Pending" value={pendingTasks.length} />
            {pendingTasks.slice(0, 5).map(t => (
              <Row key={t.id}
                label={t.priority ? `[${t.priority}]` : '–'}
                value={t.title}
                sub={t.dueDate ? `Due ${t.dueDate}` : undefined}
              />
            ))}
            {pendingTasks.length > 5 && <Row label="" value={`+${pendingTasks.length - 5} more pending…`} />}
          </>
        )}
      </Section>

      {/* ── Habits ───────────────────────────────────────────────── */}
      <Section icon={Target} title="Habits">
        {habits.length === 0 ? <Empty msg="No habits tracked yet." /> : (
          <>
            <Row label="Total habits" value={habits.length} />
            {habits.map(h => {
              const doneToday = h.completedDates?.includes(today);
              return (
                <Row key={h.id}
                  label={h.name}
                  value={`Streak: ${h.streak || 0} day${h.streak !== 1 ? 's' : ''}`}
                  sub={doneToday ? '✅ Done today' : '⬜ Not yet today'}
                />
              );
            })}
          </>
        )}
      </Section>

      {/* ── Goals ────────────────────────────────────────────────── */}
      <Section icon={Trophy} title="Goals">
        {goals.length === 0 ? <Empty msg="No goals set yet." /> : (
          <>
            <Row label="Total goals" value={goals.length} />
            {goals.map(g => {
              const pct = g.target > 0 ? Math.min(100, Math.round((g.progress / g.target) * 100)) : 0;
              return (
                <div key={g.id} className="px-4 py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-text-dark dark:text-text-light">{g.title}</span>
                    <span className="text-gray-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  {g.deadline && <p className="text-xs text-gray-400 mt-1">Deadline: {g.deadline}</p>}
                </div>
              );
            })}
          </>
        )}
      </Section>

      {/* ── Study Log ────────────────────────────────────────────── */}
      <Section icon={PenLine} title="Study Log">
        {studyLog.length === 0 ? <Empty msg="No study sessions logged yet." /> : (
          <>
            <Row label="Total sessions" value={studyLog.length} />
            <Row label="Total study time" value={`${studyHours} hrs (${totalStudyMins} min)`} />
            {[...studyLog].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map(l => (
              <Row key={l.id}
                label={l.date}
                value={`${l.subject} — ${l.duration} min`}
                sub={l.notes || undefined}
              />
            ))}
            {studyLog.length > 5 && <Row label="" value={`+${studyLog.length - 5} more sessions…`} />}
          </>
        )}
      </Section>

      {/* ── Mood Log ─────────────────────────────────────────────── */}
      <Section icon={Heart} title="Mood Log">
        {moodLog.length === 0 ? <Empty msg="No mood entries yet." /> : (
          <>
            <Row label="Total entries" value={moodLog.length} />
            {latestMood && (
              <Row label="Latest mood" value={`${latestMood.mood} (intensity ${latestMood.intensity}/5)`} sub={latestMood.date} />
            )}
            {[...moodLog].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map((m, i) => (
              <Row key={m.id ?? `${m.date}-${m.mood}-${i}`}
                label={m.date}
                value={`${m.mood} · ${m.intensity}/5`}
                sub={m.notes || undefined}
              />
            ))}
            {moodLog.length > 5 && <Row label="" value={`+${moodLog.length - 5} more entries…`} />}
          </>
        )}
      </Section>

      {/* ── Health Log ───────────────────────────────────────────── */}
      <Section icon={Activity} title="Health Log">
        {healthLog.length === 0 ? <Empty msg="No health data logged yet." /> : (
          <>
            <Row label="Total check-ins" value={healthLog.length} />
            {avgWater    && <Row label="Avg water" value={`${avgWater} glasses/day`} />}
            {avgExercise && <Row label="Avg exercise" value={`${avgExercise} min/day`} />}
            {[...healthLog].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map((h, i) => (
              <Row key={h.id ?? `${h.date}-${i}`}
                label={h.date}
                value={`💧 ${h.water} glasses · 🏃 ${h.exercise}min${h.weight ? ` · ⚖️ ${h.weight}kg` : ''}`}
                sub={h.notes || undefined}
              />
            ))}
            {healthLog.length > 5 && <Row label="" value={`+${healthLog.length - 5} more entries…`} />}
          </>
        )}
      </Section>

      {/* ── Japanese Learning ─────────────────────────────────────── */}
      <Section icon={BookOpen} title="Japanese Learning">
        {jpSessions.length === 0 ? <Empty msg="No Japanese study sessions yet." /> : (
          <>
            <Row label="Study sessions" value={jpSessions.length} />
            <Row label="Total time" value={`${(jpTotalMins / 60).toFixed(1)} hrs (${jpTotalMins} min)`} />
            <Row label="Kanji practiced" value={jpTotalKanji} />
            {[...jpSessions].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map((s, i) => (
              <Row key={s.id ?? `${s.date}-${i}`}
                label={s.date}
                value={`${s.nLevel || '–'} · ${s.minutes} min · ${s.kanjiCount} kanji`}
                sub={s.notes || undefined}
              />
            ))}
            {jpSessions.length > 5 && <Row label="" value={`+${jpSessions.length - 5} more sessions…`} />}
          </>
        )}
      </Section>

      {/* ── MYJapan Plans ────────────────────────────────────────── */}
      <Section icon={Map} title="MYJapan Plans">
        {japanPlans.length === 0 ? <Empty msg="No Japan plans created yet." /> : (
          <>
            <Row label="Total plans" value={japanPlans.length} />
            <Row label="Completed" value={plansCompleted} />
            <Row label="In progress" value={plansInProgress} />
            <Row label="Not started" value={japanPlans.length - plansCompleted - plansInProgress} />
            {japanPlans.slice(0, 6).map(p => (
              <Row key={p.id}
                label={`[${p.status || 'not-started'}]`}
                value={p.title}
                sub={p.category ? `${p.category}${p.subcategory ? ` › ${p.subcategory}` : ''}` : undefined}
              />
            ))}
            {japanPlans.length > 6 && <Row label="" value={`+${japanPlans.length - 6} more plans…`} />}
          </>
        )}
      </Section>

      {/* ── Music / Favourite Albums ─────────────────────────────── */}
      <Section icon={Music2} title="Music — Favourite Albums">
        {albums.length === 0 ? <Empty msg="No albums saved yet." /> : (
          <>
            <Row label="Albums saved" value={albums.length} />
            {topAlbums.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
                {a.coverUrl && (
                  <img src={a.coverUrl} alt={a.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-dark dark:text-text-light truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 truncate">{a.artist} · {a.year} · {a.genre}</p>
                </div>
                <Stars n={a.rating || 0} />
              </div>
            ))}
            {albums.length > 5 && <Row label="" value={`+${albums.length - 5} more albums…`} />}
          </>
        )}
      </Section>

      <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-4">
        LifeOS Recap · generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
};

export default Recap;
