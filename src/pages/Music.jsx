import { useState } from 'react';
import { Plus, Trash2, Music2, Pencil } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const STORAGE_KEY = 'music_albums';

const GENRES = ['Pop', 'Rock', 'R&B', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Indie', 'Alternative', 'Other'];

const defaultForm = {
  title: '',
  artist: '',
  year: '',
  genre: 'Pop',
  description: '',
  coverUrl: '',
  rating: 5,
};

const defaultAlbums = [
  {
    id: 1,
    title: 'Thriller',
    artist: 'Michael Jackson',
    year: '1982',
    genre: 'Pop',
    description: 'One of the best-selling albums of all time, featuring iconic tracks like Thriller, Billie Jean, and Beat It.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png',
    rating: 5,
  },
  {
    id: 2,
    title: 'DAMN.',
    artist: 'Kendrick Lamar',
    year: '2017',
    genre: 'Hip-Hop',
    description: 'A Pulitzer Prize-winning album that blends introspective lyricism with infectious beats.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/Kendrick_Lamar_-_Damn.png',
    rating: 5,
  },
  {
    id: 3,
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    year: '2013',
    genre: 'Electronic',
    description: 'A love letter to analogue recording and the music of the past, featuring the massive hit Get Lucky.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg',
    rating: 5,
  },
];

const StarRating = ({ value, onChange, readOnly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      readOnly ? (
        <span
          key={star}
          className={`text-xl leading-none ${star <= value ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
        >
          ★
        </span>
      ) : (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
        >
          ★
        </button>
      )
    ))}
  </div>
);

const Music = () => {
  const [albums, setAlbums] = useState(() => getData(STORAGE_KEY, defaultAlbums));
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setAlbums(updated); saveData(STORAGE_KEY, updated); };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (album) => {
    setEditId(album.id);
    setForm({
      title: album.title,
      artist: album.artist,
      year: album.year,
      genre: album.genre,
      description: album.description,
      coverUrl: album.coverUrl,
      rating: album.rating,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim()) return;
    if (editId) {
      const trimmed = { title: form.title.trim(), artist: form.artist.trim(), description: form.description.trim() };
      persist(albums.map(a => a.id === editId ? { ...a, ...form, ...trimmed } : a));
      addToast('Album updated!', 'success');
    } else {
      const entry = { id: Date.now(), ...form, title: form.title.trim(), artist: form.artist.trim(), description: form.description.trim() };
      persist([entry, ...albums]);
      addToast('Album added!', 'success');
    }
    setShowModal(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleDelete = () => {
    persist(albums.filter(a => a.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Album removed.', 'info');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Music</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Favorite albums &amp; music taste 🎵</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={16} /> Add Album
        </Button>
      </div>

      {albums.length === 0 ? (
        <Card className="text-center py-16">
          <Music2 size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-400">No albums yet. Add your first favorite!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map(album => (
            <Card key={album.id} className="group flex flex-col gap-3 card-hover">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                {!imgErrors[album.id] && album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={`${album.title} cover`}
                    className="w-full h-full object-cover"
                    onError={() => setImgErrors(prev => ({ ...prev, [album.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 size={48} className="text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(album)}
                    className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors shadow-sm"
                    aria-label="Edit album"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(album.id)}
                    className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                    aria-label="Delete album"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-semibold text-text-dark dark:text-text-light leading-tight">{album.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{album.artist} · {album.year}</p>
                  </div>
                  <Badge color="blue" className="flex-shrink-0">{album.genre}</Badge>
                </div>
                {album.description && (
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{album.description}</p>
                )}
                <StarRating value={album.rating} readOnly />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditId(null); }} title={editId ? 'Edit Album' : 'Add Album'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Album Title *" placeholder="e.g. Thriller" value={form.title} onChange={e => setField('title', e.target.value)} required />
          <Input label="Artist *" placeholder="e.g. Michael Jackson" value={form.artist} onChange={e => setField('artist', e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Year" placeholder="e.g. 1982" value={form.year} onChange={e => setField('year', e.target.value)} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Genre</label>
              <select
                value={form.genre}
                onChange={e => setField('genre', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 text-text-dark dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <Input label="Cover Image URL (optional)" placeholder="https://..." value={form.coverUrl} onChange={e => setField('coverUrl', e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Why do you love this album?"
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 text-text-dark dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Rating</label>
            <StarRating value={form.rating} onChange={val => setField('rating', val)} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowModal(false); setEditId(null); }} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 justify-center">{editId ? 'Update' : 'Add Album'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Remove Album" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Remove this album from your collection? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 justify-center">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">Remove</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Music;
