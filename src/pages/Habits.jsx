import { useState } from 'react';
import { Plus, Flame, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const HABIT_COLORS = ['#6B9BD1', '#B19CD9', '#7EC8A3', '#F4A6C1', '#F4A261', '#E76F51', '#2A9D8F'];

const Habits = () => {
  const [habits, setHabits] = useState(() => {
    initializeData(allMockData);
    return getData('habits', []);
  });
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', color: HABIT_COLORS[0] });
  const [formError, setFormError] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const persist = (updated) => { setHabits(updated); saveData('habits', updated); };

  const toggleToday = (id) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const dates = h.completedDates || [];
      const done = dates.includes(today);
      const newDates = done ? dates.filter(d => d !== today) : [...dates, today];
      // Recalculate streak from today going backwards
      const streak = calcStreak(newDates);
      return { ...h, completedDates: newDates, streak };
    });
    persist(updated);
  };

  const calcStreak = (dates) => {
    let count = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      if (dates.includes(ds)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  };

  const openAdd = () => { setForm({ name: '', color: HABIT_COLORS[0] }); setFormError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setFormError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Habit name is required'); return; }
    const newHabit = { id: Date.now(), name: form.name.trim(), color: form.color, frequency: 'daily', streak: 0, completedDates: [] };
    persist([...habits, newHabit]);
    addToast('Habit added!', 'success');
    closeModal();
  };

  const handleDelete = () => {
    persist(habits.filter(h => h.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Habit deleted.', 'info');
  };

  const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Habits</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{completedToday}/{habits.length} done today</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> New Habit</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <p className="text-center text-gray-400 py-4">No habits yet. Add your first habit!</p>
          </Card>
        )}
        {habits.map(habit => {
          const done = habit.completedDates?.includes(today);
          return (
            <Card key={habit.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                  <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{habit.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Badge color={done ? 'green' : 'gray'}>{done ? 'Done' : 'Pending'}</Badge>
                  <button onClick={() => setDeleteConfirm(habit.id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Flame size={16} className="text-orange-400" />
                <span className="text-sm font-mono font-bold text-text-dark dark:text-text-light">{habit.streak}</span>
                <span className="text-xs text-gray-400">day streak</span>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - 6 + i);
                  const ds = d.toISOString().split('T')[0];
                  const isDone = habit.completedDates?.includes(ds);
                  return <div key={i} className={`flex-1 h-2 rounded-full ${isDone ? '' : 'bg-gray-100 dark:bg-white/10'}`} style={isDone ? { backgroundColor: habit.color } : {}} />;
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
              <button
                onClick={() => toggleToday(habit.id)}
                className={`mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all ${done ? 'bg-gray-100 dark:bg-white/10 text-gray-500' : 'text-white'}`}
                style={done ? {} : { backgroundColor: habit.color }}
              >
                {done ? '✓ Completed today' : 'Mark as done'}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title="New Habit" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Habit Name" placeholder="e.g. Morning Meditation" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={formError} />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Color</label>
            <div className="flex gap-2 flex-wrap">
              {HABIT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Add Habit</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Habit" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Are you sure you want to delete this habit? All streak data will be lost.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Habits;
