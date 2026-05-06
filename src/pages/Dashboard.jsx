import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Users, BookOpen, Hash } from 'lucide-react';

const COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

function ClassCard({ cls, index }) {
  return (
    <Link to={`/class/${cls._id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      <div className={`${COLORS[index % COLORS.length]} h-24 p-4 flex flex-col justify-between`}>
        <h3 className="text-white font-bold text-lg leading-tight">{cls.name}</h3>
        {cls.subject && <p className="text-white/80 text-sm">{cls.subject}</p>}
      </div>
      <div className="p-4 flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1"><Users size={14} /> {cls.students?.length || 0} students</span>
        <span className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded"><Hash size={12} />{cls.code}</span>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', subject: '' });
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes');
      setClasses(data);
    } catch { toast.error('Failed to load classes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/classes', createForm);
      setClasses(prev => [data, ...prev]);
      setShowCreate(false);
      setCreateForm({ name: '', subject: '' });
      toast.success('Class created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    } finally { setSubmitting(false); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/classes/join', { code: joinCode });
      toast.success('Joined class!');
      setShowJoin(false);
      setJoinCode('');
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join class');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name}</p>
        </div>
        {user.role === 'teacher' ? (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <Plus size={18} /> New Class
          </button>
        ) : (
          <button onClick={() => setShowJoin(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
            <Plus size={18} /> Join Class
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No classes yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {user.role === 'teacher' ? 'Create your first class to get started' : 'Join a class using a class code'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, i) => <ClassCard key={cls._id} cls={cls} index={i} />)}
        </div>
      )}

      {/* Create Class Modal */}
      {showCreate && (
        <Modal title="Create Class" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Class Name *" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Mathematics 101" required />
            <Input label="Subject" value={createForm.subject} onChange={e => setCreateForm({ ...createForm, subject: e.target.value })} placeholder="e.g. Algebra" />
            <ModalActions onCancel={() => setShowCreate(false)} loading={submitting} label="Create Class" />
          </form>
        </Modal>
      )}

      {/* Join Class Modal */}
      {showJoin && (
        <Modal title="Join a Class" onClose={() => setShowJoin(false)}>
          <form onSubmit={handleJoin} className="space-y-4">
            <Input label="Class Code *" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. AB12XYZ" required />
            <ModalActions onCancel={() => setShowJoin(false)} loading={submitting} label="Join Class" />
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" {...props} />
    </div>
  );
}

function ModalActions({ onCancel, loading, label }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition">Cancel</button>
      <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60">
        {loading ? 'Please wait...' : label}
      </button>
    </div>
  );
}
