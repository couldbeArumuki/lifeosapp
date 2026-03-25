import { useState } from 'react';
import { Plus, Clock, PenLine, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const subjects = { Japanese: 'purple', Homework: 'blue', Math: 'green', Other: 'gray' };
const SUBJECTS = Object.keys(subjects);

const defaultForm = { subject: 'Japanese', duration: '', notes: '', rating: 4, date: new Date().toISOString().split('T')[0] };

const StudyLog = () => {
  const [logs, setLogs] = useState(() => {
    return getData('studyLog', []);
  });
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setLogs(updated); saveData('studyLog', updated); };

  const validate = () => {
    const e = {};
    const dur = Number(form.duration);
    if (!form.duration || isNaN(dur) || dur <= 0) e.duration = 'Enter a valid duration (minutes > 0)';
    if (dur > 1440) e.duration = 'Duration cannot exceed 1440 minutes (24h)';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setForm(defaultForm); setErrors({}); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const entry = { id: Date.now(), subject: form.subject, duration: Number(form.duration), notes: form.notes.trim(), rating: Number(form.rating), date: form.date };
    persist([entry, ...logs]);
    addToast('Study session logged!', 'success');
    closeModal();
  };

  const handleDelete = () => {
    persist(logs.filter(l => l.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Session deleted.', 'info');
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const totalMin = logs.reduce((s, l) => s + l.duration, 0);

  // Weekly aggregation
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weeklyMin = logs.filter(l => l.date >= weekStartStr).reduce((s, l) => s + l.duration, 0);

  // Weekly summary by subject
  const weeklyBySubject = logs
    .filter(l => l.date >= weekStartStr)
    .reduce((acc, l) => {
      acc[l.subject] = (acc[l.subject] || 0) + l.duration;
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Study Log</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Total: {Math.floor(totalMin / 60)}h {totalMin % 60}min &bull; This week: {Math.floor(weeklyMin / 60)}h {weeklyMin % 60}min
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> Log Session</Button>
      </div>

      {Object.keys(weeklyBySubject).length > 0 && (
        <Card>
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-3 text-sm">This Week by Subject</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(weeklyBySubject).map(([subject, minutes]) => (
              <div key={subject} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <Badge color={subjects[subject] || 'gray'}>{subject}</Badge>
                <p className="font-mono font-bold text-text-dark dark:text-text-light mt-2">
                  {Math.floor(minutes / 60)}h {Math.floor(minutes % 60)}m
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {logs.length === 0 && (
          <Card><p className="text-center text-gray-400 py-4">No sessions logged yet. Start tracking!</p></Card>
        )}
        {logs.map(log => (
          <Card key={log.id} className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
              <PenLine size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{log.subject}</h3>
                <Badge color={subjects[log.subject] || 'gray'}>{log.subject}</Badge>
              </div>
              {log.notes && <p className="text-xs text-gray-400 mt-1">{log.notes}</p>}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs flex items-center gap-1 text-gray-500"><Clock size={12} /> {log.duration} min</span>
                <span className="text-xs text-gray-400">{log.date}</span>
                <span className="text-xs text-yellow-500">{'★'.repeat(log.rating)}{'☆'.repeat(5 - log.rating)}</span>
              </div>
            </div>
            <button onClick={() => setDeleteConfirm(log.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
          </Card>
        ))}
      </div>

      {/* Log Session Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title="Log Study Session">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Subject</label>
            <select value={form.subject} onChange={e => setField('subject', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Duration (minutes)" type="number" placeholder="e.g. 45" value={form.duration} onChange={e => setField('duration', e.target.value)} error={errors.duration} min="1" max="1440" />
          <Input label="Date" type="date" value={form.date} onChange={e => setField('date', e.target.value)} error={errors.date} />
          <Input label="Notes (optional)" placeholder="What did you study?" value={form.notes} onChange={e => setField('notes', e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Rating: {form.rating}/5</label>
            <input type="range" min="1" max="5" value={form.rating} onChange={e => setField('rating', Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Poor</span><span>Excellent</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log Session</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Session" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Delete this study session? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default StudyLog;
