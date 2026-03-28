import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, ChevronDown, ChevronRight, ListChecks } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const STORAGE_KEY = 'todos';
const PRIORITY_COLOR = { high: 'red', medium: 'yellow', low: 'green' };
const CATEGORIES = ['Personal', 'Work', 'Study', 'Health', 'Shopping', 'Other'];

const todayStr = () => new Date().toISOString().split('T')[0];

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  category: 'Personal',
  checklist: [],
};

const isOverdue = (dueDate, completed) =>
  !completed && dueDate && dueDate < todayStr();

const TodoList = () => {
  const [todos, setTodos] = useState(() => getData(STORAGE_KEY, []));
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setTodos(updated); saveData(STORAGE_KEY, updated); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(defaultForm);
    setNewChecklistText('');
    setEditId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (todo) => {
    setForm({ ...todo, checklist: todo.checklist ? [...todo.checklist] : [] });
    setNewChecklistText('');
    setEditId(todo.id);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setErrors({});
    setNewChecklistText('');
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addChecklistItem = () => {
    const text = newChecklistText.trim();
    if (!text) return;
    const item = { id: Date.now() + Math.random(), text, completed: false };
    setForm(f => ({ ...f, checklist: [...f.checklist, item] }));
    setNewChecklistText('');
  };

  const toggleChecklistItem = (itemId) => {
    setForm(f => ({
      ...f,
      checklist: f.checklist.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i),
    }));
  };

  const removeChecklistItem = (itemId) => {
    setForm(f => ({ ...f, checklist: f.checklist.filter(i => i.id !== itemId) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId !== null) {
      const updated = todos.map(t =>
        t.id === editId ? { ...form, id: editId } : t
      );
      persist(updated);
      addToast('Todo updated!', 'success');
    } else {
      const newTodo = { ...form, id: Date.now() + Math.random(), completed: false };
      persist([...todos, newTodo]);
      addToast('Todo added!', 'success');
    }
    closeModal();
  };

  const toggleComplete = (id) => {
    const updated = todos.map(t => {
      if (t.id !== id) return t;
      const completed = !t.completed;
      const checklist = completed
        ? t.checklist.map(i => ({ ...i, completed: true }))
        : t.checklist.map(i => ({ ...i, completed: false }));
      return { ...t, completed, checklist };
    });
    persist(updated);
  };

  const toggleTodoChecklistItem = (todoId, itemId) => {
    const updated = todos.map(t => {
      if (t.id !== todoId) return t;
      const checklist = t.checklist.map(i =>
        i.id === itemId ? { ...i, completed: !i.completed } : i
      );
      const completed = checklist.length > 0 && checklist.every(i => i.completed);
      return { ...t, checklist, completed };
    });
    persist(updated);
  };

  const confirmDelete = (id) => setDeleteConfirm(id);
  const handleDelete = () => {
    persist(todos.filter(t => t.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Todo deleted.', 'info');
  };

  const toggleExpand = (id) => {
    setExpandedIds(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    );
  };

  const filtered = (() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    if (filter === 'overdue') return todos.filter(t => isOverdue(t.dueDate, t.completed));
    return todos;
  })();

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Todo List</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {completedCount}/{todos.length} completed
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Todo</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'completed', 'overdue'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo Items */}
      <div className="grid gap-3">
        {filtered.length === 0 && (
          <Card>
            <p className="text-center text-gray-400 py-4">No todos found. Add one!</p>
          </Card>
        )}
        {filtered.map(todo => {
          const expanded = expandedIds.includes(todo.id);
          const overdue = isOverdue(todo.dueDate, todo.completed);
          const checklistDone = todo.checklist?.filter(i => i.completed).length ?? 0;
          const checklistTotal = todo.checklist?.length ?? 0;

          return (
            <Card key={todo.id} className="space-y-2">
              <div className="flex items-start gap-3">
                {/* Complete toggle */}
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-accent border-accent'
                      : 'border-gray-300 dark:border-gray-600 hover:border-accent'
                  }`}
                >
                  {todo.completed && <Check size={12} className="text-white" />}
                </button>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-text-dark dark:text-text-light'}`}>
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{todo.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge color={PRIORITY_COLOR[todo.priority]}>{todo.priority}</Badge>
                    <Badge color="gray">{todo.category}</Badge>
                    {todo.dueDate && (
                      <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                        {overdue ? '⚠ ' : ''}Due: {todo.dueDate}
                      </span>
                    )}
                    {checklistTotal > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <ListChecks size={12} /> {checklistDone}/{checklistTotal}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {checklistTotal > 0 && (
                    <button
                      onClick={() => toggleExpand(todo.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                    >
                      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(todo)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => confirmDelete(todo.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Checklist (expanded) */}
              {expanded && checklistTotal > 0 && (
                <div className="ml-8 space-y-1.5 border-t border-gray-100 dark:border-white/10 pt-2 mt-2">
                  {todo.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTodoChecklistItem(todo.id, item.id)}
                        className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-accent border-accent'
                            : 'border-gray-300 dark:border-gray-600 hover:border-accent'
                        }`}
                      >
                        {item.completed && <Check size={10} className="text-white" />}
                      </button>
                      <span className={`text-xs ${item.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editId !== null ? 'Edit Todo' : 'Add Todo'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            error={errors.title}
          />
          <Input
            label="Description (optional)"
            placeholder="Add more details..."
            value={form.description}
            onChange={e => setField('description', e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={e => setField('dueDate', e.target.value)}
            error={errors.dueDate}
          />
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
              <select
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Priority</label>
              <select
                value={form.priority}
                onChange={e => setField('priority', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {['low', 'medium', 'high'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Checklist builder */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Checklist</label>
            {form.checklist.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-accent border-accent'
                      : 'border-gray-300 dark:border-gray-600 hover:border-accent'
                  }`}
                >
                  {item.completed && <Check size={10} className="text-white" />}
                </button>
                <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-text-dark dark:text-text-light'}`}>
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add checklist item..."
                value={newChecklistText}
                onChange={e => setNewChecklistText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChecklistItem(); } }}
                className="flex-1 rounded-xl px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Button type="button" variant="ghost" onClick={addChecklistItem}>
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">
              {editId !== null ? 'Save Changes' : 'Add Todo'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Todo" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Are you sure you want to delete this todo? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default TodoList;
