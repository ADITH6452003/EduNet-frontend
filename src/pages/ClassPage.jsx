import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, ExternalLink, Trash2, Users, Hash, BookOpen, ClipboardList, Calendar } from 'lucide-react';

function PostCard({ post, isTeacher, onDelete }) {
  const isAssignment = post.type === 'assignment';
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg flex-shrink-0 ${isAssignment ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {isAssignment ? <ClipboardList size={18} /> : <BookOpen size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAssignment ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {post.type}
              </span>
            </div>
            {post.description && <p className="text-gray-600 text-sm mt-1">{post.description}</p>}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {post.link && (
                <a href={post.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium">
                  <ExternalLink size={14} /> Open Link
                </a>
              )}
              {post.deadline && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Calendar size={14} /> Due: {new Date(post.deadline).toLocaleDateString()}
                </span>
              )}
              <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        {isTeacher && (
          <button onClick={() => onDelete(post._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0">
            <Trash2 size={16} />
          </button>
        )}
      </div>
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
        setCls(clsRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load class');
        navigate('/dashboard');
      } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${id}`, form);
      setPosts(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', link: '', type: 'assignment', deadline: '' });
      toast.success('Post created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally { setSubmitting(false); }
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
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">{cls?.name}</h1>
          {cls?.subject && <p className="text-white/80 mt-1">{cls.subject}</p>}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm">
              <Hash size={14} /> {cls?.code}
            </span>
            <button onClick={() => setShowStudents(!showStudents)} className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition">
              <Users size={14} /> {cls?.students?.length || 0} students
            </button>
            <span className="text-white/70 text-sm">by {cls?.teacherId?.name}</span>
          </div>
        </div>
      </div>

      {/* Students Panel */}
      {showStudents && cls?.students?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Enrolled Students</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cls.students.map(s => (
              <div key={s._id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-xs">
                  {s.name[0].toUpperCase()}
                </div>
                {s.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs + Action */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {['all', 'assignment', 'material'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        {isTeacher && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm">
            <Plus size={16} /> Add Post
          </button>
        )}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p>No posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => <PostCard key={post._id} post={post} isTeacher={isTeacher} onDelete={handleDelete} />)}
        </div>
      )}

      {/* Create Post Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['assignment', 'material'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                      className={`py-2 rounded-lg border-2 font-medium capitalize text-sm transition ${form.type === t ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
              <FormField label="Link (URL)" type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
              {form.type === 'assignment' && (
                <FormField label="Deadline" type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60">
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" {...props} />
    </div>
  );
}
