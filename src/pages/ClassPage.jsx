import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, ExternalLink, Trash2, Users, Hash, BookOpen, ClipboardList, Calendar, X, ChevronDown } from 'lucide-react';
import GroqChat from '../components/GroqChat';

function PostCard({ post, isTeacher, onDelete, index }) {
  const isAssignment = post.type === 'assignment';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover animate-fadeInUp group"
      style={{ animationDelay: `${index * 0.07}s`, opacity: 0 }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`p-2.5 rounded-xl flex-shrink-0 shadow-sm ${isAssignment ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
            {isAssignment ? <ClipboardList size={18} className="text-white" /> : <BookOpen size={18} className="text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAssignment ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {post.type}
              </span>
            </div>
            {post.description && <p className="text-gray-500 text-sm mt-1 leading-relaxed">{post.description}</p>}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {post.link && (
                <a href={post.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
                  <ExternalLink size={13} /> Open Link
                </a>
              )}
              {post.deadline && (
                <span className="flex items-center gap-1.5 text-gray-400 text-sm bg-gray-50 px-2.5 py-1 rounded-lg">
                  <Calendar size={13} /> Due: {new Date(post.deadline).toLocaleDateString()}
                </span>
              )}
              <span className="text-gray-300 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        {isTeacher && (
          <button onClick={() => onDelete(post._id)}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 flex-shrink-0 opacity-0 group-hover:opacity-100">
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200 bg-gray-50 hover:bg-white" {...props} />
    </div>
  );
}

export default function ClassPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeacher = user.role === 'teacher';

  const [cls, setCls] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showStudents, setShowStudents] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', link: '', type: 'assignment', deadline: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clsRes, postsRes] = await Promise.all([api.get(`/classes/${id}`), api.get(`/posts/${id}`)]);
        setCls(clsRes.data); setPosts(postsRes.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load class');
        navigate('/dashboard');
      } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleCreatePost = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${id}`, form);
      setPosts(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', link: '', type: 'assignment', deadline: '' });
      toast.success('Post created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create post'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete post'); }
  };

  const filtered = activeTab === 'all' ? posts : posts.filter(p => p.type === activeTab);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <div className="h-40 rounded-3xl shimmer" />
      {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl shimmer" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm mb-5 transition-colors group animate-slideInLeft" style={{opacity:0}}>
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-6 animate-fadeInDown" style={{opacity:0}}>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-7">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-black/10 rounded-full translate-y-10" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-1">{cls?.name}</h1>
            {cls?.subject && <p className="text-white/70 text-sm mb-4">{cls.subject}</p>}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-sm text-white">
                <Hash size={13} /> {cls?.code}
              </span>
              <button onClick={() => setShowStudents(!showStudents)}
                className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-sm text-white hover:bg-white/20 transition-all">
                <Users size={13} /> {cls?.students?.length || 0} students
                <ChevronDown size={13} className={`transition-transform ${showStudents ? 'rotate-180' : ''}`} />
              </button>
              <span className="text-white/50 text-sm">by {cls?.teacherId?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Students Panel */}
      {showStudents && cls?.students?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 animate-fadeInUp" style={{opacity:0}}>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Users size={16} className="text-emerald-500" /> Enrolled Students
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cls.students.map((s, i) => (
              <div key={s._id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {s.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-medium">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs + Action */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {['all', 'assignment', 'material'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        {isTeacher && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95">
            <Plus size={16} /> Add Post
          </button>
        )}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-fadeInUp" style={{opacity:0}}>
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post, i) => <PostCard key={post._id} post={post} isTeacher={isTeacher} onDelete={handleDelete} index={i} />)}
        </div>
      )}

      {/* Create Post Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto animate-scaleIn" style={{opacity:0}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['assignment', 'material'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                      className={`py-2.5 rounded-xl border-2 font-medium capitalize text-sm transition-all duration-200 ${
                        form.type === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200 resize-none bg-gray-50 hover:bg-white"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
              <FormField label="Link (URL)" type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
              {form.type === 'assignment' && (
                <FormField label="Deadline" type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-all font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20">
                  {submitting ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Posting...</span> : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <GroqChat role={user.role} />
    </div>
  );
}
