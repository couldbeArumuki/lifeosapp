import { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getData } from '../utils/localStorage';
import { Globe, BookOpen, Target, Trophy, Sun, Moon, Music2, Disc3, Star } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const MJ_ALBUM_ID = '3OBhnTLrvkoEEETjFA3Qfk';

const AlbumCoverPublic = ({ url, title, artist }) => {
  const [imgError, setImgError] = useState(false);
  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={`${title} by ${artist}`}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      <Disc3 size={32} className="text-primary/60" />
    </div>
  );
};

const PublicProfile = () => {
  const [goals] = useState(() => getData('goals', []));
  const [habits] = useState(() => getData('habits', []));
  const [japanese] = useState(() => getData('japanese', null));
  const [studyLog] = useState(() => getData('studyLog', []));
  const [albums] = useState(() => getData('musicAlbums', []));
  const { isDark, toggleTheme } = useTheme();

  const totalStudyMinutes = studyLog.reduce((sum, s) => sum + (s.duration || 0), 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = totalStudyMinutes % 60;

  const booksRead = (() => {
    const booksGoal = goals.find(g => g.title?.toLowerCase().includes('book'));
    return booksGoal ? booksGoal.progress : 0;
  })();

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

        {/* Favorite Albums */}
        {albums.length > 0 && (
          <div>
            <h2 className="text-base font-heading font-semibold text-text-dark dark:text-text-light mb-3 px-1 flex items-center gap-2">
              <Music2 size={16} className="text-primary" />
              🎵 My Favorite Albums
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {albums.map(album => (
                <Card key={album.id} className="p-0 overflow-hidden card-hover">
                  <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                    <AlbumCoverPublic url={album.coverUrl} title={album.title} artist={album.artist} />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-text-dark dark:text-text-light text-xs leading-tight line-clamp-2">{album.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{album.artist}</p>
                    {album.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{album.description}</p>
                    )}
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={i < album.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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

