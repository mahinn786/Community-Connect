import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  initialPortal = 'participant', // 'participant' | 'organizer'
  initialMode = 'login', // 'login' | 'signup'
  onSuccess
}) => {
  const { loginParticipant, signupParticipant, loginOrganizer, signupOrganizer, requestPasswordReset } = useAuth();

  const [portal, setPortal] = useState(initialPortal);
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'

  // Form State
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setLoading(true);
      try {
        const res = await requestPasswordReset(email);
        setSuccessMsg(res.message);
      } catch (err) {
        setError(err.message || 'Failed to send reset link.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (portal === 'participant' && !name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (portal === 'organizer' && (!organizationName.trim() || !contactName.trim())) {
        setError('Please enter organization name and contact person.');
        return;
      }
    }

    setLoading(true);
    try {
      if (portal === 'participant') {
        if (mode === 'login') {
          await loginParticipant(email, password);
        } else {
          await signupParticipant({ name, email, password });
        }
        if (onSuccess) onSuccess('Participant');
      } else {
        if (mode === 'login') {
          await loginOrganizer(email, password);
        } else {
          await signupOrganizer({ organizationName, contactName, email, password });
        }
        if (onSuccess) onSuccess('Organizer');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setError('');
    setSuccessMsg('');
    if (portal === 'participant') {
      setEmail('aarav.patel@gmail.com');
      setPassword('password123');
    } else {
      setEmail('contact@greenearth.org');
      setPassword('password123');
    }
  };

  const isOrganizer = portal === 'organizer';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#342C2D]/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white dark:bg-[#2A2324] rounded-3xl border border-[#D9D1C7] dark:border-[#4D4344] shadow-premium overflow-hidden z-10"
        >
          {/* Header Accent Bar (Deep Burgundy) */}
          <div className="h-2 w-full bg-[#783F46]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#342C2D]/50 dark:text-[#F6F3EF]/50 hover:text-[#783F46] hover:bg-[#D9D1C7]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 space-y-6 text-left">
            {/* Header info */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F6F3EF] dark:bg-[#342C2D] text-[#783F46] dark:text-[#D9D1C7] border border-[#D9D1C7]">
                {isOrganizer ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-[#783F46]" />
                    <span>Event Organizer Portal</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5 text-[#783F46]" />
                    <span>Participant & Volunteer Portal</span>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-bold text-[#342C2D] dark:text-[#F6F3EF]">
                {mode === 'login' && (isOrganizer ? 'Organizer Sign In' : 'Welcome to Community Connect')}
                {mode === 'signup' && (isOrganizer ? 'Register as Organizer' : 'Create Participant Account')}
                {mode === 'forgot' && 'Reset Your Password'}
              </h2>

              <p className="text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
                {mode === 'login' &&
                  (isOrganizer
                    ? 'Manage drives, track registrations, and verify community attendance.'
                    : 'Discover events, join volunteer drives, earn certificates, and connect.')}
                {mode === 'signup' &&
                  (isOrganizer
                    ? 'Publish drives, mobilize participants, and broadcast social impact.'
                    : 'Sign up to register for community drives and participate.')}
                {mode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#783F46]/10 border border-[#783F46]/30 text-[#783F46] text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#F6F3EF] border border-[#D9D1C7] text-[#342C2D] text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#783F46]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Participant Name */}
              {!isOrganizer && mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40" />
                    <input
                      type="text"
                      placeholder="e.g. Aarav Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/40 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Organizer Fields */}
              {isOrganizer && mode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                      Organization Name
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40" />
                      <input
                        type="text"
                        placeholder="e.g. Green Earth Foundation NGO"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/40 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                      Primary Contact Person
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40" />
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma (Director)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/40 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40" />
                  <input
                    type="email"
                    placeholder={isOrganizer ? 'contact@organization.org' : 'you@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/40 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError('');
                        }}
                        className="text-[11px] font-medium text-[#783F46] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/40 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-[#342C2D]/50 hover:text-[#783F46] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password for signup */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#342C2D] dark:text-[#F6F3EF]">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-[#342C2D]/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F6F3EF] dark:bg-[#342C2D] border border-[#D9D1C7] dark:border-[#4D4344] text-[#342C2D] dark:text-[#F6F3EF] placeholder-[#342C2D]/40 focus:outline-none focus:ring-1 focus:ring-[#783F46] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA Button (Deep Burgundy per spec) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#783F46] hover:bg-[#623339] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && (isOrganizer ? 'Register Organization' : 'Create Account')}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Quick Fill helper */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs text-[#342C2D]/70 hover:text-[#783F46] underline transition-colors"
              >
                Fill demo {isOrganizer ? 'Organizer' : 'Participant'} credentials
              </button>
            </div>

            {/* Toggle between Login and Signup */}
            <div className="pt-2 border-t border-[#D9D1C7] text-center text-xs text-[#342C2D]/70 dark:text-[#F6F3EF]/70">
              {mode === 'login' && (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="font-semibold text-[#783F46] hover:underline"
                  >
                    Sign up now
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="font-semibold text-[#783F46] hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <p>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="font-semibold text-[#783F46] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Subtle Portal Switcher text link */}
            <div className="pt-2 text-center text-xs text-[#342C2D]/60 dark:text-[#F6F3EF]/60">
              {isOrganizer ? (
                <p>
                  Looking to attend drives or volunteer?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setPortal('participant');
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="font-medium text-[#783F46] hover:underline inline-flex items-center gap-1"
                  >
                    Switch to Participant Portal →
                  </button>
                </p>
              ) : (
                <p>
                  Are you an event organizer or NGO?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setPortal('organizer');
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="font-medium text-[#783F46] hover:underline inline-flex items-center gap-1"
                  >
                    Sign in to Organizer Hub →
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
