import { useState } from 'react';
import { Plus, Trash2, Droplets, Dumbbell, Banknote, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Education', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

const defaultHealthForm = { water: 8, exercise: 30, weight: '', date: new Date().toISOString().split('T')[0], notes: '' };
const defaultFinanceForm = { type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] };

const formatIDR = (amount) => `Rp ${Math.round(amount).toLocaleString('id-ID')}`;

const TABS = [
  { key: 'exercise', label: 'Exercise', emoji: '💪' },
  { key: 'finance',  label: 'Finance',  emoji: '💰' },
];

const MYTrace = () => {
  const [exerciseLog, setExerciseLog] = useState(() => getData('healthLog', []));
  const [financeLog, setFinanceLog] = useState(() => getData('financeLog', []));
  const [tab, setTab] = useState('exercise');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(defaultHealthForm);
  const [financeForm, setFinanceForm] = useState(defaultFinanceForm);
  const [financeErrors, setFinanceErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const persistExercise = (updated) => { setExerciseLog(updated); saveData('healthLog', updated); };
  const persistFinance = (updated) => { setFinanceLog(updated); saveData('financeLog', updated); };

  const handleExerciseSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: exerciseForm.date,
      water: Number(exerciseForm.water),
      exercise: Number(exerciseForm.exercise),
      weight: exerciseForm.weight ? Number(exerciseForm.weight) : null,
      notes: exerciseForm.notes.trim(),
    };
    persistExercise([entry, ...exerciseLog]);
    addToast('Exercise logged!', 'success');
    setShowExerciseModal(false);
    setExerciseForm(defaultHealthForm);
  };

  const validateFinance = () => {
    const e = {};
    if (!financeForm.amount || isNaN(Number(financeForm.amount)) || Number(financeForm.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!financeForm.date) e.date = 'Date is required';
    setFinanceErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFinanceSubmit = (e) => {
    e.preventDefault();
    if (!validateFinance()) return;
    const entry = {
      id: Date.now(),
      type: financeForm.type,
      amount: Math.round(Number(financeForm.amount)),
      category: financeForm.category,
      description: financeForm.description.trim(),
      date: financeForm.date,
    };
    persistFinance([entry, ...financeLog]);
    addToast(`${financeForm.type === 'income' ? 'Income' : 'Expense'} logged!`, 'success');
    setShowFinanceModal(false);
    setFinanceForm(defaultFinanceForm);
    setFinanceErrors({});
  };

  const handleDelete = () => {
    if (tab === 'exercise') persistExercise(exerciseLog.filter(e => e.id !== deleteConfirm));
    else persistFinance(financeLog.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Entry deleted.', 'info');
  };

  const setExerciseField = (key, val) => setExerciseForm(f => ({ ...f, [key]: val }));
  const setFinanceField = (key, val) => setFinanceForm(f => ({ ...f, [key]: val }));

  // Finance summary
  const totalIncome = financeLog.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpense = financeLog.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const openLogModal = () => {
    if (tab === 'exercise') setShowExerciseModal(true);
    else setShowFinanceModal(true);
  };

  const logLabel = { exercise: 'Exercise', finance: 'Finance' };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">MYTrace</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Exercise &amp; Finance tracking</p>
        </div>
        <Button variant="primary" onClick={openLogModal}>
          <Plus size={16} /> Log {logLabel[tab]}
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${tab === t.key ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'}`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── EXERCISE TAB ── */}
      {tab === 'exercise' && (
        <div className="space-y-4">
          {exerciseLog.length > 0 && (() => {
            const avgWater = Math.round(exerciseLog.reduce((s,e)=>s+e.water,0)/exerciseLog.length);
            const avgExercise = Math.round(exerciseLog.reduce((s,e)=>s+e.exercise,0)/exerciseLog.length);
            const latestWithWeight = exerciseLog.find(e=>e.weight);
            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Water', value: `${avgWater} cups`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Avg Exercise', value: `${avgExercise} min`, icon: Dumbbell, color: 'text-accent', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { label: 'Latest Weight', value: latestWithWeight ? `${latestWithWeight.weight} kg` : '—', icon: Scale, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map(s => (
                  <Card key={s.label} className={`${s.bg} border-0`}>
                    <div className="flex items-center gap-2">
                      <s.icon size={16} className={s.color} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
                    </div>
                    <p className={`text-xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
                  </Card>
                ))}
              </div>
            );
          })()}
          <div className="grid gap-3">
            {exerciseLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No exercise entries yet. Start tracking!</p></Card>}
            {exerciseLog.map(entry => (
              <Card key={entry.id} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 flex-shrink-0">
                  <Dumbbell size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm text-text-dark dark:text-text-light">{entry.date}</h3>
                    <Badge color="blue"><Droplets size={10} className="inline" /> {entry.water} cups</Badge>
                    <Badge color="green"><Dumbbell size={10} className="inline" /> {entry.exercise} min</Badge>
                    {entry.weight && <Badge color="purple">{entry.weight} kg</Badge>}
                  </div>
                  {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                </div>
                <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── FINANCE TAB ── */}
      {tab === 'finance' && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-green-50 dark:bg-green-900/20 border-0">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Income</span>
              </div>
              <p className="text-xl font-bold font-mono mt-1 text-green-600">{formatIDR(totalIncome)}</p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/20 border-0">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-red-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Expenses</span>
              </div>
              <p className="text-xl font-bold font-mono mt-1 text-red-500">{formatIDR(totalExpense)}</p>
            </Card>
            <Card className={`border-0 ${balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
              <div className="flex items-center gap-2">
                <Banknote size={16} className={balance >= 0 ? 'text-primary' : 'text-orange-500'} />
                <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
              </div>
              <p className={`text-xl font-bold font-mono mt-1 ${balance >= 0 ? 'text-primary' : 'text-orange-500'}`}>{formatIDR(balance)}</p>
            </Card>
          </div>

          <div className="grid gap-3">
            {financeLog.length === 0 && <Card><p className="text-center text-gray-400 py-4">No finance entries yet. Start tracking!</p></Card>}
            {financeLog.map(entry => (
              <Card key={entry.id} className="flex items-center gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${entry.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  {entry.type === 'income' ? <TrendingUp size={18} className="text-green-600" /> : <TrendingDown size={18} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm text-text-dark dark:text-text-light truncate">{entry.description || entry.category}</h3>
                    <Badge color={entry.type === 'income' ? 'green' : 'red'}>{entry.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-sm font-mono ${entry.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatIDR(entry.amount)}
                  </p>
                </div>
                <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Log Exercise Modal */}
      <Modal isOpen={showExerciseModal} onClose={() => setShowExerciseModal(false)} title="Log Exercise" size="sm">
        <form onSubmit={handleExerciseSubmit} className="space-y-4">
          <Input label="Date" type="date" value={exerciseForm.date} onChange={e => setExerciseField('date', e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">💧 Water Intake: {exerciseForm.water} cups</label>
            <input type="range" min="0" max="20" value={exerciseForm.water} onChange={e => setExerciseField('water', Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400"><span>0</span><span>20 cups</span></div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">🏃 Exercise: {exerciseForm.exercise} min</label>
            <input type="range" min="0" max="180" step="5" value={exerciseForm.exercise} onChange={e => setExerciseField('exercise', Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400"><span>0</span><span>180 min</span></div>
          </div>
          <Input label="Weight (kg, optional)" type="number" step="0.1" placeholder="e.g. 65.5" value={exerciseForm.weight} onChange={e => setExerciseField('weight', e.target.value)} />
          <Input label="Notes (optional)" placeholder="How do you feel?" value={exerciseForm.notes} onChange={e => setExerciseField('notes', e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowExerciseModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log Exercise</Button>
          </div>
        </form>
      </Modal>

      {/* Log Finance Modal */}
      <Modal isOpen={showFinanceModal} onClose={() => { setShowFinanceModal(false); setFinanceErrors({}); }} title="Log Finance" size="sm">
        <form onSubmit={handleFinanceSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button key={t} type="button" onClick={() => {
                setFinanceField('type', t);
                setFinanceField('category', t === 'income' ? 'Salary' : 'Food');
              }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all border-2 ${financeForm.type === t ? (t === 'income' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400') : 'border-gray-100 dark:border-white/10 text-gray-500 hover:border-gray-200'}`}>
                {t === 'income' ? '📈' : '📉'} {t}
              </button>
            ))}
          </div>
          <Input label="Amount (Rp)" type="number" step="1" placeholder="0" value={financeForm.amount} onChange={e => setFinanceField('amount', e.target.value)} error={financeErrors.amount} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
            <select value={financeForm.category} onChange={e => setFinanceField('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 text-text-dark dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {(financeForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input label="Description (optional)" placeholder="e.g. Lunch at cafe" value={financeForm.description} onChange={e => setFinanceField('description', e.target.value)} />
          <Input label="Date" type="date" value={financeForm.date} onChange={e => setFinanceField('date', e.target.value)} error={financeErrors.date} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowFinanceModal(false); setFinanceErrors({}); }} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Log {financeForm.type === 'income' ? 'Income' : 'Expense'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Entry" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Delete this entry? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default MYTrace;
