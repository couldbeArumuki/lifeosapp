import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Target, BookOpen, PenLine,
  Activity, Trophy, BarChart3, Menu, X, Sun, Moon,
  ChevronRight, Palette, ClipboardList, Music2, Map
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/habits', label: 'Habits', icon: Target },
  { path: '/japanese-learning', label: 'Japanese', icon: BookOpen },
  { path: '/study-log', label: 'Study Log', icon: PenLine },
  { path: '/trackers', label: 'Trackers', icon: Activity },
  { path: '/goals', label: 'Goals', icon: Trophy },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/todo', label: 'Todo List', icon: ClipboardList },
  { path: '/music', label: 'Music', icon: Music2 },
  { path: '/myjapan-plans', label: 'MYJapan Plans', icon: Map },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { isDark, toggleTheme, accentKey, setAccent, ACCENT_THEMES } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-white/10 z-30 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static flex flex-col`}>
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-text-dark dark:text-text-light text-lg leading-none">LifeOS</h1>
              <p className="text-xs text-gray-400">Personal Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon }) => {
            const NavIcon = icon;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive(path)
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-dark dark:hover:text-text-light'
                }`}
              >
                <NavIcon size={18} />
                <span className="flex-1">{label}</span>
                {isActive(path) && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-white/10 space-y-1">
          {/* Theme picker toggle */}
          <button
            onClick={() => setShowThemePicker(v => !v)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-dark dark:hover:text-text-light transition-all duration-200"
          >
            <Palette size={18} />
            <span>Accent Color</span>
          </button>

          {showThemePicker && (
            <div className="grid grid-cols-4 gap-2 px-3 pb-2 animate-scale-in">
              {ACCENT_THEMES.map(t => (
                <button
                  key={t.key}
                  title={t.label}
                  onClick={() => setAccent(t.key)}
                  style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                  className={`w-8 h-8 rounded-xl transition-all duration-200 ${accentKey === t.key ? 'ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-md' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-dark dark:hover:text-text-light transition-all duration-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="font-heading font-semibold text-text-dark dark:text-text-light text-base capitalize">
                {navItems.find(n => n.path === location.pathname)?.label || 'LifeOS'}
              </h2>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">Z</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
