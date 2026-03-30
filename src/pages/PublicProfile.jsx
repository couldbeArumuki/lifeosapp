import { useState, useEffect } from 'react';
import { getData } from '../utils/localStorage';
import { Globe, BookOpen, Target, Trophy, Music2, Droplets, Dumbbell, Heart } from 'lucide-react';

const MJ_ALBUM_ID = '3OBhnTLrvkoEEETjFA3Qfk';

const moodEmoji = { happy: '😊', focused: '🎯', motivated: '🚀', calm: '🌿', tired: '😴', anxious: '😰' };

const statusIcon = { completed: '✅', 'in-progress': '⏳', 'not-started': '⭕' };
const statusLabel = { completed: 'Completed', 'in-progress': 'In Progress', 'not-started': 'Not Started' };
const priorityEmoji = { high: '🔥', medium: '⭐', low: '🌸' };

const GYARU_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@400;700;900&display=swap');

  .gyaru-page {
    background: linear-gradient(135deg, #FFB6D9 0%, #FFE4F0 25%, #FFF0A0 50%, #FFD4E8 75%, #E8B4FF 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }
  .gyaru-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(255,105,180,0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255,215,0,0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(230,170,255,0.1) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .gyaru-header {
    background: linear-gradient(90deg, #FF69B4, #FF1493, #FFD700, #FF69B4);
    background-size: 300% 100%;
    animation: gradientShift 4s ease infinite;
    border-bottom: 3px solid #FF1493;
    box-shadow: 0 4px 20px rgba(255,20,147,0.4);
  }
  .gyaru-card {
    background: rgba(255,255,255,0.88);
    border: 3px solid #FF69B4;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(255,105,180,0.25), 0 2px 8px rgba(255,215,0,0.2);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }
  .gyaru-card::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .gyaru-title {
    font-family: 'Luckiest Guy', cursive;
    color: #FF1493;
    text-shadow: 3px 3px 0px #FFD700, 5px 5px 0px rgba(255,20,147,0.2);
    letter-spacing: 2px;
  }
  .gyaru-subtitle {
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    color: #FF69B4;
  }
  .gyaru-text {
    font-family: 'Nunito', sans-serif;
    color: #8B0057;
  }
  .gyaru-progress-track {
    height: 12px;
    border-radius: 9999px;
    background: linear-gradient(90deg, rgba(255,105,180,0.2), rgba(255,215,0,0.2));
    border: 2px solid rgba(255,105,180,0.3);
    overflow: hidden;
  }
  .gyaru-progress-bar {
    height: 100%;
    border-radius: 9999px;
    background: linear-gradient(90deg, #FF69B4, #FFD700, #FF1493);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    transition: width 0.8s ease;
  }
  .gyaru-badge {
    background: linear-gradient(90deg, #FF69B4, #FF1493);
    color: white;
    border-radius: 9999px;
    padding: 2px 10px;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(255,20,147,0.3);
  }
  .gyaru-badge-gold {
    background: linear-gradient(90deg, #FFD700, #FFA500);
    color: #8B4513;
    border-radius: 9999px;
    padding: 2px 10px;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(255,215,0,0.4);
  }
  .gyaru-stat-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,230,250,0.9));
    border: 2px solid #FFB6D9;
    border-radius: 16px;
    padding: 12px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(255,105,180,0.15);
    transition: transform 0.2s;
  }
  .gyaru-stat-card:hover {
    transform: translateY(-2px);
  }
  .gyaru-japan-item {
    background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,240,255,0.95));
    border: 2px solid #FFB6D9;
    border-radius: 14px;
    padding: 12px 14px;
    transition: all 0.2s;
  }
  .gyaru-japan-item:hover {
    border-color: #FF69B4;
    box-shadow: 0 4px 15px rgba(255,105,180,0.2);
  }
  .gyaru-section-title {
    font-family: 'Luckiest Guy', cursive;
    color: #FF1493;
    font-size: 1.3rem;
    text-shadow: 2px 2px 0px #FFD700;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .sparkle {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    font-size: 20px;
    animation: floatSpark 6s ease-in-out infinite;
    opacity: 0.6;
  }
  .waifu-deco {
    position: fixed;
    right: -60px;
    bottom: 60px;
    width: 220px;
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
    filter: drop-shadow(0 0 20px #FF69B4);
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes floatSpark {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
    33% { transform: translateY(-15px) rotate(120deg); opacity: 0.8; }
    66% { transform: translateY(-8px) rotate(240deg); opacity: 0.6; }
  }
  @keyframes bounce-gentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
`;

const SPARKLES = [
  { top: '8%',  left: '5%',  delay: '0s',   icon: '✦' },
  { top: '15%', left: '92%', delay: '1s',   icon: '★' },
  { top: '35%', left: '3%',  delay: '2s',   icon: '✿' },
  { top: '55%', left: '95%', delay: '0.5s', icon: '♥' },
  { top: '70%', left: '7%',  delay: '1.5s', icon: '✦' },
  { top: '85%', left: '90%', delay: '2.5s', icon: '★' },
  { top: '25%', left: '88%', delay: '3s',   icon: '✿' },
  { top: '45%', left: '2%',  delay: '3.5s', icon: '♥' },
];

const PublicProfile = () => {
  const [goals] = useState(() => getData('goals', []));
  const [habits] = useState(() => getData('habits', []));
  const [japanese] = useState(() => getData('japanese', null));
  const [studyLog] = useState(() => getData('studyLog', []));
  const [moodLog] = useState(() => getData('moodLog', []));
  const [healthLog] = useState(() => getData('healthLog', []));
  const [japanPlans] = useState(() => getData('japanPlans', []));
  const [waifuImg, setWaifuImg] = useState(null);

  useEffect(() => {
    fetch('https://api.waifu.pics/sfw/waifu')
      .then(r => r.json())
      .then(data => { if (data?.url) setWaifuImg(data.url); })
      .catch(err => { console.warn('Waifu image fetch failed:', err); });
  }, []);

  const totalStudyMinutes = studyLog.reduce((sum, s) => sum + (s.duration || 0), 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = totalStudyMinutes % 60;

  const booksRead = (() => {
    const booksGoal = goals.find(g => g.title?.toLowerCase().includes('book'));
    return booksGoal ? booksGoal.progress : 0;
  })();

  const recentMoods = moodLog.slice(0, 7).reverse();
  const moodCounts = moodLog.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  const recentHealth = healthLog.slice(0, 7);
  const avgWater = recentHealth.length > 0
    ? Math.round(recentHealth.reduce((s, e) => s + (e.water || 0), 0) / recentHealth.length)
    : 0;
  const avgExercise = recentHealth.length > 0
    ? Math.round(recentHealth.reduce((s, e) => s + (e.exercise || 0), 0) / recentHealth.length)
    : 0;
  const totalExerciseMin = healthLog.reduce((s, e) => s + (e.exercise || 0), 0);
  const waterGoal = 8;

  const japanTotal = japanPlans.length;
  const japanCompleted = japanPlans.filter(p => p.status === 'completed').length;
  const japanInProgress = japanPlans.filter(p => p.status === 'in-progress').length;
  const japanNotStarted = japanPlans.filter(p => p.status === 'not-started').length;
  const japanPct = japanTotal > 0 ? Math.round((japanCompleted / japanTotal) * 100) : 0;

  const categoryGroups = japanPlans.reduce((acc, plan) => {
    const cat = plan.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(plan);
    return acc;
  }, {});

  return (
    <div className="gyaru-page" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{GYARU_STYLES}</style>

      {/* Floating sparkles */}
      {SPARKLES.map((s, i) => {
        const sparkleColor = i % 2 === 0 ? '#FF69B4' : '#FFD700';
        return (
          <span
            key={i}
            className="sparkle"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, fontSize: '18px', color: sparkleColor }}
          >
            {s.icon}
          </span>
        );
      })}

      {/* Waifu decorative image */}
      {waifuImg && (
        <img src={waifuImg} alt="" className="waifu-deco" aria-hidden="true" />
      )}

      {/* Gyaru Header */}
      <header className="gyaru-header sticky top-0 z-20 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/30 flex items-center justify-center shadow-lg bounce-gentle">
            <span className="text-white font-bold text-sm">✦</span>
          </div>
          <span className="gyaru-title text-lg">LifeOS</span>
          <span className="gyaru-badge ml-1"><Globe size={10} />Public</span>
        </div>
        <span className="gyaru-badge-gold">✨ Gyaru Mode ✨</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-16 relative z-10">

        {/* Profile Header */}
        <div className="gyaru-card p-8 text-center">
          <div className="flex justify-center mb-4 relative">
            <div className="relative inline-block">
              <img
                src={`${import.meta.env.BASE_URL}profile.png`}
                alt="Zizou"
                className="w-28 h-28 rounded-full object-cover shadow-xl"
                style={{ border: '4px solid #FF69B4', boxShadow: '0 0 20px rgba(255,105,180,0.5), 0 0 40px rgba(255,215,0,0.3)' }}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-28 h-28 rounded-full items-center justify-center hidden"
                style={{ background: 'linear-gradient(135deg, #FF69B4, #FFD700)', border: '4px solid #FF1493' }}
                aria-hidden="true"
              >
                <span className="text-white text-4xl font-bold" style={{ fontFamily: "'Luckiest Guy', cursive" }}>Z</span>
              </div>
              <span className="absolute -top-1 -right-1 text-xl bounce-gentle">👑</span>
            </div>
          </div>
          <h1 className="gyaru-title text-4xl">Zizou</h1>
          <p className="gyaru-text font-bold mt-2 text-sm">Personal Growth Journey 🚀✨</p>
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="gyaru-badge"><Globe size={10} />@Public Profile</span>
            <span className="gyaru-badge-gold">🌸 JLPT N3 Student 🌸</span>
          </div>
        </div>

        {/* Activity Recap */}
        <div>
          <div className="gyaru-section-title">📈 Activity Recap</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Total Habits', value: habits.length || 5, icon: Target, emoji: '🎯' },
              { label: 'Total Goals', value: goals.length || 5, icon: Trophy, emoji: '🏆' },
              { label: 'Japanese Level', value: japanese?.currentLevel || 'N3', icon: BookOpen, emoji: '📚' },
              { label: 'Books Read', value: `${booksRead || 24} this year`, icon: BookOpen, emoji: '📖' },
              { label: 'Study Time', value: totalStudyMinutes > 0 ? `${studyHours}h ${studyMins}m` : '5h 45m', icon: Target, emoji: '⏰' },
              { label: 'Streak 🔥', value: `${Math.max(...(habits.map(h => h.streak || 0)), 14)} days`, icon: Trophy, emoji: '🔥' },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="gyaru-stat-card">
                <span className="text-2xl block mb-1">{emoji}</span>
                <p className="gyaru-subtitle text-lg leading-tight">{value}</p>
                <p className="gyaru-text text-xs mt-0.5 font-bold opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🇯🇵 MYJapan Plans — Gyaru Edition */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">🇯🇵 MYJapan Plans</div>

          {japanTotal === 0 ? (
            <p className="gyaru-text text-center py-4 text-sm font-bold opacity-60">No Japan plans added yet~ 🌸</p>
          ) : (
            <>
              {/* Overall Stats */}
              <div className="flex items-center justify-between mb-2">
                <span className="gyaru-text text-sm font-bold">Overall Progress</span>
                <span className="gyaru-title text-2xl">{japanPct}%</span>
              </div>
              <div className="gyaru-progress-track mb-4">
                <div className="gyaru-progress-bar" style={{ width: `${japanPct}%` }} />
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Completed', value: japanCompleted, emoji: '✅', bg: 'rgba(0,200,100,0.08)', border: '#5cb85c' },
                  { label: 'In Progress', value: japanInProgress, emoji: '⏳', bg: 'rgba(255,215,0,0.12)', border: '#FFD700' },
                  { label: 'Not Started', value: japanNotStarted, emoji: '⭕', bg: 'rgba(255,105,180,0.08)', border: '#FFB6D9' },
                ].map(({ label, value, emoji, bg, border }) => (
                  <div key={label} style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                    <span className="text-xl block mb-0.5">{emoji}</span>
                    <p className="gyaru-subtitle text-xl">{value}</p>
                    <p className="gyaru-text text-xs font-bold opacity-70">{label}</p>
                  </div>
                ))}
              </div>

              {/* Plans by category */}
              {Object.entries(categoryGroups).map(([category, items]) => {
                const catCompleted = items.filter(p => p.status === 'completed').length;
                const catPct = items.length > 0 ? Math.round((catCompleted / items.length) * 100) : 0;
                return (
                  <div key={category} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="gyaru-subtitle text-sm">{category}</span>
                      <span className="gyaru-badge-gold">{catCompleted}/{items.length} · {catPct}%</span>
                    </div>
                    <div className="gyaru-progress-track mb-3" style={{ height: '8px' }}>
                      <div className="gyaru-progress-bar" style={{ width: `${catPct}%` }} />
                    </div>
                    <div className="space-y-2">
                      {items.map(plan => (
                        <div key={plan.id} className="gyaru-japan-item flex items-center gap-3">
                          <span className="text-lg flex-shrink-0">{statusIcon[plan.status] || '⭕'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="gyaru-text text-sm font-bold truncate">{plan.title}</p>
                            {plan.subcategory && (
                              <p className="text-xs opacity-60 gyaru-text font-bold">{plan.subcategory}</p>
                            )}
                          </div>
                          {plan.priority && (
                            <span className="text-base flex-shrink-0" title={plan.priority}>{priorityEmoji[plan.priority] || '⭐'}</span>
                          )}
                          <span className="gyaru-badge text-xs flex-shrink-0" style={{ fontSize: '10px' }}>
                            {statusLabel[plan.status] || plan.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <p className="gyaru-text text-xs text-center opacity-60 mt-2 font-bold">
                {japanCompleted} of {japanTotal} plans completed 🌸 Keep going!
              </p>
            </>
          )}
        </div>

        {/* Mood Trends */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">
            <Heart size={18} style={{ color: '#FF69B4' }} />😊 Mood Trends
            {topMood && <span className="gyaru-badge-gold ml-auto">Top: {moodEmoji[topMood[0]] || '😊'} {topMood[0]}</span>}
          </div>
          {recentMoods.length === 0 ? (
            <p className="gyaru-text text-sm text-center py-4 font-bold opacity-60">No mood data recorded yet~ 🌸</p>
          ) : (
            <div className="flex items-end gap-2 h-20">
              {recentMoods.map((entry, i) => (
                <div key={entry.id ?? i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-lg leading-none" title={entry.mood}>{entry.emoji || moodEmoji[entry.mood] || '😊'}</span>
                  <div
                    className="w-full rounded-t-md"
                    style={{ height: `${(entry.intensity / 5) * 40 + 8}px`, background: 'linear-gradient(to top, #FF69B4, #FFD700)', opacity: 0.75 }}
                  />
                  <span className="text-xs truncate w-full text-center gyaru-text font-bold opacity-60">{entry.date?.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
          {moodLog.length > 0 && (
            <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: '2px dashed #FFB6D9' }}>
              {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
                <span key={mood} className="gyaru-text text-xs font-bold">
                  {moodEmoji[mood] || '😊'} {mood} ×{count}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Health Stats */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">💪 Health Stats</div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Droplets size={15} style={{ color: '#4FC3F7' }} />
                <span className="gyaru-text text-sm font-bold">Daily Water Intake</span>
                <span className="ml-auto gyaru-badge-gold text-xs">
                  {healthLog.length > 0 ? `${avgWater}/${waterGoal} cups avg` : '— / 8 cups'}
                </span>
              </div>
              <div className="gyaru-progress-track">
                <div className="gyaru-progress-bar" style={{ width: `${Math.min(100, (avgWater / waterGoal) * 100)}%`, background: 'linear-gradient(90deg, #4FC3F7, #0288D1)' }} />
              </div>
              {healthLog.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {healthLog.slice(0, 7).reverse().map((entry, i) => (
                    <div key={entry.id ?? i} className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{entry.water >= waterGoal ? '💧' : '🫗'}</span>
                      <span className="gyaru-text text-xs font-bold opacity-60">{entry.date?.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell size={15} style={{ color: '#66BB6A' }} />
                <span className="gyaru-text text-sm font-bold">Exercise</span>
                <span className="ml-auto gyaru-badge-gold text-xs">
                  {healthLog.length > 0
                    ? `${avgExercise} min/day avg · ${Math.floor(totalExerciseMin / 60)}h total`
                    : '— min/day'}
                </span>
              </div>
              <div className="gyaru-progress-track">
                <div className="gyaru-progress-bar" style={{ width: `${Math.min(100, (avgExercise / 60) * 100)}%`, background: 'linear-gradient(90deg, #66BB6A, #43A047)' }} />
              </div>
              {healthLog.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {healthLog.slice(0, 7).reverse().map((entry, i) => (
                    <div key={entry.id ?? i} className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{entry.exercise >= 30 ? '🏃' : entry.exercise > 0 ? '🚶' : '😴'}</span>
                      <span className="gyaru-text text-xs font-bold opacity-60">{entry.exercise}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="gyaru-card p-5">
          <div className="gyaru-section-title">🎯 Goals Progress</div>
          <div className="space-y-4">
            {(goals.length > 0 ? goals : [
              { id: 1, title: 'Pass JLPT N3', progress: 65, target: 100 },
              { id: 2, title: 'Read 24 books this year', progress: 5, target: 24 },
              { id: 3, title: 'Build 3 portfolio projects', progress: 1, target: 3 },
            ]).map(goal => {
              const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
              return (
                <div key={goal.id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="gyaru-text text-sm font-bold">{goal.title}</span>
                    <span className="gyaru-badge">{pct}%</span>
                  </div>
                  <div className="gyaru-progress-track">
                    <div className="gyaru-progress-bar" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spotify Music Player */}
        <div className="gyaru-card p-5 overflow-hidden">
          <div className="gyaru-section-title">
            <Music2 size={18} style={{ color: '#FF69B4' }} />🎵 NOW PLAYING
          </div>
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '16px', border: '3px solid #FF69B4', boxShadow: '0 4px 20px rgba(255,105,180,0.3)' }}
            src={`https://open.spotify.com/embed/album/${MJ_ALBUM_ID}?utm_source=generator`}
            width="100%"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Michael Jackson Album"
          />
        </div>

        <p className="text-center text-sm pb-4 gyaru-text font-bold opacity-70">
          ✦ Read-only public profile ✦ Powered by LifeOS ✦ うちら最強！✦
        </p>
      </main>
    </div>
  );
};

export default PublicProfile;

