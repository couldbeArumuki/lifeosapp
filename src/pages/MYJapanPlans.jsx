import { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Search, CheckCircle2, Circle, Clock,
  Flag, Calendar, FileText, ChevronDown, ChevronUp, BookOpen,
  Headphones, Mic, Eye, PenLine, Star, Filter, RotateCcw,
  TrendingUp, Award, Target, Layers
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const STORAGE_KEY = 'japanPlans';

const CATEGORIES = ['Foundation', 'N5', 'N4', 'N3', 'N2', 'N1', 'Skills'];
const SUBCATEGORIES = ['Hiragana/Katakana', 'Kanji', 'Vocabulary', 'Grammar', 'Listening', 'Speaking', 'Reading', 'Writing', 'Culture', 'Pronunciation', 'Other'];
const STATUSES = ['not-started', 'in-progress', 'completed'];
const PRIORITIES = ['high', 'medium', 'low'];

const categoryMeta = {
  Foundation: { color: 'pink', emoji: '🌱', label: 'Foundation', desc: 'Hiragana, Katakana & Basics' },
  N5: { color: 'green', emoji: '🟢', label: 'JLPT N5', desc: '~800 words · ~100 kanji' },
  N4: { color: 'blue', emoji: '🔵', label: 'JLPT N4', desc: '~1,500 words · ~300 kanji' },
  N3: { color: 'yellow', emoji: '🟡', label: 'JLPT N3', desc: '~3,750 words · ~650 kanji' },
  N2: { color: 'purple', emoji: '🟣', label: 'JLPT N2', desc: '~6,000 words · ~1,000 kanji' },
  N1: { color: 'red', emoji: '🔴', label: 'JLPT N1', desc: '~10,000+ words · ~2,000 kanji' },
  Skills: { color: 'blue', emoji: '⚡', label: 'Skills Practice', desc: 'Listening, Speaking, Reading, Writing' },
};

const subcategoryIcons = {
  'Hiragana/Katakana': BookOpen,
  Kanji: BookOpen,
  Vocabulary: Layers,
  Grammar: FileText,
  Listening: Headphones,
  Speaking: Mic,
  Reading: Eye,
  Writing: PenLine,
  Culture: Star,
  Pronunciation: Mic,
  Other: Target,
};

const priorityMeta = {
  high: { color: 'red', label: '🔴 High' },
  medium: { color: 'yellow', label: '🟡 Medium' },
  low: { color: 'green', label: '🟢 Low' },
};

const DEFAULT_ITEMS = [
  // Foundation
  { id: 1, category: 'Foundation', subcategory: 'Hiragana/Katakana', title: 'Master Hiragana (46 characters)', description: 'Learn all 46 basic hiragana characters and be able to read/write them fluently. Use mnemonics from Tofugu\'s Hiragana guide.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.tofugu.com/japanese/learn-hiragana/', createdAt: Date.now() },
  { id: 2, category: 'Foundation', subcategory: 'Hiragana/Katakana', title: 'Master Katakana (46 characters)', description: 'Learn all 46 basic katakana characters. Katakana is used for foreign words, loanwords, and emphasis.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.tofugu.com/japanese/learn-katakana/', createdAt: Date.now() },
  { id: 3, category: 'Foundation', subcategory: 'Pronunciation', title: 'Japanese Pronunciation Basics', description: 'Understand pitch accent basics, vowel sounds (a, i, u, e, o), and common pronunciation rules. Practice with native audio.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.tofugu.com/japanese/japanese-pronunciation/', createdAt: Date.now() },
  { id: 4, category: 'Foundation', subcategory: 'Vocabulary', title: 'Japanese Numbers (1–10,000)', description: 'Learn counting in Japanese: 一 (ichi), 二 (ni), 三 (san)... including 百 (hundred) and 千 (thousand). Essential for daily life.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.tofugu.com/japanese/japanese-numbers/', createdAt: Date.now() },
  { id: 5, category: 'Foundation', subcategory: 'Culture', title: 'Japanese Honorifics & Keigo Intro', description: 'Understand -san, -kun, -chan, -sensei. Learn the concept of formal (keigo) vs. casual speech levels.', status: 'not-started', priority: 'low', dueDate: '', notes: '', resource: 'https://www.tofugu.com/japanese/japanese-honorifics/', createdAt: Date.now() },

  // N5
  { id: 10, category: 'N5', subcategory: 'Kanji', title: 'Learn 100 N5 Kanji', description: 'Study the 100 most essential kanji for JLPT N5. Includes: 日 月 火 水 木 金 土 人 口 手 目 山 川 田 大 小 中 上 下 本 etc.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.wanikani.com/', createdAt: Date.now() },
  { id: 11, category: 'N5', subcategory: 'Vocabulary', title: 'Build 800-Word N5 Vocabulary', description: 'Acquire ~800 core Japanese words for JLPT N5. Use Anki or WaniKani. Covers: family, body, daily objects, time, weather, food.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jisho.org/', createdAt: Date.now() },
  { id: 12, category: 'N5', subcategory: 'Grammar', title: 'N5 Grammar Patterns (~30)', description: 'Master ~30 fundamental grammar patterns: は/が/を particles, です/ます forms, て-form, ない-form, たい, から/ので.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jlptstudy.net/N5/', createdAt: Date.now() },
  { id: 13, category: 'N5', subcategory: 'Reading', title: 'N5 Reading Practice', description: 'Read simple hiragana/katakana texts, greetings, signs, and basic sentences. Practice NHK Web Easy beginner articles.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www3.nhk.or.jp/news/easy/', createdAt: Date.now() },
  { id: 14, category: 'N5', subcategory: 'Listening', title: 'N5 Listening Comprehension', description: 'Understand slow, clear Japanese speech. Practice JLPT N5 listening sample tests and simple anime like Doraemon.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.jlpt.jp/e/samples/forlearners.html', createdAt: Date.now() },
  { id: 15, category: 'N5', subcategory: 'Writing', title: 'Practice Writing N5 Kanji', description: 'Write all 100 N5 kanji by hand multiple times. Focus on stroke order (use KanjiStudy or Jisho). Build muscle memory.', status: 'not-started', priority: 'low', dueDate: '', notes: '', resource: 'https://jisho.org/', createdAt: Date.now() },
  { id: 16, category: 'N5', subcategory: 'Speaking', title: 'Basic N5 Conversations', description: 'Practice self-introduction (じこしょうかい), greetings, asking for directions, ordering food. Use HelloTalk or Tandem.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.hellotalk.com/', createdAt: Date.now() },

  // N4
  { id: 20, category: 'N4', subcategory: 'Kanji', title: 'Learn 300 N4 Kanji', description: 'Expand kanji knowledge to ~300 characters (cumulative). N4 adds: 会 社 員 学 校 先 生 言 語 食 飲 来 行 見 etc.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.wanikani.com/', createdAt: Date.now() },
  { id: 21, category: 'N4', subcategory: 'Vocabulary', title: 'Build 1,500-Word N4 Vocabulary', description: 'Acquire ~1,500 total words for JLPT N4. Includes verbs, adjectives, adverbs, and compound words in everyday contexts.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jisho.org/', createdAt: Date.now() },
  { id: 22, category: 'N4', subcategory: 'Grammar', title: 'N4 Grammar Patterns (~60)', description: 'Learn ~60 grammar patterns: て-form connections, conditional (~たら/~ば/~と), causative, passive, potential forms, giving/receiving (あげる/もらう/くれる).', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jlptstudy.net/N4/', createdAt: Date.now() },
  { id: 23, category: 'N4', subcategory: 'Reading', title: 'N4 Reading — Simple Texts', description: 'Read short paragraphs about daily life topics. Practice NHK Web Easy articles and level 1–2 graded readers.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www3.nhk.or.jp/news/easy/', createdAt: Date.now() },
  { id: 24, category: 'N4', subcategory: 'Listening', title: 'N4 Listening — Conversations', description: 'Understand natural-pace conversations about familiar topics. Watch slice-of-life anime with Japanese subtitles.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.youtube.com/c/JapanesePod101', createdAt: Date.now() },

  // N3
  { id: 30, category: 'N3', subcategory: 'Kanji', title: 'Learn 650 N3 Kanji', description: 'Master ~650 total kanji. N3 introduces more complex characters used in newspapers, official documents, and literature.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.wanikani.com/', createdAt: Date.now() },
  { id: 31, category: 'N3', subcategory: 'Vocabulary', title: 'Build 3,750-Word N3 Vocabulary', description: 'Acquire ~3,750 total words. N3 emphasizes abstract nouns, formal expressions, and compound verbs (複合動詞).', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jisho.org/', createdAt: Date.now() },
  { id: 32, category: 'N3', subcategory: 'Grammar', title: 'N3 Grammar Patterns (~120)', description: 'Learn complex grammar: ～によって, ～に対して, ～わけ, ～からには, ～に違いない, ～ことにする, ～ようになる, compound particles.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jlptstudy.net/N3/', createdAt: Date.now() },
  { id: 33, category: 'N3', subcategory: 'Reading', title: 'N3 Reading — Newspaper & Stories', description: 'Read NHK Easy News daily, level 3–4 graded readers, simple manga (Yotsuba&! recommended). Aim for 10 min/day.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www3.nhk.or.jp/news/easy/', createdAt: Date.now() },
  { id: 34, category: 'N3', subcategory: 'Listening', title: 'N3 Listening — TV & Podcasts', description: 'Understand semi-fast Japanese speech with context clues. Listen to Nihongo con Teppei podcast (beginner version).', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://nihongoconteppei.com/', createdAt: Date.now() },
  { id: 35, category: 'N3', subcategory: 'Speaking', title: 'N3 Speaking — Express Opinions', description: 'Practice expressing opinions (～と思います), describing experiences, giving advice. Use conversation partners online.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.tandem.net/', createdAt: Date.now() },

  // N2
  { id: 40, category: 'N2', subcategory: 'Kanji', title: 'Learn 1,000 N2 Kanji', description: 'Master ~1,000 total kanji. N2 kanji appear in business, academic texts, and advanced media.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.wanikani.com/', createdAt: Date.now() },
  { id: 41, category: 'N2', subcategory: 'Vocabulary', title: 'Build 6,000-Word N2 Vocabulary', description: 'Acquire ~6,000 total words. Includes 四字熟語 (four-character idioms), formal vocabulary, academic and business terms.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jisho.org/', createdAt: Date.now() },
  { id: 42, category: 'N2', subcategory: 'Grammar', title: 'N2 Grammar Patterns (~200)', description: 'Learn advanced grammar: ～にかかわらず, ～をもとに, ～にしたがって, ～ばかりか, ～に加えて, nuanced expressions and formal structures.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jlptstudy.net/N2/', createdAt: Date.now() },
  { id: 43, category: 'N2', subcategory: 'Reading', title: 'N2 Reading — Full Articles & Essays', description: 'Read full newspaper articles, editorial columns, academic essays. Use Asahi Shimbun\'s easy version as practice.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://asahi.com/', createdAt: Date.now() },
  { id: 44, category: 'N2', subcategory: 'Listening', title: 'N2 Listening — News & Lectures', description: 'Understand natural-speed NHK news, university lectures, and discussions. Watch drama without subtitles.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www3.nhk.or.jp/news/', createdAt: Date.now() },
  { id: 45, category: 'N2', subcategory: 'Writing', title: 'N2 Writing — Formal Composition', description: 'Practice writing formal emails, short essays (200–400 characters), opinion pieces in keigo and neutral register.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: '', createdAt: Date.now() },

  // N1
  { id: 50, category: 'N1', subcategory: 'Kanji', title: 'Learn 2,000 N1 Kanji', description: 'Master ~2,000 total kanji (full Joyo kanji set plus additional). Read any authentic Japanese text fluently.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.wanikani.com/', createdAt: Date.now() },
  { id: 51, category: 'N1', subcategory: 'Vocabulary', title: 'Build 10,000+ N1 Vocabulary', description: 'Acquire 10,000+ words including rare vocabulary, literary terms, classical Japanese (古文) basics, and technical terms.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jisho.org/', createdAt: Date.now() },
  { id: 52, category: 'N1', subcategory: 'Grammar', title: 'N1 Grammar — Advanced & Literary', description: 'Master ~300+ grammar points including classical forms, nuanced expressions, and formal/literary structures rarely seen at lower levels.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://jlptstudy.net/N1/', createdAt: Date.now() },
  { id: 53, category: 'N1', subcategory: 'Reading', title: 'N1 Reading — Native Literature', description: 'Read novels by Japanese authors (e.g. 村上春樹), opinion columns, legal/government documents. Aim for 30+ min/day.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: '', createdAt: Date.now() },
  { id: 54, category: 'N1', subcategory: 'Listening', title: 'N1 Listening — Native Speed & Dialects', description: 'Understand rapid speech, regional dialects (Kansai-ben, etc.), humor, implications. Watch variety shows without subtitles.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: '', createdAt: Date.now() },
  { id: 55, category: 'N1', subcategory: 'Speaking', title: 'N1 Speaking — Nuanced Expression', description: 'Express nuanced opinions, use appropriate keigo in business contexts, discuss abstract topics fluently.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: '', createdAt: Date.now() },

  // Skills
  { id: 60, category: 'Skills', subcategory: 'Listening', title: 'Daily Listening Immersion (15 min/day)', description: 'Listen to Japanese every day: podcasts (Nihongo con Teppei, JapanesePod101), anime, YouTube channels, J-Pop. Build a habit.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://nihongoconteppei.com/', createdAt: Date.now() },
  { id: 61, category: 'Skills', subcategory: 'Speaking', title: 'Shadowing Practice (10 min/day)', description: 'Shadow native audio by repeating immediately after hearing. Use Shadowing: Let\'s Speak Japanese textbook or YouTube clips.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://www.youtube.com/c/JapanesePod101', createdAt: Date.now() },
  { id: 62, category: 'Skills', subcategory: 'Reading', title: 'Extensive Reading (Tadoku)', description: 'Read Japanese above your level daily. Use Level 0–5 graded readers from tadoku.org or simple manga (よつばと！).', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://tadoku.org/japanese/', createdAt: Date.now() },
  { id: 63, category: 'Skills', subcategory: 'Writing', title: 'Daily Writing Practice (Journaling)', description: 'Keep a Japanese journal (lang-8 or HiNative). Write 3–5 sentences per day. Get corrections from native speakers.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://hinative.com/', createdAt: Date.now() },
  { id: 64, category: 'Skills', subcategory: 'Speaking', title: 'Find a Language Exchange Partner', description: 'Connect with native Japanese speakers via HelloTalk, Tandem, or iTalki. Aim for 1–2 sessions/week.', status: 'not-started', priority: 'medium', dueDate: '', notes: '', resource: 'https://www.hellotalk.com/', createdAt: Date.now() },
  { id: 65, category: 'Skills', subcategory: 'Vocabulary', title: 'Anki SRS — Daily Reviews (30 cards/day)', description: 'Use spaced-repetition (SRS) with Anki to retain vocabulary long-term. Download the Core 2k/6k or JLPT deck. 30 cards/day minimum.', status: 'not-started', priority: 'high', dueDate: '', notes: '', resource: 'https://apps.ankiweb.net/', createdAt: Date.now() },
  { id: 66, category: 'Skills', subcategory: 'Culture', title: 'Study Japanese Culture & Context', description: 'Understand cultural nuances: Tatemae vs. Honne, gift-giving customs, seasonal words (季語), anime/manga cultural references.', status: 'not-started', priority: 'low', dueDate: '', notes: '', resource: 'https://www.tofugu.com/japan/', createdAt: Date.now() },
];

const defaultForm = {
  category: 'Foundation',
  subcategory: 'Other',
  title: '',
  description: '',
  status: 'not-started',
  priority: 'medium',
  dueDate: '',
  notes: '',
  resource: '',
};

const StatusIcon = ({ status, size = 16 }) => {
  if (status === 'completed') return <CheckCircle2 size={size} className="text-green-500 dark:text-green-400 flex-shrink-0" />;
  if (status === 'in-progress') return <Clock size={size} className="text-yellow-500 dark:text-yellow-400 flex-shrink-0" />;
  return <Circle size={size} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />;
};

const ProgressBar = ({ value, color = 'primary' }) => (
  <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-500 ${color === 'green' ? 'bg-accent' : color === 'yellow' ? 'bg-yellow-400' : color === 'red' ? 'bg-red-400' : color === 'purple' ? 'bg-secondary' : 'bg-gradient-to-r from-primary to-secondary'}`}
      style={{ width: `${value}%` }}
    />
  </div>
);

const MYJapanPlans = () => {
  const [plans, setPlans] = useState(() => {
    const saved = getData(STORAGE_KEY, null);
    return saved !== null ? saved : DEFAULT_ITEMS;
  });
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setPlans(updated); saveData(STORAGE_KEY, updated); };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(defaultForm);
    setEditId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      category: item.category,
      subcategory: item.subcategory,
      title: item.title,
      description: item.description || '',
      status: item.status,
      priority: item.priority,
      dueDate: item.dueDate || '',
      notes: item.notes || '',
      resource: item.resource || '',
    });
    setEditId(item.id);
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId !== null) {
      const updated = plans.map(p =>
        p.id === editId ? { ...p, ...form, title: form.title.trim() } : p
      );
      persist(updated);
      addToast('Plan item updated!', 'success');
    } else {
      const newItem = { id: Date.now(), ...form, title: form.title.trim(), createdAt: Date.now() };
      persist([...plans, newItem]);
      addToast('Plan item added!', 'success');
    }
    setShowModal(false);
    setEditId(null);
  };

  const handleDelete = () => {
    persist(plans.filter(p => p.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Plan item deleted.', 'info');
  };

  const cycleStatus = (id) => {
    const updated = plans.map(p => {
      if (p.id !== id) return p;
      const next = { 'not-started': 'in-progress', 'in-progress': 'completed', 'completed': 'not-started' };
      return { ...p, status: next[p.status] };
    });
    persist(updated);
  };

  const resetToDefaults = () => {
    persist(DEFAULT_ITEMS);
    addToast('Plans reset to defaults.', 'info');
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const overallStats = useMemo(() => {
    const total = plans.length;
    const completed = plans.filter(p => p.status === 'completed').length;
    const inProgress = plans.filter(p => p.status === 'in-progress').length;
    const notStarted = plans.filter(p => p.status === 'not-started').length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, notStarted, pct };
  }, [plans]);

  const categoryStats = useMemo(() =>
    CATEGORIES.map(cat => {
      const items = plans.filter(p => p.category === cat);
      const done = items.filter(p => p.status === 'completed').length;
      const pct = items.length ? Math.round((done / items.length) * 100) : 0;
      return { cat, total: items.length, done, pct };
    }), [plans]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return plans.filter(p => {
      const matchTab = activeTab === 'All' || p.category === activeTab;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchPriority = filterPriority === 'all' || p.priority === filterPriority;
      return matchTab && matchSearch && matchStatus && matchPriority;
    });
  }, [plans, activeTab, search, filterStatus, filterPriority]);

  const tabs = ['All', ...CATEGORIES];

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light flex items-center gap-2">
            🇯🇵 MYJapan Plans
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Your Japanese learning roadmap · {overallStats.completed}/{overallStats.total} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            title="Reset to default plan items"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
          <Button variant="primary" onClick={openAdd}>
            <Plus size={16} /> Add Item
          </Button>
        </div>
      </div>

      {/* ── Overall Progress ────────────────────────────────────────────── */}
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-dark dark:text-text-light">Overall Progress</span>
              <span className="text-2xl font-bold font-mono text-primary">{overallStats.pct}%</span>
            </div>
            <ProgressBar value={overallStats.pct} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Completed', value: overallStats.completed, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'In Progress', value: overallStats.inProgress, icon: Clock, color: 'text-yellow-500' },
            { label: 'Not Started', value: overallStats.notStarted, icon: Circle, color: 'text-gray-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5">
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <p className="text-xl font-bold font-mono text-text-dark dark:text-text-light">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Category Overview Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categoryStats.map(({ cat, total, done, pct }) => {
          const meta = categoryMeta[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-left p-3 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                activeTab === cat
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{meta.emoji}</span>
                <Badge color={meta.color}>{pct}%</Badge>
              </div>
              <p className="text-xs font-semibold text-text-dark dark:text-text-light truncate">{meta.label}</p>
              <p className="text-xs text-gray-400 mb-2">{done}/{total} done</p>
              <ProgressBar value={pct} color={meta.color} />
            </button>
          );
        })}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            {tab === 'All' ? 'All' : (categoryMeta[tab]?.emoji + ' ' + tab)}
          </button>
        ))}
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search plans..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`p-2.5 rounded-xl border text-sm transition-all ${
            showFilters || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <Filter size={16} />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="rounded-xl px-3 py-1.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority</label>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="rounded-xl px-3 py-1.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          {(filterStatus !== 'all' || filterPriority !== 'all') && (
            <div className="flex items-end">
              <button
                onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }}
                className="px-3 py-1.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Results Count ───────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 -mt-2">
        Showing {filtered.length} of {plans.length} items
        {activeTab !== 'All' && ` in ${categoryMeta[activeTab]?.label || activeTab}`}
      </p>

      {/* ── Plan Items ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card>
            <div className="text-center py-10">
              <Award size={40} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
              <p className="text-gray-400 font-medium">No plan items found</p>
              <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">Try adjusting your filters or add a new item</p>
            </div>
          </Card>
        )}

        {filtered.map(item => {
          const meta = categoryMeta[item.category] || categoryMeta.Foundation;
          const SubIcon = subcategoryIcons[item.subcategory] || Target;
          const isExpanded = expandedId === item.id;
          const statusLabel = item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Not Started';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white dark:bg-gray-900 transition-all duration-200 hover:shadow-md ${
                item.status === 'completed'
                  ? 'border-green-100 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/10'
                  : item.status === 'in-progress'
                    ? 'border-yellow-100 dark:border-yellow-900/30'
                    : 'border-gray-100 dark:border-white/10'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Status toggle button */}
                  <button
                    onClick={() => cycleStatus(item.id)}
                    title={`Status: ${statusLabel} (click to cycle)`}
                    className="mt-0.5 transition-transform hover:scale-110"
                  >
                    <StatusIcon status={item.status} size={20} />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-sm leading-snug ${item.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-text-dark dark:text-text-light'}`}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex items-center flex-wrap gap-1.5 mt-2">
                      <Badge color={meta.color}>{meta.label}</Badge>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                        <SubIcon size={10} />
                        {item.subcategory}
                      </span>
                      <Badge color={priorityMeta[item.priority]?.color || 'gray'}>
                        {priorityMeta[item.priority]?.label || item.priority}
                      </Badge>
                      {item.dueDate && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-gray-400">
                          <Calendar size={10} />
                          {item.dueDate}
                        </span>
                      )}
                    </div>

                    {/* Expand button */}
                    {(item.description || item.notes || item.resource) && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="flex items-center gap-1 mt-2 text-xs text-gray-400 hover:text-primary transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {isExpanded ? 'Less' : 'More'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-3 ml-8 space-y-2 animate-fade-in">
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                    )}
                    {item.notes && (
                      <div className="p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20">
                        <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-0.5 flex items-center gap-1"><FileText size={11} /> Notes</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-300">{item.notes}</p>
                      </div>
                    )}
                    {item.resource && (
                      <a
                        href={item.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <BookOpen size={11} /> Resource →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId !== null ? 'Edit Plan Item' : 'Add Plan Item'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Learn 100 N5 Kanji"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            error={errors.title}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
              <select
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{categoryMeta[c]?.emoji} {categoryMeta[c]?.label || c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Subcategory</label>
              <select
                value={form.subcategory}
                onChange={e => setField('subcategory', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {SUBCATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Description <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              rows={2}
              placeholder="Brief description of this learning task..."
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
              <select
                value={form.status}
                onChange={e => setField('status', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="not-started">⚪ Not Started</option>
                <option value="in-progress">🟡 In Progress</option>
                <option value="completed">🟢 Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Priority</label>
              <select
                value={form.priority}
                onChange={e => setField('priority', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Due Date (optional)"
              type="date"
              value={form.dueDate}
              onChange={e => setField('dueDate', e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Resource URL <span className="font-normal text-gray-400">(optional)</span></label>
              <input
                type="url"
                placeholder="https://..."
                value={form.resource}
                onChange={e => setField('resource', e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Notes <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              rows={3}
              placeholder="Personal notes, tips, progress details..."
              value={form.notes}
              onChange={e => setField('notes', e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">{editId !== null ? 'Save Changes' : 'Add Item'}</Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation ──────────────────────────────────────────── */}
      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Delete Plan Item" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Delete this plan item? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Delete</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default MYJapanPlans;
