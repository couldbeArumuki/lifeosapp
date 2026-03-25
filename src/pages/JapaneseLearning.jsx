import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, BookOpen, Clock, Star, BarChart2 } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const STORAGE_KEY = 'japanese_study_sessions';
const N_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

const todayStr = () => new Date().toISOString().split('T')[0];

const defaultForm = {
  date: todayStr(),
  minutes: '',
  kanjiCount: '',
  nLevel: 'N5',
  notes: '',
};

const nLevelColor = { N5: 'green', N4: 'blue', N3: 'yellow', N2: 'red', N1: 'purple' };

const getWeekStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
};

const JapaneseLearning = () => {
  const [sessions, setSessions] = useState(() => getData(STORAGE_KEY, []));
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => {
    setSessions(updated);
    saveData(STORAGE_KEY, updated);
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Date is required';
    if (!form.minutes || Number(form.minutes) <= 0) e.minutes = 'Minutes must be greater than 0';
    if (!form.kanjiCount || Number(form.kanjiCount) <= 0) e.kanjiCount = 'Kanji count must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm({ ...defaultForm, date: todayStr() });
    setEditId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (session) => {
    setForm({
      date: session.date,
      minutes: String(session.minutes),
      kanjiCount: String(session.kanjiCount),
      nLevel: session.nLevel,
      notes: session.notes || '',
    });
    setEditId(session.id);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId !== null) {
      const updated = sessions.map(s =>
        s.id === editId
          ? { ...s, date: form.date, minutes: Number(form.minutes), kanjiCount: Number(form.kanjiCount), nLevel: form.nLevel, notes: form.notes }
          : s
      );
      persist(updated);
      addToast('Study session updated!', 'success');
    } else {
      const newSession = {
        id: Date.now(),
        date: form.date,
        minutes: Number(form.minutes),
        kanjiCount: Number(form.kanjiCount),
        nLevel: form.nLevel,
        notes: form.notes,
        timestamp: Date.now(),
      };
      persist([...sessions, newSession]);
      addToast('Study session logged!', 'success');
    }
    closeModal();
  };

  const handleDelete = () => {
    persist(sessions.filter(s => s.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Session deleted.', 'info');
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions]
  );

  const stats = useMemo(() => {
    const weekStart = getWeekStart();
    const thisWeek = sessions.filter(s => s.date >= weekStart);
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
    const totalKanji = sessions.reduce((sum, s) => sum + s.kanjiCount, 0);
    const weekMinutes = thisWeek.reduce((sum, s) => sum + s.minutes, 0);
    const weekKanji = thisWeek.reduce((sum, s) => sum + s.kanjiCount, 0);
    const avgMinutes = sessions.length ? Math.round(totalMinutes / sessions.length) : 0;
    const avgKanji = sessions.length ? Math.round(totalKanji / sessions.length) : 0;
    const currentLevel = sessions.length
      ? sessions.reduce((latest, s) => (s.timestamp > latest.timestamp ? s : latest)).nLevel
      : '—';
    return { totalMinutes, totalKanji, weekMinutes, weekKanji, avgMinutes, avgKanji, currentLevel };
  }, [sessions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Japanese Learning</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Daily Study Logger</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> Log Study Session</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Study Time', value: `${stats.totalMinutes} min`, icon: Clock, color: 'text-primary' },
          { label: 'Total Kanji', value: stats.totalKanji, icon: BookOpen, color: 'text-secondary' },
          { label: 'This Week', value: `${stats.weekMinutes} min`, icon: BarChart2, color: 'text-accent' },
          { label: 'Current Level', value: stats.currentLevel, icon: Star, color: 'text-yellow-500' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Week Kanji', value: stats.weekKanji },
          { label: 'Avg Min / Session', value: stats.avgMinutes },
          { label: 'Avg Kanji / Session', value: stats.avgKanji },
          { label: 'Total Sessions', value: sessions.length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-xl font-bold font-mono mt-1 text-text-dark dark:text-text-light">{value}</p>
          </Card>
        ))}
      </div>

      {/* History */}
      <Card>
        <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Study History</h3>
        {sorted.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No sessions yet. Log your first study session!</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {sorted.map(s => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 dark:border-white/5 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text-dark dark:text-text-light">{s.date}</span>
                    <Badge color={nLevelColor[s.nLevel]}>{s.nLevel}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {s.minutes} min</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><BookOpen size={12} /> {s.kanjiCount} kanji</span>
                  </div>
                  {s.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic truncate" title={s.notes}>{s.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(s.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editId !== null ? 'Edit Study Session' : 'Log Study Session'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" value={form.date} onChange={e => setField('date', e.target.value)} error={errors.date} />
          <Input label="Minutes Studied" type="number" min="1" placeholder="e.g. 45" value={form.minutes} onChange={e => setField('minutes', e.target.value)} error={errors.minutes} />
          <Input label="Kanji Reviewed" type="number" min="1" placeholder="e.g. 15" value={form.kanjiCount} onChange={e => setField('kanjiCount', e.target.value)} error={errors.kanjiCount} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">N-Level</label>
            <select
              value={form.nLevel}
              onChange={e => setField('nLevel', e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              {N_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Notes / Reflection <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              rows={3}
              placeholder="What did you study today?"
              value={form.notes}
              onChange={e => setField('notes', e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">{editId !== null ? 'Save Changes' : 'Log Session'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Session" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Are you sure you want to delete this study session? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default JapaneseLearning;
