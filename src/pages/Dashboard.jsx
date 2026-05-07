import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Users, BookOpen, Hash, Sparkles, GraduationCap, X } from 'lucide-react';
import GroqChat from '../components/GroqChat';

const GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-500',
  'from-teal-500 to-cyan-600',
  'from-rose-500 to-pink-600',
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="h-28 shimmer" />
      <div className="p-4 bg-white space-y-2">
        <div className="h-3 shimmer rounded-full w-3/4" />
        <div className="h-3 shimmer rounded-full w-1/2" />
      </div>
    </div>
  );
}

function ClassCard({ cls, index }) {
  return (
    <Link to={`/class/${cls._id}`}
      className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover bg-white animate-fadeInUp"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}>
      <div className={`bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} h-28 p-5 flex flex-col justify-between relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full translate-y-6 -translate-x-4" />
        <h3 className="text-white font-bold text-lg leading-tight relative z-10 drop-shadow">{cls.name}</h3>
        {cls.subject && <p className="text-white/80 text-sm relative z-10">{cls.subject}</p>}
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <Users size={14} className="text-gray-400" />
          <span>{cls.students?.length || 0} students</span>
        </span>
        <span className="flex items-center gap-1 font-mono text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-gray-500">
          <Hash size={11} />{cls.code}
        </span>
      </div>
    </Link>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeInUp" style={{opacity:0}}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-scaleIn" style={{opacity:0}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200 bg-gray-50 hover:bg-white" {...props} />
    </div>
  );
}

function ModalActions({ onCancel, loading, label }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel}
        className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
        Cancel
      </button>
      <button type="submit" disabled={loading}
        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20">
        {loading ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Please wait...</span> : label}
      </button>
    </div>
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
    e.preventDefault(); setSubmitting(true);
    try {
      const { data } = await api.post('/classes', createForm);
      setClasses(prev => [data, ...prev]);
      setShowCreate(false); setCreateForm({ name: '', subject: '' });
      toast.success('Class created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create class'); }
    finally { setSubmitting(false); }
  };

  const handleJoin = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/classes/join', { code: joinCode });
      toast.success('Joined class!');
      setShowJoin(false); setJoinCode(''); fetchClasses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to join class'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 animate-fadeInDown" style={{opacity:0}}>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-black/10 rounded-full translate-y-16" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
          </div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-emerald-200" />
                <span className="text-emerald-200 text-sm font-medium capitalize">{user.role} Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p className="text-white/70 text-sm">
                {classes.length > 0
                  ? `You have ${classes.length} active class${classes.length > 1 ? 'es' : ''}`
                  : user.role === 'teacher' ? 'Create your first class to get started' : 'Join a class using a class code'}
              </p>
            </div>
            {user.role === 'teacher' ? (
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95">
                <Plus size={18} /> New Class
              </button>
            ) : (
              <button onClick={() => setShowJoin(true)}
                className="flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95">
                <Plus size={18} /> Join Class
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Classes', value: classes.length, icon: GraduationCap, color: 'from-emerald-400 to-teal-500' },
          { label: 'Total Students', value: classes.reduce((a, c) => a + (c.students?.length || 0), 0), icon: Users, color: 'from-blue-400 to-indigo-500' },
          { label: 'Active Posts', value: '—', icon: BookOpen, color: 'from-purple-400 to-pink-500' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm card-hover animate-fadeInUp"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Classes grid */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900">My Classes</h2>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{classes.length}</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 animate-fadeInUp" style={{opacity:0}}>
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={36} className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-semibold">No classes yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {user.role === 'teacher' ? 'Create your first class to get started' : 'Join a class using a class code'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, i) => <ClassCard key={cls._id} cls={cls} index={i} />)}
        </div>
      )}

      {showCreate && (
        <Modal title="Create a New Class" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Class Name *" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Mathematics 101" required />
            <Input label="Subject" value={createForm.subject} onChange={e => setCreateForm({ ...createForm, subject: e.target.value })} placeholder="e.g. Algebra" />
            <ModalActions onCancel={() => setShowCreate(false)} loading={submitting} label="Create Class" />
          </form>
        </Modal>
      )}

      {showJoin && (
        <Modal title="Join a Class" onClose={() => setShowJoin(false)}>
          <form onSubmit={handleJoin} className="space-y-4">
            <Input label="Class Code *" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. AB12XYZ" required />
            <ModalActions onCancel={() => setShowJoin(false)} loading={submitting} label="Join Class" />
          </form>
        </Modal>
      )}
      <GroqChat role={user.role} />
    </div>
  );
}
