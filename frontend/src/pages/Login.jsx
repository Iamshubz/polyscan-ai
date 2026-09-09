import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Hexagon, Leaf, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      } else {
        showToast(res.message || 'Login failed.', 'error');
      }
    } catch (err) {
      console.error('[Login Error]:', err);
      showToast(err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoUser = () => {
    setEmail('demo@polyscan.ai');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 lg:p-10 border border-[#DCE5DD] shadow-xl max-w-md w-full space-y-6">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative w-12 h-12 flex items-center justify-center text-[#16803A]">
            <Hexagon className="w-12 h-12 stroke-[1.8]" />
            <Leaf className="w-6 h-6 absolute fill-[#16803A]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#17231C] tracking-tight mt-1">
            PolyScan <span className="text-[#16803A]">AI</span>
          </h1>
          <p className="text-xs text-[#66736B]">Sign in to access your sustainability dashboard</p>
        </div>

        {/* Demo Quick Button */}
        <div className="p-3 bg-[#EAF6E9] rounded-2xl border border-[#7BA77B]/30 flex items-center justify-between">
          <div className="text-xs text-[#14532D]">
            <span className="font-bold block">Quick Demo Login</span>
            <span>demo@polyscan.ai</span>
          </div>
          <button
            type="button"
            onClick={fillDemoUser}
            className="px-3 py-1.5 bg-[#16803A] text-white font-bold text-xs rounded-xl hover:bg-[#14532D] shadow-xs"
          >
            Fill Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17231C]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F5F7F3] border border-[#DCE5DD] rounded-xl text-sm font-medium text-[#17231C] focus:outline-none focus:border-[#16803A]"
              />
              <Mail className="w-4 h-4 text-[#66736B] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17231C]">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F5F7F3] border border-[#DCE5DD] rounded-xl text-sm font-medium text-[#17231C] focus:outline-none focus:border-[#16803A]"
              />
              <Lock className="w-4 h-4 text-[#66736B] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 bg-[#16803A] text-white font-bold text-sm rounded-xl hover:bg-[#14532D] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#66736B] pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#16803A] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
