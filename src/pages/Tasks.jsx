import { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const priorityColor = { high: 'red', medium: 'yellow', low: 'green' };
const statusColor = { completed: 'green', 'in-progress': 'blue', todo: 'gray' };
const CATEGORIES = ['Learning', 'Health', 'Personal', 'Study', 'Work', 'Other'];

const defaultForm = { title: '', priority: 'medium', status: 'todo', dueDate: '', category: 'Personal', completed: false };

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    return getData('tasks', []);
  });
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setTasks(updated); saveData('tasks', updated); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setForm(defaultForm); setEditTask(null); setErrors({}); setShowModal(true); };
  const openEdit = (task) => { setForm({ ...task }); setEditTask(task.id); setErrors({}); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTask(null); setErrors({}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const completed = form.status === 'completed';
    if (editTask !== null) {
      const updated = tasks.map(t => t.id === editTask ? { ...form, id: editTask, completed } : t);
      persist(updated);
      addToast('Task updated!', 'success');
    } else {
      const newTask = { ...form, id: Date.now(), completed };
      persist([...tasks, newTask]);
      addToast('Task added!', 'success');
    }
    closeModal();
  };

  const toggleComplete = (id) => {
    const updated = tasks.map(t => {
      if (t.id !== id) return t;
      const completed = !t.completed;
      return { ...t, completed, status: completed ? 'completed' : 'todo' };
    });
    persist(updated);
  };

  const confirmDelete = (id) => setDeleteConfirm(id);
  const handleDelete = () => {
    persist(tasks.filter(t => t.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Task deleted.', 'info');
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{tasks.filter(t => t.completed).length}/{tasks.length} completed</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Task</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'todo', 'in-progress', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <Card><p className="text-center text-gray-400 py-4">No tasks found. Add one!</p></Card>
        )}
        {filtered.map(task => (
          <Card key={task.id} className="flex items-start gap-4">
            <button
              onClick={() => toggleComplete(task.id)}
              className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${task.completed ? 'bg-accent border-accent' : 'border-gray-300 dark:border-gray-600 hover:border-accent'}`}
            >
              {task.completed && <Check size={12} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${task.completed ? 'line-through text-gray-400' : 'text-text-dark dark:text-text-light'}`}>{task.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
                <Badge color={statusColor[task.status]}>{task.status}</Badge>
                <span className="text-xs text-gray-400">{task.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge color="gray">{task.category}</Badge>
              <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"><Pencil size={14} /></button>
              <button onClick={() => confirmDelete(task.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editTask !== null ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" placeholder="Task title" value={form.title} onChange={e => setField('title', e.target.value)} error={errors.title} />
          <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setField('dueDate', e.target.value)} error={errors.dueDate} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
            <select value={form.category} onChange={e => setField('category', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Priority</label>
            <select value={form.priority} onChange={e => setField('priority', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
            <select value={form.status} onChange={e => setField('status', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              {['todo', 'in-progress', 'completed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">{editTask !== null ? 'Save Changes' : 'Add Task'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Task" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Are you sure you want to delete this task? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Tasks;
