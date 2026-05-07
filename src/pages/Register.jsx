import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, GraduationCap, Zap, ArrowRight, BookOpen, Users } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 px-4 py-8">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-float2" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-float3" />

      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-2xl shadow-emerald-500/30 mb-4 animate-float">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Join EduNet</h1>
          <p className="text-emerald-300/70 text-sm">Create your account today</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fadeInUp delay-100" style={{opacity:0}}>
              <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
              <input type="text" required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe" />
            </div>

            <div className="animate-fadeInUp delay-200" style={{opacity:0}}>
              <label className="block text-sm font-medium text-white/80 mb-2">Email address</label>
              <input type="email" required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" />
            </div>

            <div className="animate-fadeInUp delay-300" style={{opacity:0}}>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="animate-fadeInUp delay-400" style={{opacity:0}}>
              <label className="block text-sm font-medium text-white/80 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', icon: BookOpen, label: 'Student' },
                  { value: 'teacher', icon: Users, label: 'Teacher' },
                ].map(({ value, icon: Icon, label }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                    className={`py-3 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      form.role === value
                        ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300 shadow-lg shadow-emerald-500/20'
                        : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/70'
                    }`}>
                    <Icon size={16} />{label}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fadeInUp delay-500" style={{opacity:0}}>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Zap size={18} /> Create Account <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
