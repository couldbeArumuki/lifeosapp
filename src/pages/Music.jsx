import { useState } from 'react';
import { Plus, Trash2, Music2, Disc3, Star } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getData, saveData } from '../utils/localStorage';

const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Indie', 'Metal', 'Folk', 'Other'];
const genreColor = { Pop: 'pink', Rock: 'red', 'Hip-Hop': 'purple', 'R&B': 'blue', Jazz: 'amber', Classical: 'gray', Electronic: 'teal', Indie: 'green', Metal: 'gray', Folk: 'amber', Other: 'gray' };

const defaultForm = { title: '', artist: '', coverUrl: '', genre: 'Pop', description: '', rating: 5 };

const AlbumCover = ({ url, title, artist }) => {
  const [imgError, setImgError] = useState(false);
  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={`${title} by ${artist}`}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      <Disc3 size={48} className="text-primary/60" />
    </div>
  );
};

const Music = () => {
  const [albums, setAlbums] = useState(() => getData('musicAlbums', []));
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const persist = (updated) => { setAlbums(updated); saveData('musicAlbums', updated); };

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Album title is required';
    if (!form.artist.trim()) e.artist = 'Artist name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const entry = {
      id: Date.now(),
      title: form.title.trim(),
      artist: form.artist.trim(),
      coverUrl: form.coverUrl.trim(),
      genre: form.genre,
      description: form.description.trim(),
      rating: form.rating,
    };
    persist([...albums, entry]);
    addToast('Album added! 🎵', 'success');
    setShowModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const handleDelete = () => {
    persist(albums.filter(a => a.id !== deleteConfirm));
    setDeleteConfirm(null);
    addToast('Album removed.', 'info');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light flex items-center gap-2">
            <Music2 size={24} className="text-primary" />
            My Music
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Albums that define my taste 🎶</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setErrors({}); setShowModal(true); }} className="flex-shrink-0">
          <Plus size={16} /> Add Album
        </Button>
      </div>

      {/* Stats row */}
      {albums.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Albums', value: albums.length, color: 'text-primary' },
            { label: 'Artists', value: new Set(albums.map(a => a.artist)).size, color: 'text-secondary' },
            { label: 'Avg Rating', value: `${(albums.reduce((s, a) => s + a.rating, 0) / albums.length).toFixed(1)} ★`, color: 'text-accent' },
          ].map(stat => (
            <Card key={stat.label} className="text-center py-4">
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Albums grid */}
      {albums.length === 0 ? (
        <Card className="text-center py-16">
          <Disc3 size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-text-dark dark:text-text-light mb-1">No albums yet</h3>
          <p className="text-gray-400 text-sm mb-4">Start adding your favorite albums to showcase your music taste!</p>
          <Button onClick={() => { setForm(defaultForm); setErrors({}); setShowModal(true); }}>
            <Plus size={16} /> Add First Album
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map(album => (
            <Card key={album.id} className="group p-0 overflow-hidden card-hover">
              {/* Cover */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                <AlbumCover url={album.coverUrl} title={album.title} artist={album.artist} />
                <button
                  onClick={() => setDeleteConfirm(album.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  aria-label="Remove album"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-text-dark dark:text-text-light text-sm leading-tight line-clamp-2">{album.title}</h3>
                  <Badge color={genreColor[album.genre] || 'gray'} className="flex-shrink-0 text-xs">{album.genre}</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{album.artist}</p>
                {album.description && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{album.description}</p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < album.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">{album.rating}/5</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Album Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Favorite Album">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Album Title *"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="e.g. Thriller"
            error={errors.title}
          />
          <Input
            label="Artist / Band *"
            value={form.artist}
            onChange={e => setField('artist', e.target.value)}
            placeholder="e.g. Michael Jackson"
            error={errors.artist}
          />
          <Input
            label="Cover Image URL"
            value={form.coverUrl}
            onChange={e => setField('coverUrl', e.target.value)}
            placeholder="https://..."
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
            <select
              value={form.genre}
              onChange={e => setField('genre', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating: {form.rating} / 5</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={form.rating}
              onChange={e => setField('rating', Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400"><span>1</span><span>5</span></div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Why I love it</label>
            <textarea
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="What makes this album special to you..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Add Album</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Remove Album">
        <p className="text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to remove this album from your collection?</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
          <Button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600">Remove</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Music;
