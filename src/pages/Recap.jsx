import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, CheckSquare, Target, BookOpen, PenLine, Heart, Activity,
  Trophy, Music2, Map, Star, ChevronLeft, Palette, Swords,
  Flame, Clock,
} from 'lucide-react';
import { getData, saveData } from '../utils/localStorage';

const USER_NAME_KEY = 'userName';
const STYLE_KEY = 'recapStyle';

// ─── Confetti pieces (deterministic so no re-render jank) ─────────────────────

const CONFETTI_DATA = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D', '#C084FC', '#34D399', '#F472B6', '#60A5FA'][i % 8],
  left: `${(i * 4.17 + 1.5) % 100}%`,
  delay: `${(i * 0.12) % 2.4}s`,
  size: [6, 8, 10, 7, 9][i % 5],
  round: i % 3 !== 0,
}));

// ─── Style themes ─────────────────────────────────────────────────────────────

const THEMES = {
  minimalist: {
    label: 'Minimalist', emoji: '⬜',
    showConfetti: false,
    page: 'min-h-screen bg-white dark:bg-gray-950 py-10 px-4',
    heroBg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 mb-8',
    avatarBg: 'bg-gray-900 dark:bg-gray-700',
    title: 'font-heading font-bold text-3xl text-gray-900 dark:text-white tracking-tight mt-3',
    subtitle: 'text-xs text-gray-400 mt-1 font-mono uppercase tracking-widest',
    statCards: [
      { gradient: 'bg-gray-800 dark:bg-gray-700', text: 'text-white' },
      { gradient: 'bg-gray-700 dark:bg-gray-600', text: 'text-white' },
      { gradient: 'bg-gray-600 dark:bg-gray-500', text: 'text-white' },
      { gradient: 'bg-gray-500 dark:bg-gray-400', text: 'text-white' },
    ],
    sectionWrap: 'mb-6',
    sectionHeader: 'flex items-center gap-2 mb-3',
    sectionIcon: 'text-gray-500',
    sectionTitle: 'font-mono text-xs font-bold text-gray-500 uppercase tracking-widest',
    sectionCard: 'bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden',
    rowBorder: 'border-gray-100 dark:border-gray-800',
    rowLabel: 'text-sm text-gray-500 dark:text-gray-400',
    rowValue: 'text-sm font-medium text-gray-900 dark:text-gray-100',
    rowSub: 'text-xs text-gray-400 font-normal',
    empty: 'px-4 py-6 text-sm text-gray-400 text-center font-mono',
    footer: 'text-center text-xs text-gray-300 dark:text-gray-700 mt-6 font-mono',
    backBtn: 'flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors',
    stylePicker: 'flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1',
    styleBtn: (active) => `px-2 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`,
    progressBar: 'h-2 rounded-full bg-gray-200 dark:bg-gray-800',
    progressFill: 'h-full rounded-full bg-gray-700 dark:bg-gray-300 transition-all duration-700',
    questBadge: 'inline-flex items-center gap-1 text-xs font-mono text-gray-500',
  },
  wrapped: {
    label: 'Wrapped', emoji: '🎵',
    showConfetti: true,
    page: 'min-h-screen bg-gray-950 py-10 px-4',
    heroBg: 'relative overflow-hidden bg-gradient-to-br from-purple-900 via-fuchsia-900 to-pink-900 rounded-3xl p-8 mb-8 shadow-2xl',
    avatarBg: 'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    title: 'font-heading font-black text-4xl text-white mt-3',
    subtitle: 'text-sm text-fuchsia-300 mt-1 font-semibold',
    statCards: [
      { gradient: 'bg-gradient-to-br from-green-400 to-emerald-600', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-fuchsia-500 to-purple-700', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-orange-400 to-pink-500', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-cyan-400 to-blue-600', text: 'text-white' },
    ],
    sectionWrap: 'mb-6',
    sectionHeader: 'flex items-center gap-2 mb-3',
    sectionIcon: 'text-fuchsia-400',
    sectionTitle: 'font-heading text-sm font-black text-white uppercase tracking-widest',
    sectionCard: 'bg-gray-900 rounded-2xl border border-white/10 overflow-hidden',
    rowBorder: 'border-white/5',
    rowLabel: 'text-sm text-gray-400',
    rowValue: 'text-sm font-semibold text-white',
    rowSub: 'text-xs text-gray-500 font-normal',
    empty: 'px-4 py-6 text-sm text-gray-500 text-center',
    footer: 'text-center text-xs text-gray-600 mt-6',
    backBtn: 'flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors',
    stylePicker: 'flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10',
    styleBtn: (active) => `px-2 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-fuchsia-600 text-white shadow' : 'text-gray-400 hover:text-white'}`,
    progressBar: 'h-2 rounded-full bg-white/10',
    progressFill: 'h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-700',
    questBadge: 'inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-400',
  },
  neon: {
    label: 'Neon', emoji: '⚡',
    showConfetti: false,
    page: 'min-h-screen bg-slate-950 py-10 px-4',
    heroBg: 'relative overflow-hidden bg-gradient-to-br from-cyan-950 via-slate-950 to-fuchsia-950 rounded-3xl p-8 mb-8 border border-cyan-500/30 shadow-xl shadow-cyan-500/10',
    avatarBg: 'bg-gradient-to-br from-cyan-400 to-fuchsia-500',
    title: 'font-heading font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mt-3',
    subtitle: 'text-sm text-cyan-400 mt-1 font-mono',
    statCards: [
      { gradient: 'bg-gradient-to-br from-cyan-500/20 to-cyan-900/40 border border-cyan-500/40', text: 'text-cyan-300' },
      { gradient: 'bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-900/40 border border-fuchsia-500/40', text: 'text-fuchsia-300' },
      { gradient: 'bg-gradient-to-br from-yellow-500/20 to-yellow-900/40 border border-yellow-500/40', text: 'text-yellow-300' },
      { gradient: 'bg-gradient-to-br from-green-500/20 to-green-900/40 border border-green-500/40', text: 'text-green-300' },
    ],
    sectionWrap: 'mb-6',
    sectionHeader: 'flex items-center gap-2 mb-3',
    sectionIcon: 'text-cyan-400',
    sectionTitle: 'font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest',
    sectionCard: 'bg-slate-900/80 rounded-2xl border border-cyan-500/20 overflow-hidden',
    rowBorder: 'border-cyan-500/10',
    rowLabel: 'text-sm text-slate-400',
    rowValue: 'text-sm font-semibold text-cyan-100',
    rowSub: 'text-xs text-slate-500 font-normal',
    empty: 'px-4 py-6 text-sm text-slate-500 text-center font-mono',
    footer: 'text-center text-xs text-slate-700 mt-6 font-mono',
    backBtn: 'flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-300 transition-colors',
    stylePicker: 'flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-cyan-500/30',
    styleBtn: (active) => `px-2 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-cyan-400'}`,
    progressBar: 'h-2 rounded-full bg-cyan-900/40',
    progressFill: 'h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-700',
    questBadge: 'inline-flex items-center gap-1 text-xs font-mono text-cyan-400',
  },
  anime: {
    label: 'Anime', emoji: '🌸',
    showConfetti: true,
    page: 'min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 py-10 px-4',
    heroBg: 'relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-3xl p-8 mb-8 shadow-xl shadow-pink-200/40 dark:shadow-none',
    avatarBg: 'bg-white/25',
    title: 'font-heading font-extrabold text-3xl text-white mt-3',
    subtitle: 'text-sm text-pink-200 mt-1',
    statCards: [
      { gradient: 'bg-gradient-to-br from-pink-400 to-rose-500', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-violet-500 to-purple-700', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-indigo-400 to-blue-500', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-fuchsia-400 to-pink-600', text: 'text-white' },
    ],
    sectionWrap: 'mb-6',
    sectionHeader: 'flex items-center gap-2 mb-3',
    sectionIcon: 'text-pink-500 dark:text-pink-400',
    sectionTitle: 'font-heading text-base font-bold text-violet-600 dark:text-pink-300',
    sectionCard: 'bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-pink-100 dark:border-violet-800/40 overflow-hidden',
    rowBorder: 'border-pink-50 dark:border-white/5',
    rowLabel: 'text-sm text-violet-400 dark:text-purple-300',
    rowValue: 'text-sm font-medium text-violet-800 dark:text-pink-100',
    rowSub: 'text-xs text-pink-300 dark:text-purple-400 font-normal',
    empty: 'px-4 py-6 text-sm text-pink-300 dark:text-purple-400 text-center',
    footer: 'text-center text-xs text-pink-300 dark:text-purple-600 mt-6',
    backBtn: 'flex items-center gap-1 text-sm text-violet-400 hover:text-violet-700 dark:text-pink-300 dark:hover:text-pink-100 transition-colors',
    stylePicker: 'flex items-center gap-1 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-pink-100 dark:border-violet-800/40 p-1',
    styleBtn: (active) => `px-2 py-1 rounded-xl text-xs font-medium transition-all ${active ? 'bg-gradient-to-r from-pink-400 to-violet-500 text-white shadow' : 'text-violet-400 dark:text-pink-300 hover:text-violet-600'}`,
    progressBar: 'h-2 rounded-full bg-pink-100 dark:bg-purple-900/40',
    progressFill: 'h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-500 transition-all duration-700',
    questBadge: 'inline-flex items-center gap-1 text-xs text-pink-400 dark:text-purple-300',
  },
  gyaru: {
    label: 'Gyaru', emoji: '💖',
    showConfetti: true,
    page: 'min-h-screen bg-gradient-to-br from-rose-100 via-fuchsia-50 to-amber-50 dark:from-rose-950/50 dark:via-pink-950/40 dark:to-slate-900 py-10 px-4',
    heroBg: 'relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600 rounded-3xl p-8 mb-8 shadow-xl shadow-pink-200/50 dark:shadow-none',
    avatarBg: 'bg-white/30',
    title: 'font-heading font-extrabold text-3xl text-white mt-3',
    subtitle: 'text-sm text-rose-200 mt-1 font-semibold',
    statCards: [
      { gradient: 'bg-gradient-to-br from-rose-400 to-pink-600', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-fuchsia-400 to-purple-600', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-amber-400 to-orange-500', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-pink-400 to-rose-600', text: 'text-white' },
    ],
    sectionWrap: 'mb-6',
    sectionHeader: 'flex items-center gap-2 mb-3',
    sectionIcon: 'text-rose-500',
    sectionTitle: 'font-heading text-base font-extrabold text-rose-500 dark:text-rose-300',
    sectionCard: 'bg-white/80 dark:bg-white/5 rounded-3xl border-2 border-pink-200 dark:border-pink-800/50 shadow-sm shadow-pink-100/50 dark:shadow-none overflow-hidden',
    rowBorder: 'border-rose-50 dark:border-rose-900/20',
    rowLabel: 'text-sm text-rose-400 dark:text-rose-300',
    rowValue: 'text-sm font-medium text-rose-800 dark:text-rose-100',
    rowSub: 'text-xs text-pink-300 dark:text-rose-400 font-normal',
    empty: 'px-4 py-6 text-sm text-rose-300 dark:text-rose-400 text-center',
    footer: 'text-center text-xs text-rose-300 dark:text-rose-600 mt-6 font-semibold',
    backBtn: 'flex items-center gap-1 text-sm text-rose-400 hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-100 transition-colors',
    stylePicker: 'flex items-center gap-1 bg-white/70 dark:bg-white/5 rounded-3xl border-2 border-pink-200 dark:border-pink-800/50 p-1',
    styleBtn: (active) => `px-2 py-1 rounded-2xl text-xs font-bold transition-all ${active ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md shadow-pink-200 dark:shadow-none' : 'text-rose-400 dark:text-rose-300 hover:text-rose-600'}`,
    progressBar: 'h-2 rounded-full bg-rose-100 dark:bg-rose-900/30',
    progressFill: 'h-full rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500 transition-all duration-700',
    questBadge: 'inline-flex items-center gap-1 text-xs font-semibold text-rose-400 dark:text-rose-300',
  },
  sunset: {
    label: 'Sunset', emoji: '🌅',
    showConfetti: false,
    page: 'min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 dark:from-orange-950/80 dark:via-rose-950/60 dark:to-purple-950/80 py-10 px-4',
    heroBg: 'relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600 rounded-3xl p-8 mb-8 shadow-xl',
    avatarBg: 'bg-white/25',
    title: 'font-heading font-black text-4xl text-white mt-3 drop-shadow',
    subtitle: 'text-sm text-orange-200 mt-1 font-semibold',
    statCards: [
      { gradient: 'bg-gradient-to-br from-orange-400 to-amber-500', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-rose-500 to-pink-600', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-purple-500 to-violet-600', text: 'text-white' },
      { gradient: 'bg-gradient-to-br from-amber-400 to-orange-600', text: 'text-white' },
    ],
    sectionWrap: 'mb-6',
    sectionHeader: 'flex items-center gap-2 mb-3',
    sectionIcon: 'text-orange-500 dark:text-orange-400',
    sectionTitle: 'font-heading text-sm font-black text-orange-600 dark:text-orange-300 uppercase tracking-wide',
    sectionCard: 'bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-orange-100 dark:border-orange-900/40 overflow-hidden shadow-sm',
    rowBorder: 'border-orange-50 dark:border-orange-900/20',
    rowLabel: 'text-sm text-orange-400 dark:text-orange-300',
    rowValue: 'text-sm font-semibold text-orange-800 dark:text-orange-100',
    rowSub: 'text-xs text-orange-300 dark:text-orange-500 font-normal',
    empty: 'px-4 py-6 text-sm text-orange-300 dark:text-orange-600 text-center',
    footer: 'text-center text-xs text-orange-300 dark:text-orange-700 mt-6',
    backBtn: 'flex items-center gap-1 text-sm text-orange-400 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-100 transition-colors',
    stylePicker: 'flex items-center gap-1 bg-white/70 dark:bg-white/5 rounded-2xl border border-orange-100 dark:border-orange-900/30 p-1',
    styleBtn: (active) => `px-2 py-1 rounded-xl text-xs font-bold transition-all ${active ? 'bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow' : 'text-orange-400 dark:text-orange-300 hover:text-orange-600'}`,
    progressBar: 'h-2 rounded-full bg-orange-100 dark:bg-orange-900/30',
    progressFill: 'h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-700',
    questBadge: 'inline-flex items-center gap-1 text-xs font-semibold text-orange-400 dark:text-orange-300',
  },
};

// ─── Confetti component ───────────────────────────────────────────────────────

const Confetti = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {CONFETTI_DATA.map(p => (
      <div
        key={p.id}
        className="absolute recap-confetti"
        style={{
          left: p.left,
          top: '-12px',
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          borderRadius: p.round ? '50%' : '2px',
          animationDelay: p.delay,
        }}
      />
    ))}
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, value, label, gradient, textColor }) => (
  <div className={`${gradient} rounded-2xl p-4 shadow-lg relative overflow-hidden hover:-translate-y-0.5 transition-transform duration-200`}>
    <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-current opacity-10" aria-hidden="true" />
    <Icon size={18} className={`${textColor} opacity-80 mb-2 relative z-10`} />
    <div className={`text-2xl font-black ${textColor} leading-none mb-1 relative z-10`}>{value}</div>
    <div className={`text-xs ${textColor} opacity-70 font-medium relative z-10`}>{label}</div>
  </div>
);

// ─── Shared sub-components ────────────────────────────────────────────────────

const Section = ({ t, icon: Icon, title, children, delay = 0 }) => (
  <div
    className={`${t.sectionWrap} animate-slide-up`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className={t.sectionHeader}>
      <Icon size={16} className={t.sectionIcon} />
      <h2 className={t.sectionTitle}>{title}</h2>
    </div>
    <div className={t.sectionCard}>{children}</div>
  </div>
);

const Row = ({ t, label, value, sub }) => (
  <div className={`flex items-start justify-between px-4 py-3 border-b ${t.rowBorder} last:border-0`}>
    <span className={`${t.rowLabel} flex-shrink-0 mr-4`}>{label}</span>
    <span className={`${t.rowValue} text-right`}>
      {value}
      {sub && <span className={`block ${t.rowSub}`}>{sub}</span>}
    </span>
  </div>
);

const Empty = ({ t, msg = 'No data yet.' }) => (
  <p className={t.empty}>{msg}</p>
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
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => getData(USER_NAME_KEY, null));
  const [styleKey, setStyleKey] = useState(() => getData(STYLE_KEY, 'minimalist'));

  const pickStyle = (key) => {
    setStyleKey(key);
    saveData(STYLE_KEY, key);
  };

  if (!userName) {
    return <NamePrompt onSave={setUserName} />;
  }

  const t = THEMES[styleKey] || THEMES.minimalist;

  // ── Load all data ──────────────────────────────────────────────────────────
  const tasks      = getData('tasks', []);
  const habits     = getData('habits', []);
  const goals      = getData('goals', []);
  const studyLog   = getData('studyLog', []);
  const moodLog    = getData('moodLog', []);
  const healthLog  = getData('healthLog', []);
  const jpSessions = getData('japanese_study_sessions', []);
  const japanPlans = getData('japanPlans', []);
  const albums     = getData('music_albums', []);
  const quests     = getData('dailyQuests', []);

  const today = new Date().toISOString().split('T')[0];

  // ── Derived stats ──────────────────────────────────────────────────────────
  const completedTasks = tasks.filter(tk => tk.completed || tk.status === 'completed');
  const pendingTasks   = tasks.filter(tk => !tk.completed && tk.status !== 'completed');

  const totalStudyMins = studyLog.reduce((s, l) => s + (l.duration || 0), 0);
  const studyHours = (totalStudyMins / 60).toFixed(1);

  const latestMood = [...moodLog].sort((a, b) => b.date?.localeCompare(a.date ?? ''))[0];

  const avgWater = healthLog.length
    ? (healthLog.reduce((s, h) => s + (h.water || 0), 0) / healthLog.length).toFixed(1)
    : null;
  const avgExercise = healthLog.length
    ? (healthLog.reduce((s, h) => s + (h.exercise || 0), 0) / healthLog.length).toFixed(1)
    : null;

  const jpTotalMins   = jpSessions.reduce((s, sess) => s + (sess.minutes || 0), 0);
  const jpTotalKanji  = jpSessions.reduce((s, sess) => s + (sess.kanjiCount || 0), 0);

  const plansCompleted  = japanPlans.filter(p => p.status === 'completed').length;
  const plansInProgress = japanPlans.filter(p => p.status === 'in-progress').length;

  const topAlbums = [...albums].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);

  const activeQuests    = quests.filter(q => q.active);
  const questsDoneToday = activeQuests.filter(q => q.completedDates?.includes(today)).length;

  const maxHabitStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.streak || 0))
    : 0;

  // ── Hero stat cards ────────────────────────────────────────────────────────
  const heroStats = [
    { icon: CheckSquare, value: completedTasks.length,                          label: 'Tasks Done'    },
    { icon: Flame,       value: maxHabitStreak,                                 label: 'Best Streak'   },
    { icon: Clock,       value: `${studyHours}h`,                               label: 'Study Time'    },
    { icon: Swords,      value: `${questsDoneToday}/${activeQuests.length}`,    label: 'Quests Today'  },
  ];

  return (
    <div className={t.page}>
      <div className="max-w-2xl mx-auto">

        {/* ── Top bar: back + theme switcher ─────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className={t.backBtn}>
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
          <div className={t.stylePicker}>
            <Palette size={11} className="ml-1 opacity-40" />
            {Object.entries(THEMES).map(([key, th]) => (
              <button
                key={key}
                onClick={() => pickStyle(key)}
                className={t.styleBtn(styleKey === key)}
                title={th.label}
                aria-label={th.label}
              >
                {th.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* ── Hero section ───────────────────────────────────────────── */}
        <div className={t.heroBg}>
          {t.showConfetti && <Confetti />}

          {/* Avatar + title */}
          <div className="relative z-10 text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${t.avatarBg} shadow-lg animate-float`}>
              <User size={32} className="text-white" />
            </div>
            <h1 className={t.title}>{userName}'s Recap 🎉</h1>
            <p className={t.subtitle}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* 2×2 stat grid */}
          <div className="relative z-10 grid grid-cols-2 gap-3 mt-6">
            {heroStats.map((stat, i) => (
              <StatCard
                key={i}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                gradient={t.statCards[i].gradient}
                textColor={t.statCards[i].text}
              />
            ))}
          </div>
        </div>

        {/* ── Daily Quests ─────────────────────────────────────────── */}
        <Section t={t} icon={Swords} title="Daily Quests" delay={0}>
          {quests.length === 0 ? <Empty t={t} msg="No daily quests set up yet." /> : (
            <>
              <Row t={t} label="Active quests" value={activeQuests.length} />
              {activeQuests.length > 0 && (
                <Row t={t} label="Done today" value={`${questsDoneToday} / ${activeQuests.length}`} />
              )}
              {activeQuests.map(q => (
                <Row
                  key={q.id}
                  t={t}
                  label={q.completedDates?.includes(today) ? '✅' : '⬜'}
                  value={q.title}
                  sub={`${q.completedDates?.length || 0} day${q.completedDates?.length !== 1 ? 's' : ''} completed`}
                />
              ))}
              {quests.filter(q => !q.active).length > 0 && (
                <Row t={t} label="Inactive" value={quests.filter(q => !q.active).length} />
              )}
            </>
          )}
        </Section>

        {/* ── Tasks ────────────────────────────────────────────────── */}
        <Section t={t} icon={CheckSquare} title="Tasks" delay={50}>
          {tasks.length === 0 ? <Empty t={t} msg="No tasks recorded yet." /> : (
            <>
              <Row t={t} label="Total tasks"  value={tasks.length} />
              <Row t={t} label="Completed"    value={completedTasks.length} />
              <Row t={t} label="Pending"      value={pendingTasks.length} />
              {pendingTasks.slice(0, 5).map(task => (
                <Row key={task.id}
                  t={t}
                  label={task.priority ? `[${task.priority}]` : '–'}
                  value={task.title}
                  sub={task.dueDate ? `Due ${task.dueDate}` : undefined}
                />
              ))}
              {pendingTasks.length > 5 && <Row t={t} label="" value={`+${pendingTasks.length - 5} more pending…`} />}
            </>
          )}
        </Section>

        {/* ── Habits ───────────────────────────────────────────────── */}
        <Section t={t} icon={Target} title="Habits" delay={100}>
          {habits.length === 0 ? <Empty t={t} msg="No habits tracked yet." /> : (
            <>
              <Row t={t} label="Total habits" value={habits.length} />
              {habits.map(h => {
                const doneToday = h.completedDates?.includes(today);
                return (
                  <Row key={h.id}
                    t={t}
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
        <Section t={t} icon={Trophy} title="Goals" delay={150}>
          {goals.length === 0 ? <Empty t={t} msg="No goals set yet." /> : (
            <>
              <Row t={t} label="Total goals" value={goals.length} />
              {goals.map(g => {
                const pct = g.target > 0 ? Math.min(100, Math.round((g.progress / g.target) * 100)) : 0;
                return (
                  <div key={g.id} className={`px-4 py-3 border-b ${t.rowBorder} last:border-0`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={t.rowValue}>{g.title}</span>
                      <span className={t.rowLabel}>{pct}%</span>
                    </div>
                    <div className={t.progressBar}>
                      <div className={t.progressFill} style={{ width: `${pct}%` }} />
                    </div>
                    {g.deadline && <p className={`text-xs mt-1 ${t.rowLabel}`}>Deadline: {g.deadline}</p>}
                  </div>
                );
              })}
            </>
          )}
        </Section>

        {/* ── Study Log ────────────────────────────────────────────── */}
        <Section t={t} icon={PenLine} title="Study Log" delay={200}>
          {studyLog.length === 0 ? <Empty t={t} msg="No study sessions logged yet." /> : (
            <>
              <Row t={t} label="Total sessions"   value={studyLog.length} />
              <Row t={t} label="Total study time" value={`${studyHours} hrs (${totalStudyMins} min)`} />
              {[...studyLog].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map(l => (
                <Row key={l.id}
                  t={t}
                  label={l.date}
                  value={`${l.subject} — ${l.duration} min`}
                  sub={l.notes || undefined}
                />
              ))}
              {studyLog.length > 5 && <Row t={t} label="" value={`+${studyLog.length - 5} more sessions…`} />}
            </>
          )}
        </Section>

        {/* ── Mood Log ─────────────────────────────────────────────── */}
        <Section t={t} icon={Heart} title="Mood Log" delay={250}>
          {moodLog.length === 0 ? <Empty t={t} msg="No mood entries yet." /> : (
            <>
              <Row t={t} label="Total entries" value={moodLog.length} />
              {latestMood && (
                <Row t={t} label="Latest mood" value={`${latestMood.mood} (intensity ${latestMood.intensity}/5)`} sub={latestMood.date} />
              )}
              {[...moodLog].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map((m, i) => (
                <Row key={m.id ?? `${m.date}-${m.mood}-${i}`}
                  t={t}
                  label={m.date}
                  value={`${m.mood} · ${m.intensity}/5`}
                  sub={m.notes || undefined}
                />
              ))}
              {moodLog.length > 5 && <Row t={t} label="" value={`+${moodLog.length - 5} more entries…`} />}
            </>
          )}
        </Section>

        {/* ── Health Log ───────────────────────────────────────────── */}
        <Section t={t} icon={Activity} title="Health Log" delay={300}>
          {healthLog.length === 0 ? <Empty t={t} msg="No health data logged yet." /> : (
            <>
              <Row t={t} label="Total check-ins" value={healthLog.length} />
              {avgWater    && <Row t={t} label="Avg water"    value={`${avgWater} glasses/day`} />}
              {avgExercise && <Row t={t} label="Avg exercise" value={`${avgExercise} min/day`} />}
              {[...healthLog].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map((h, i) => (
                <Row key={h.id ?? `${h.date}-${i}`}
                  t={t}
                  label={h.date}
                  value={`💧 ${h.water} glasses · 🏃 ${h.exercise}min${h.weight ? ` · ⚖️ ${h.weight}kg` : ''}`}
                  sub={h.notes || undefined}
                />
              ))}
              {healthLog.length > 5 && <Row t={t} label="" value={`+${healthLog.length - 5} more entries…`} />}
            </>
          )}
        </Section>

        {/* ── Japanese Learning ─────────────────────────────────────── */}
        <Section t={t} icon={BookOpen} title="Japanese Learning" delay={350}>
          {jpSessions.length === 0 ? <Empty t={t} msg="No Japanese study sessions yet." /> : (
            <>
              <Row t={t} label="Study sessions"  value={jpSessions.length} />
              <Row t={t} label="Total time"       value={`${(jpTotalMins / 60).toFixed(1)} hrs (${jpTotalMins} min)`} />
              <Row t={t} label="Kanji practiced"  value={jpTotalKanji} />
              {[...jpSessions].sort((a, b) => b.date?.localeCompare(a.date ?? '')).slice(0, 5).map((s, i) => (
                <Row key={s.id ?? `${s.date}-${i}`}
                  t={t}
                  label={s.date}
                  value={`${s.nLevel || '–'} · ${s.minutes} min · ${s.kanjiCount} kanji`}
                  sub={s.notes || undefined}
                />
              ))}
              {jpSessions.length > 5 && <Row t={t} label="" value={`+${jpSessions.length - 5} more sessions…`} />}
            </>
          )}
        </Section>

        {/* ── MYJapan Plans ────────────────────────────────────────── */}
        <Section t={t} icon={Map} title="MYJapan Plans" delay={400}>
          {japanPlans.length === 0 ? <Empty t={t} msg="No Japan plans created yet." /> : (
            <>
              <Row t={t} label="Total plans"  value={japanPlans.length} />
              <Row t={t} label="Completed"    value={plansCompleted} />
              <Row t={t} label="In progress"  value={plansInProgress} />
              <Row t={t} label="Not started"  value={japanPlans.length - plansCompleted - plansInProgress} />
              {japanPlans.slice(0, 6).map(p => (
                <Row key={p.id}
                  t={t}
                  label={`[${p.status || 'not-started'}]`}
                  value={p.title}
                  sub={p.category ? `${p.category}${p.subcategory ? ` › ${p.subcategory}` : ''}` : undefined}
                />
              ))}
              {japanPlans.length > 6 && <Row t={t} label="" value={`+${japanPlans.length - 6} more plans…`} />}
            </>
          )}
        </Section>

        {/* ── Music / Favourite Albums ─────────────────────────────── */}
        <Section t={t} icon={Music2} title="Music — Favourite Albums" delay={450}>
          {albums.length === 0 ? <Empty t={t} msg="No albums saved yet." /> : (
            <>
              <Row t={t} label="Albums saved" value={albums.length} />
              {topAlbums.map(a => (
                <div key={a.id} className={`flex items-center gap-3 px-4 py-3 border-b ${t.rowBorder} last:border-0`}>
                  {a.coverUrl && (
                    <img src={a.coverUrl} alt={a.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`${t.rowValue} truncate`}>{a.title}</p>
                    <p className={`text-xs truncate ${t.rowLabel}`}>{a.artist} · {a.year} · {a.genre}</p>
                  </div>
                  <Stars n={a.rating || 0} />
                </div>
              ))}
              {albums.length > 5 && <Row t={t} label="" value={`+${albums.length - 5} more albums…`} />}
            </>
          )}
        </Section>

        <p className={t.footer}>
          LifeOS Recap · generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default Recap;
