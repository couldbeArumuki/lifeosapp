import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const categoryColor = { Learning: 'purple', Personal: 'pink', Career: 'blue', Health: 'green', Other: 'gray' };
const CATEGORIES = Object.keys(categoryColor);

const defaultForm = { title: '', description: '', category: 'Personal', target: '', progress: '0', deadline: '', status: 'in-progress' };

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    return getData('goals', []);
  });
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setGoals(updated); saveData('goals', updated); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    const t = Number(form.target);
    if (!form.target || isNaN(t) || t <= 0) e.target = 'Target must be a positive number';
    if (!form.deadline) e.deadline = 'Deadline is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const entry = { id: Date.now(), title: form.title.trim(), description: form.description.trim(), category: form.category, target: Number(form.target), progress: Number(form.progress) || 0, deadline: form.deadline, status: form.status };
    persist([...goals, entry]);
    addToast('Goal added!', 'success');
    setShowModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const handleDelete = () => {
    persist(goals.filter(g => g.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Goal deleted.', 'info');
  };

  const updateProgress = (id, delta) => {
    const updated = goals.map(g => {
      if (g.id !== id) return g;
      const newProgress = Math.min(g.target, Math.max(0, g.progress + delta));
      const status = newProgress >= g.target ? 'completed' : 'in-progress';
      return { ...g, progress: newProgress, status };
    });
    persist(updated);
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{goals.filter(g => g.status === 'completed').length}/{goals.length} completed</p>
        </div>
        <Button variant="primary" onClick={() => { setForm(defaultForm); setErrors({}); setShowModal(true); }}><Plus size={16} /> New Goal</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.length === 0 && (
          <Card className="sm:col-span-2"><p className="text-center text-gray-400 py-4">No goals yet. Set your first goal!</p></Card>
        )}
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
          return (
            <Card key={goal.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 mr-2">
                  <h3 className="font-semibold text-text-dark dark:text-text-light">{goal.title}</h3>
                  {goal.description && <p className="text-xs text-gray-400 mt-1">{goal.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Badge color={categoryColor[goal.category] || 'gray'}>{goal.category}</Badge>
                  <button onClick={() => setDeleteConfirm(goal.id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span><span>{goal.progress}/{goal.target} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">Deadline: {goal.deadline}</p>
                <div className="flex gap-1">
                  <button onClick={() => updateProgress(goal.id, -1)} disabled={goal.progress <= 0} className="px-2 py-0.5 rounded text-sm bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 disabled:opacity-40 transition-colors">−</button>
                  <button onClick={() => updateProgress(goal.id, 1)} disabled={goal.progress >= goal.target} className="px-2 py-0.5 rounded text-sm bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 transition-colors">+</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Goal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" placeholder="e.g. Pass JLPT N3" value={form.title} onChange={e => setField('title', e.target.value)} error={errors.title} />
          <Input label="Description (optional)" placeholder="Brief description of your goal" value={form.description} onChange={e => setField('description', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
              <select value={form.category} onChange={e => setField('category', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Target" type="number" placeholder="e.g. 100" value={form.target} onChange={e => setField('target', e.target.value)} error={errors.target} min="1" />
          </div>
          <Input label="Deadline" type="date" value={form.deadline} onChange={e => setField('deadline', e.target.value)} error={errors.deadline} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Add Goal</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Goal" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Delete this goal? All progress will be lost.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Goals;
