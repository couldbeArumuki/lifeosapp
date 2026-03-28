import { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Health', 'Entertainment', 'Shopping', 'Bills', 'Education', 'Other'];

const categoryColor = {
  Salary: 'green', Freelance: 'blue', Investment: 'purple', Gift: 'pink', Other: 'gray',
  Food: 'yellow', Transport: 'blue', Health: 'green', Entertainment: 'purple',
  Shopping: 'pink', Bills: 'red', Education: 'blue',
};

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const defaultForm = { amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] };

const Finance = () => {
  const [income, setIncome] = useState(() => getData('financeIncome', []));
  const [expenses, setExpenses] = useState(() => getData('financeExpense', []));
  const [tab, setTab] = useState('expense');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ ...defaultForm, category: EXPENSE_CATEGORIES[0] });
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const thisMonth = new Date().toISOString().slice(0, 7);

  const monthIncome = income.filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
  const monthExpense = expenses.filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
  const netBalance = monthIncome - monthExpense;

  const persistIncome = (d) => { setIncome(d); saveData('financeIncome', d); };
  const persistExpense = (d) => { setExpenses(d); saveData('financeExpense', d); };

  const openModal = () => {
    const cats = tab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm({ ...defaultForm, category: cats[0] });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const entry = { id: Date.now(), amount: Number(form.amount), category: form.category, description: form.description.trim(), date: form.date };
    if (tab === 'income') {
      persistIncome([entry, ...income]);
      addToast('Income added!', 'success');
    } else {
      persistExpense([entry, ...expenses]);
      addToast('Expense added!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (tab === 'income') persistIncome(income.filter(e => e.id !== deleteConfirm));
    else persistExpense(expenses.filter(e => e.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Entry deleted.', 'info');
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const currentList = tab === 'income' ? income : expenses;
  const categories = tab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Finance</h1>
          <p className={`text-sm mt-1 font-medium ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Net this month: {fmt(netBalance)}
          </p>
        </div>
        <Button variant="primary" onClick={openModal}><Plus size={16} /> Add {tab === 'income' ? 'Income' : 'Expense'}</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/10 border-0 animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
              <p className="text-lg font-bold font-mono text-green-600 mt-1">{fmt(monthIncome)}</p>
              <p className="text-xs text-gray-400">this month</p>
            </div>
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600">
              <TrendingUp size={18} />
            </div>
          </div>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/10 border-0 animate-slide-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
              <p className="text-lg font-bold font-mono text-red-500 mt-1">{fmt(monthExpense)}</p>
              <p className="text-xs text-gray-400">this month</p>
            </div>
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500">
              <TrendingDown size={18} />
            </div>
          </div>
        </Card>
        <Card className={`border-0 animate-slide-up ${netBalance >= 0 ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-orange-50 dark:bg-orange-900/10'}`} style={{ animationDelay: '160ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
              <p className={`text-lg font-bold font-mono mt-1 ${netBalance >= 0 ? 'text-primary' : 'text-orange-500'}`}>{fmt(netBalance)}</p>
              <p className="text-xs text-gray-400">net balance</p>
            </div>
            <div className={`p-2 rounded-xl ${netBalance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-primary' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'}`}>
              <DollarSign size={18} />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('income')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
          💰 Income
        </button>
        <button onClick={() => setTab('expense')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-white dark:bg-white/5 text-gray-500'}`}>
          💸 Expenses
        </button>
      </div>

      <div className="grid gap-3">
        {currentList.length === 0 && (
          <Card><p className="text-center text-gray-400 py-4">No {tab} entries yet.</p></Card>
        )}
        {currentList.map(entry => (
          <Card key={entry.id} className="flex items-center gap-4 animate-fade-in">
            <div className={`p-3 rounded-xl flex-shrink-0 ${tab === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
              {tab === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-text-dark dark:text-text-light">{fmt(entry.amount)}</span>
                <Badge color={categoryColor[entry.category] || 'gray'}>{entry.category}</Badge>
              </div>
              {entry.description && <p className="text-xs text-gray-400 mt-0.5">{entry.description}</p>}
              <p className="text-xs text-gray-400 mt-0.5">{entry.date}</p>
            </div>
            <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Add ${tab === 'income' ? 'Income' : 'Expense'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Amount (IDR)" type="number" placeholder="e.g. 500000" value={form.amount} onChange={e => setField('amount', e.target.value)} error={errors.amount} min="1" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
            <select value={form.category} onChange={e => setField('category', e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Description (optional)" placeholder="What was this for?" value={form.description} onChange={e => setField('description', e.target.value)} />
          <Input label="Date" type="date" value={form.date} onChange={e => setField('date', e.target.value)} error={errors.date} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">Save</Button>
          </div>
        </form>
      </Modal>

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

export default Finance;
