import React, { useState } from 'react';
import { login, forgotPassword, verifyOtp, resetPassword } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

// ─── Forgot Password Steps ────────────────────────────────────────────────────
const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Email is required');
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) return setError('OTP is required');
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      setResetToken(res.resetToken);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      onBack(); // login screen pe wapis
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = { 1: 'Forgot Password', 2: 'Enter OTP', 3: 'New Password' };
  const stepDesc = {
    1: 'Enter your email and we\'ll send you an OTP.',
    2: `We sent a 6-digit OTP to ${email}. It expires in 10 minutes.`,
    3: 'Enter your new password to complete the reset.',
  };

  return (
    <div className="w-full max-w-sm">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Login
      </button>

      <div className="mb-8 inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
        <KeyRound size={22} className="text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{stepTitle[step]}</h2>
      <p className="text-slate-500 mt-1.5 text-sm mb-8">{stepDesc[step]}</p>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${ s <= step ? 'bg-primary' : 'bg-slate-200'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1 — Email */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Sending OTP...</> : 'Send OTP'}
          </button>
        </form>
      )}

      {/* Step 2 — OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold tracking-[0.4em] text-center focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Verifying...</> : 'Verify OTP'}
          </button>
          <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full text-sm text-primary hover:underline font-semibold disabled:opacity-50">
            Resend OTP
          </button>
        </form>
      )}

      {/* Step 3 — New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Resetting...</> : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

// ─── Main Login Page ──────────────────────────────────────────────────────────

const Login = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', server: '' }); // Properly initialized keys
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = { email: '', password: '', server: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Form data update state
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Typing karte hi specific field errors aur server errors ko hide karna bina baki state udaye
    setErrors(prev => ({ 
      ...prev, 
      [name]: '', 
      server: '' // User dubara type kare toh purana server error hat jana chahiye
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevents default HTML form submit browser reload
    
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/admin/overview');
    } catch (err) {
      // FIX: Yahan prev state ko use kiya taaki dynamic errors persist karein aur purana inputs save rahein
      setErrors(prev => ({ 
        ...prev,
        server: err.message || "Invalid credentials. Please try again." 
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-md text-white relative z-10">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 transition-transform hover:scale-105">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">Admin Control Center</h1>
          <p className="text-lg text-indigo-100 font-medium">Secure access to your store management tools.</p>
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          {showForgot ? (
            <ForgotPassword onBack={() => setShowForgot(false)} />
          ) : (
          <>
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Login</h2>
            <p className="text-slate-500 mt-2 font-medium">Enter your details to manage your store.</p>
          </div>

          {/* SERVER ERROR ALERT */}
          {errors.server && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-primary'}`} size={18} />
                <input 
                  name="email"
                  type="email" 
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm font-medium ${errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'}`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-primary'}`} size={18} />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm font-medium ${errors.password ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'}`}
                />
                {/* EYE ICON TOGGLE */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.password}</p>}
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : "Sign Into Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Secure Admin Access Only
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;