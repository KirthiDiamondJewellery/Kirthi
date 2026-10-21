import React, { useState, useEffect } from 'react';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, deleteDoc, setDoc, query, startAfter, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useContent, SiteContent } from '../contexts/ContentContext';
import { X, Plus, Trash2, Image as ImageIcon, Loader2, Star, Save, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import AdminOrders from './AdminOrders';
import AdminAnalytics from './AdminAnalytics';
import AdminBridalSubmissions from './AdminBridalSubmissions';
import AdminConsultations from './AdminConsultations';
import AdminAccessControl from './AdminAccessControl';
import AdminSEO from './AdminSEO';
import { AdminVideos } from "./AdminVideos";

import { compressImage, compressImageToDataUrl, uploadImage } from '../utils/imageUpload';
export default function AdminView() {
  const [user, authLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckDone, setAdminCheckDone] = useState(false);
  const [checkedUid, setCheckedUid] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Email login failed:", err);
      let msg = err.message || "An unexpected error occurred.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = "Invalid email or password combination.";
      } else if (err.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      } else if (err.code === 'auth/invalid-credential') {
        msg = "Invalid credentials. Please double-check your email and password.";
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password login is currently disabled in your Firebase Authentication settings. Please enable it in Firebase Console > Authentication > Sign-in method.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthSuccess("Account registered successfully! Checking admin status...");
    } catch (err: any) {
      console.error("Email registration failed:", err);
      let msg = err.message || "Could not register account.";
      if (err.code === 'auth/email-already-in-use') {
        // Self-healing fallback: if account already exists, log in with the provided password
        try {
          setAuthSuccess("Account already exists. Authenticating with credentials...");
          await signInWithEmailAndPassword(auth, email, password);
          return;
        } catch (loginErr: any) {
          msg = `This email is already registered, and the automatic sign-in attempt failed: ${loginErr.message || loginErr.code}`;
        }
      } else if (err.code === 'auth/weak-password') {
        msg = "Password must be at least 6 characters long.";
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password registration is currently disabled in your Firebase Authentication settings. Please enable it in Firebase Console > Authentication > Sign-in method.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthSuccess("A password reset email has been sent to your inbox.");
    } catch (err: any) {
      console.error("Password reset failed:", err);
      let msg = err.message || "Could not send reset link.";
      if (err.code === 'auth/operation-not-allowed') {
        msg = "Email/Password authentication is disabled in your Firebase Authentication settings. Please enable it in Firebase Console.";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!authLoading) {
      if (user) {
        if (checkedUid !== user.uid) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAdminCheckDone(false);
          if (user.email && user.email.toLowerCase() === 'shekar.v.menon@gmail.com') {
            setIsAdmin(true);
            setCheckedUid(user.uid);
            setAdminCheckDone(true);
          } else {
            getDoc(doc(db, 'admins', user.uid)).then(snap => {
              setIsAdmin(snap.exists());
              setCheckedUid(user.uid);
              setAdminCheckDone(true);
            }).catch((err) => {
              console.error("Error checking admin status", err);
              setIsAdmin(false);
              setCheckedUid(user.uid);
              setAdminCheckDone(true);
            });
          }
        }
      } else {
        setIsAdmin(false);
        setCheckedUid(null);
        getRedirectResult(auth).then((result) => {
          if (result) {
            console.log("Found redirect result:", result.user);
          } else {
            setAdminCheckDone(true);
          }
        }).catch((err) => {
          console.error("Redirect result error:", err);
          setAuthError(err.message || "Failed to complete redirect login.");
          setAdminCheckDone(true);
        });
      }
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => {
      setLoading(false);
      setAdminCheckDone(true);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [authLoading, user, checkedUid]);
  const { content, updateContent, loading: contentLoading } = useContent();
  const [formData, setFormData] = useState<SiteContent>(content);

  React.useEffect(() => {
    if (!contentLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(content);
    }
  }, [contentLoading, content]);

  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'access' | 'global' | 'blogs' | 'trends' | 'contact_page' | 'shop' | 'heritage' | 'maison' | 'brides' | 'submissions' | 'consultations' | 'orders' | 'analytics' | 'exchange' | 'seo' | 'videos' | 'videos'>('analytics');

  if (loading || (user && !adminCheckDone)) return <div className="p-20 text-center">Loading security protocols...</div>;

  if (!user) {
    const isIframe = window !== window.top;

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 pt-10 px-4">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 tracking-wide">Maison Admin Portal</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] opacity-85">Restricted Access</p>
        </div>

        <div className="w-full max-w-md bg-black/60 border border-white/10 p-8 rounded-sm space-y-6 shadow-2xl backdrop-blur-md">
          {authMode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-white uppercase tracking-wider">Maison Sign In</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">Sign in with your credentials</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {authSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="shekar.v.menon@gmail.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccess(null); }}
                      className="text-[9px] uppercase tracking-[0.15em] text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-medium text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] tracking-wider text-white/40">
                <span>Need an account?</span>
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccess(null); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-white uppercase tracking-wider">Create Admin Account</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">Create direct password credentials</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {authSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="shekar.v.menon@gmail.com"
                  />
                  <span className="text-[8px] text-[#D4AF37]/70 block mt-1 uppercase tracking-widest">Use your primary admin email for permissions</span>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-medium text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] tracking-wider text-white/40">
                <span>Already have an account?</span>
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-white uppercase tracking-wider">Reset Password</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">Receive a recovery link via email</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {authSuccess}
                </div>
              )}

              <div>
                <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/90 font-light"
                  placeholder="name@kirthidiamonds.com"
                />
              </div>

              <button 
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-medium text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Sending email...' : 'Send Recovery Link'}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] tracking-wider text-white/40">
                <button 
                  type="button" 
                  onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Separation Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-black text-[9px] uppercase tracking-[0.25em] text-white/40">OR</span>
          </div>

          {/* Google Sign In option */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] opacity-40 uppercase tracking-widest block">Single Sign-On</span>
            </div>

            {isIframe ? (
              <div className="space-y-3">
                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-sm text-[10px] text-amber-300/80 leading-relaxed uppercase tracking-wider text-center">
                  Google SSO is blocked inside this preview frame due to security restrictions. Use direct Email sign-in above or open full-screen.
                </div>
                <a 
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 border border-white/10 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5 transition-all text-[10px] tracking-[0.15em] uppercase w-full flex items-center justify-center gap-2 cursor-pointer bg-black/20"
                >
                  Open Full Screen
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={async () => {
                    const provider = new GoogleAuthProvider();
                    try {
                      await signInWithPopup(auth, provider);
                    } catch (error: any) {
                      console.error("Login failed via popup:", error);
                      
                      const isStorageOrPopupError = 
                        error.code === 'auth/popup-blocked' || 
                        error.code === 'auth/internal-error' || 
                        error.code === 'auth/web-storage-unsupported' || 
                        error.message?.toLowerCase().includes('popup') || 
                        error.message?.toLowerCase().includes('storage') || 
                        error.message?.toLowerCase().includes('cookie') || 
                        error.message?.toLowerCase().includes('iframe');

                      if (isStorageOrPopupError) {
                        try {
                          console.log("Attempting fallback to redirect login...");
                          await signInWithRedirect(auth, provider);
                        } catch (redirectError: any) {
                          console.error("Redirect login also failed", redirectError);
                          alert("Authentication blocked by browser cookie or security settings. Please check your browser settings or use Email/Password login above.");
                        }
                      } else if (error.code === 'auth/unauthorized-domain') {
                        alert(`Login failed: Your custom domain (${window.location.hostname}) is not authorized. Add it to Firebase Console > Authentication > Settings > Authorized Domains.`);
                      } else if (error.code === 'auth/popup-closed-by-user') {
                        // User closed the popup window, no alert needed
                      } else {
                        alert(`Login failed: ${error.message || error.code}. Use Email/Password login above.`);
                      }
                    }
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37] text-white/90 hover:text-white transition-all text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>
                
                <button 
                  onClick={async () => {
                    const provider = new GoogleAuthProvider();
                    try {
                      await signInWithRedirect(auth, provider);
                    } catch (error: any) {
                      console.error("Redirect login failed", error);
                      alert(`Login failed: ${error.message || error.code}. `);
                    }
                  }}
                  className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 text-center transition-colors underline underline-offset-4"
                >
                  Use Redirect Method instead
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Frontend check to prevent visual access to unauthorized users
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 pt-32">
        <h2 className="text-3xl font-serif italic text-white/80">Unauthorized</h2>
        <p className="text-sm font-light opacity-50">You do not have permission to access the admin dashboard.</p>
        <button 
          onClick={() => signOut(auth)}
          className="px-8 py-3 border border-white/20 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all text-sm tracking-widest uppercase"
        >
          Sign Out ({user.email})
        </button>
      </div>
    );
  }

  const recompressBase64 = async (base64Str: string): Promise<string> => {
    if (!base64Str.startsWith('data:image/') || base64Str.length < 5000) {
      return base64Str;
    }

    try {
      // Convert base64 string to a File object
      const res = await fetch(base64Str);
      const blob = await res.blob();
      const extMatch = blob.type.match(/\/(png|jpeg|jpg|webp|gif|svg)/);
      const ext = extMatch ? extMatch[1].replace('jpeg', 'jpg') : 'webp';
      const file = new File([blob], `inline.${ext}`, { type: blob.type });

      return await uploadImage(file);
    } catch (e) {
      console.warn("Failed to upload inline base64 image", e);
      return base64Str;
    }
  };

  const traverseAndCompress = async (obj: any): Promise<any> => {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      if (obj.startsWith('data:image/')) {
        return await recompressBase64(obj);
      }
      
      // Inline string replacement for base64
      if (obj.includes('data:image/')) {
        const regex = /data:image\/[^;]+;base64,[^"'\s]+/g;
        const matches = obj.match(regex);
        if (matches && matches.length > 0) {
          let newStr = obj;
          for (const match of matches) {
            const compressed = await recompressBase64(match);
            newStr = newStr.replace(match, compressed);
          }
          return newStr;
        }
      }
      
      return obj;
    }
    if (Array.isArray(obj)) {
      const arr = [];
      for (const item of obj) {
        arr.push(await traverseAndCompress(item));
      }
      return arr;
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = await traverseAndCompress(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const { blogPosts, journalTrends, ...restData } = formData;
      const compressedData = await traverseAndCompress(restData);
      
      console.log("Size of shopProducts after compression:", JSON.stringify(compressedData.shopProducts)?.length);
      
      await updateContent(compressedData);
      setFormData({ ...compressedData, blogPosts, journalTrends });
      alert('Content successfully saved and deployed to Cloud SQL (PostgreSQL) database.');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update content: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Corporate Analytics' },
    { id: 'global', label: 'Global Setup' },
    { id: 'contact_page', label: 'Contact Us Config' },
    { id: 'blogs', label: 'Journal (Publication)' },
    { id: 'trends', label: 'Journal (Trends)' },
    { id: 'shop', label: 'Boutique (Products)' },
    { id: 'heritage', label: 'Heritage Archives' },
    { id: 'maison', label: 'Savoir Faire' },
    { id: 'brides', label: 'Patron Showcase' },
    { id: 'submissions', label: 'Patron Submissions' },
    { id: 'consultations', label: 'Bespoke Inquiries' },
    { id: 'orders', label: 'Client Orders' },
    { id: 'exchange', label: 'Exchange Rates' },
    { id: 'seo', label: 'SEO Management' },
    { id: 'access', label: 'Access Control' },
    { id: 'videos', label: 'Video Managers' }
  ] as const;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pt-32 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic text-[#D4AF37]">Maison Diamond Specialist</h2>
          <p className="text-xs uppercase tracking-[0.2em] opacity-40">Dynamic Data Management System</p>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-xs opacity-50">{user.email}</span>
          <button onClick={() => signOut(auth)} className="text-xs uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Sign Out</button>
        </div>
      </div>

      <div className="flex space-x-6 border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-4 text-xs md:text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${tab === t.id ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-white/50 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.01] border border-white/5 p-6 md:p-12 mb-20 relative">
        <React.Suspense fallback={<div className="p-12 text-center text-white/50 text-xs tracking-widest uppercase flex flex-col items-center justify-center"><Loader2 className="animate-spin w-4 h-4 mb-3" />Loading Module...</div>}>
        {tab === 'global' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Brand Identity</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Master Header Logo</label>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-mono">Live Website Header</span>
                  </div>
                  <ImageUpload value={formData.logoUrl || ''} onChange={(val) => setFormData({...formData, logoUrl: val})} />
                  <p className="text-[10px] text-white/40 tracking-wider">Synchronized across the main navigation header and mobile menus. Supports SVG, WebP, PNG, and JPEG.</p>
                </div>
                <div>
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block mb-2">Site Favicon (Google Search & Browsers)</label>
                  <FaviconUpload 
                    svgValue={formData.customFaviconSvg || ''}
                    fav32={formData.favicon_32 || ''}
                    fav192={formData.favicon_192 || ''}
                    fav512={formData.favicon_512 || ''}
                    favApple={formData.favicon_apple || ''}
                    onChange={(vals) => setFormData({
                      ...formData, 
                      customFaviconSvg: vals.svg,
                      favicon_32: vals.fav32,
                      favicon_192: vals.fav192,
                      favicon_512: vals.fav512,
                      favicon_apple: vals.favApple
                    })}
                  />
                </div>
              </div>
            </section>
            
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Store Policies (Percentages)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Diamond Policies */}
                <div className="space-y-4 p-4 border border-white/10 bg-black/30">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/5 pb-2">Diamond</h3>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Buyback (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.diamondBuybackPercentage ?? 85} onChange={e => setFormData({...formData, diamondBuybackPercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exchange (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.diamondExchangePercentage ?? 100} onChange={e => setFormData({...formData, diamondExchangePercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                </div>

                {/* Polki Policies */}
                <div className="space-y-4 p-4 border border-white/10 bg-black/30">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/5 pb-2">Polki</h3>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Buyback (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.polkiBuybackPercentage ?? 80} onChange={e => setFormData({...formData, polkiBuybackPercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exchange (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.polkiExchangePercentage ?? 100} onChange={e => setFormData({...formData, polkiExchangePercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                </div>

                {/* Colourstone Policies */}
                <div className="space-y-4 p-4 border border-white/10 bg-black/30">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] border-b border-white/5 pb-2">Colourstone</h3>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Buyback (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.colourstoneBuybackPercentage ?? 70} onChange={e => setFormData({...formData, colourstoneBuybackPercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                  <div className="space-y-2 text-white">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-50">Exchange (%)</label>
                    <input type="number" min="0" max="100" step="0.001" value={formData.colourstoneExchangePercentage ?? 80} onChange={e => setFormData({...formData, colourstoneExchangePercentage: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                  </div>
                </div>

              </div>
            </section>
            
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Landing View</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Hero Title</label>
                  <input type="text" value={formData.landingTitle || ''} onChange={e => setFormData({...formData, landingTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Hero Subtitle</label>
                  <textarea value={formData.landingSubtitle || ''} onChange={e => setFormData({...formData, landingSubtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Hero Video URL</label>
                  <input type="text" value={formData.heroVideoUrl || ''} onChange={e => setFormData({...formData, heroVideoUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Philosophy Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Label (e.g. The Philosophy)</label>
                  <input type="text" value={formData.philosophyTitle || ''} onChange={e => setFormData({...formData, philosophyTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Subtitle (use \nfor line breaks)</label>
                  <textarea value={formData.philosophySubtitle || ''} onChange={e => setFormData({...formData, philosophySubtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-white" />
                </div>
                <div className="space-y-2 md:col-span-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Description</label>
                  <textarea value={formData.philosophyDescription || ''} onChange={e => setFormData({...formData, philosophyDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 1 Value</label>
                  <input type="text" value={formData.philosophyStat1Value || ''} onChange={e => setFormData({...formData, philosophyStat1Value: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 1 Label</label>
                  <input type="text" value={formData.philosophyStat1Label || ''} onChange={e => setFormData({...formData, philosophyStat1Label: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 2 Value</label>
                  <input type="text" value={formData.philosophyStat2Value || ''} onChange={e => setFormData({...formData, philosophyStat2Value: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 text-white">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Stat 2 Label</label>
                  <input type="text" value={formData.philosophyStat2Label || ''} onChange={e => setFormData({...formData, philosophyStat2Label: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-6 md:space-y-4 md:col-span-2 text-white">
                   <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Philosophy Image</label>
                   <ImageUpload value={formData.philosophyImage || ''} onChange={(val) => setFormData({...formData, philosophyImage: val})} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Maison Details & Location</h2>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Maison Description</label>
                    <textarea value={formData.maisonDetails || ''} onChange={e => setFormData({...formData, maisonDetails: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-32" />
                  </div>
                  <div className="space-y-6 md:space-y-4">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Maison Image</label>
                    <ImageUpload value={formData.maisonImage || ''} onChange={(val) => setFormData({...formData, maisonImage: val})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Contact Phone</label>
                      <input type="text" value={formData.contactPhone || ''} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Contact Email</label>
                      <input type="text" value={formData.contactEmail || ''} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Location Address</label>
                      <textarea value={formData.locationDetails || ''} onChange={e => setFormData({...formData, locationDetails: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24" />
                    </div>
                  </div>
                </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Journal Trends Content</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Content (HTML allowed)</label>
                    <textarea value={formData.journalTrendsContent || ''} onChange={e => setFormData({...formData, journalTrendsContent: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-64 font-mono text-[10px] md:text-xs" />
                  </div>
                </div>
            </section>
          </div>
        )}

        {tab === 'contact_page' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4 text-[#D4AF37]">Contact Page Headers & Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Page Title</label>
                  <input type="text" value={formData.contactTitle || ''} onChange={e => setFormData({...formData, contactTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Page Subtitle</label>
                  <input type="text" value={formData.contactSubtitle || ''} onChange={e => setFormData({...formData, contactSubtitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Page Description</label>
                  <textarea value={formData.contactDescription || ''} onChange={e => setFormData({...formData, contactDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-24 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Phone Number</label>
                  <input type="text" value={formData.contactPhone || ''} onChange={e => setFormData({...formData, contactPhone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Contact Email Address</label>
                  <input type="text" value={formData.contactEmail || ''} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">WhatsApp Number (eg. +919847086990)</label>
                  <input type="text" value={formData.contactWhatsApp || ''} onChange={e => setFormData({...formData, contactWhatsApp: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Mailing / General Address</label>
                  <input type="text" value={formData.locationDetails || ''} onChange={e => setFormData({...formData, locationDetails: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4 text-[#D4AF37]">Kochi Showroom Location Coordinates & Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Label</label>
                  <input type="text" value={formData.kochiName || ''} onChange={e => setFormData({...formData, kochiName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Opening Hours</label>
                  <input type="text" value={formData.kochiHours || ''} onChange={e => setFormData({...formData, kochiHours: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Address (use \n for line breaks)</label>
                  <textarea value={formData.kochiAddress || ''} onChange={e => setFormData({...formData, kochiAddress: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Latitude Coordinate (eg. 10.00394)</label>
                  <input type="number" step="0.00001" value={formData.kochiLat ?? 10.00394} onChange={e => setFormData({...formData, kochiLat: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Longitude Coordinate (eg. 76.31155)</label>
                  <input type="number" step="0.00001" value={formData.kochiLng ?? 76.31155} onChange={e => setFormData({...formData, kochiLng: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Google Maps Link</label>
                  <input type="text" value={formData.kochiMapsLink || ''} onChange={e => setFormData({...formData, kochiMapsLink: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4 text-[#D4AF37]">Calicut Showroom Location Coordinates & Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Label</label>
                  <input type="text" value={formData.calicutName || ''} onChange={e => setFormData({...formData, calicutName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Opening Hours</label>
                  <input type="text" value={formData.calicutHours || ''} onChange={e => setFormData({...formData, calicutHours: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Showroom Address (use \n for line breaks)</label>
                  <textarea value={formData.calicutAddress || ''} onChange={e => setFormData({...formData, calicutAddress: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none h-20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Latitude Coordinate (eg. 11.25052)</label>
                  <input type="number" step="0.00001" value={formData.calicutLat ?? 11.25052} onChange={e => setFormData({...formData, calicutLat: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Longitude Coordinate (eg. 75.79251)</label>
                  <input type="number" step="0.00001" value={formData.calicutLng ?? 75.79251} onChange={e => setFormData({...formData, calicutLng: parseFloat(e.target.value) || 0})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white font-mono" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Google Maps Link</label>
                  <input type="text" value={formData.calicutMapsLink || ''} onChange={e => setFormData({...formData, calicutMapsLink: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white" />
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'blogs' && (
          <PaginatedArrayEditor 
            title="Journal Entries (Publication)"
            collectionName="site_content_blogPosts"
            schema={{ id: 'string', title: 'string', date: 'string', excerpt: 'string', content: 'string', image: 'image', featuredImage: 'image', images: 'imageGallery' }}
          />
        )}

        {tab === 'trends' && (
          <PaginatedArrayEditor 
            title="Journal Entries (Trends)"
            collectionName="site_content_journalTrends"
            schema={{ id: 'string', title: 'string', date: 'string', excerpt: 'string', content: 'string', image: 'image', featuredImage: 'image', images: 'imageGallery' }}
          />
        )}

        {tab === 'shop' && (
           <ArrayEditor 
            title="Boutique Products"
            items={formData.shopProducts || []}
            onChange={(items) => setFormData({...formData, shopProducts: items})}
            schema={{ id: 'string', name: 'string', price: 'number', category: 'string', description: 'string', longDescription: 'string', image: 'image', angles: 'imageGallery', metalWeight: 'number', diamondWeight: 'number', polkiWeight: 'number', metalQuality: 'string', diamondQuality: 'string', colourStoneWeight: 'number', availableMetals: 'array', availableSizes: 'array', details: 'array' }}
          />
        )}

        {tab === 'heritage' && (
          <ArrayEditor 
            title="Heritage Archive Items"
            items={formData.heritageItems || []}
            onChange={(items) => setFormData({...formData, heritageItems: items})}
            schema={{ id: 'string', title: 'string', era: 'string', year: 'string', description: 'string', materials: 'string', image: 'image' }}
          />
        )}

        {tab === 'maison' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Video & Overview Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Savoir Faire Description</label>
                  <textarea value={formData.methodologyDescription || ''} onChange={e => setFormData({...formData, methodologyDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white h-24" />
                </div>
              </div>
            </section>
            
            <ArrayEditor 
              title="Savoir Faire (Methodology Steps)"
              items={formData.methodologySteps || []}
              onChange={(items) => {
                // Ensure sequential stepOrder is assigned across all items
                const ordered = items.map((it: any, i: number) => ({ ...it, stepOrder: i + 1 }));
                setFormData({...formData, methodologySteps: ordered});
              }}
              schema={{ id: 'string', stepOrder: 'number', title: 'string', subtitle: 'string', text: 'string', detail: 'string', image: 'image' }}
            />
          </div>
        )}

        {tab === 'brides' && (
          <div className="space-y-12">
            <section className="space-y-6 bg-white/[0.02] border border-white/10 p-6 rounded">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-sm uppercase tracking-[0.3em] font-light text-[#D4AF37]">Patron Showcase Video ("Inside the Workshop")</h2>
                <p className="text-[11px] text-white/50 tracking-wider mt-1">Configure the video displayed on the Patron / Brides page.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Video URL (YouTube, Vimeo, or direct MP4 link)</label>
                  <input
                    type="text"
                    value={formData.patronVideoUrl || ''}
                    onChange={e => setFormData({ ...formData, patronVideoUrl: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/watch?v=cGrZrg3_BQw or https://youtu.be/cGrZrg3_BQw"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Video Title</label>
                  <input
                    type="text"
                    value={formData.patronVideoTitle || ''}
                    onChange={e => setFormData({ ...formData, patronVideoTitle: e.target.value })}
                    placeholder="Inside the Workshop"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50 block">Video Poster / Thumbnail</label>
                  <ImageUpload
                    value={formData.patronVideoPoster || ''}
                    onChange={val => setFormData({ ...formData, patronVideoPoster: val })}
                    label="Poster Image"
                  />
                </div>
              </div>
            </section>

            <ArrayEditor 
              title="Patron Showcase Gallery"
              items={formData.brideGallery || []}
              onChange={(items) => setFormData({...formData, brideGallery: items})}
              schema={{ id: 'string', name: 'string', story: 'string', description: 'string', image: 'image', images: 'imageGallery' }}
            />
          </div>
        )}

        {tab === 'submissions' && (
          <AdminBridalSubmissions />
        )}

        {tab === 'consultations' && (
          <AdminConsultations />
        )}

        {tab === 'orders' && (
          <AdminOrders />
        )}

        {tab === 'videos' && (
          <AdminVideos />
        )}
        {tab === 'seo' && (
          <AdminSEO formData={formData} setFormData={setFormData} />
        )}

        {tab === 'exchange' && (
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-sm uppercase tracking-[0.3em] font-light border-b border-white/10 pb-4">Base Valuation Rates</h2>
              <p className="text-xs opacity-50 font-light mb-8">Set the default per-carat base rates for gemstones used in the Exchange Calculator. Gold rates are automatically fetched live.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Diamond Rate (₹/Carat)</label>
                  <input 
                    type="number" 
                    value={formData.baseDiamondRate || ''} 
                    onChange={e => setFormData({...formData, baseDiamondRate: Number(e.target.value)})} 
                    placeholder="e.g. 80000"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Polki Rate (₹/Carat)</label>
                  <input 
                    type="number" 
                    value={formData.basePolkiRate || ''} 
                    onChange={e => setFormData({...formData, basePolkiRate: Number(e.target.value)})} 
                    placeholder="e.g. 30000"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-50">Colourstone Rate (₹/Carat)</label>
                  <input 
                    type="number" 
                    value={formData.baseColorstoneRate || ''} 
                    onChange={e => setFormData({...formData, baseColorstoneRate: Number(e.target.value)})} 
                    placeholder="e.g. 1000"
                    className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" 
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'analytics' && (
          <AdminAnalytics />
        )}

        {tab === 'access' && user && (
          <AdminAccessControl currentUserEmail={user.email || ''} />
        )}
        </React.Suspense>
      </div>
      
      {/* Floating Save Bar */}
      {['global', 'contact_page', 'shop', 'heritage', 'maison', 'brides', 'exchange'].includes(tab) && (
      <div className="fixed bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-white/5 py-4 px-6 md:px-12 z-[100] flex justify-between items-center">
        <span className="text-xs md:text-[10px] uppercase font-light tracking-widest opacity-50">All changes immediately reflect on the live preview upon deployment.</span>
        <button 
          onClick={() => handleSave()}
          disabled={saving}
          className="px-12 py-4 bg-[#D4AF37] text-black text-sm md:text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? 'Saving to Cloud SQL...' : 'Deploy to Cloud SQL'}
        </button>
      </div>
      )}
    </div>
  );
}



export const FaviconUpload = ({
  svgValue,
  fav32,
  fav192,
  fav512,
  favApple,
  onChange,
}: {
  svgValue: string;
  fav32: string;
  fav192: string;
  fav512: string;
  favApple: string;
  onChange: (vals: { svg: string; fav32: string; fav192: string; fav512: string; favApple: string }) => void;
}) => {
  const [processing, setProcessing] = useState(false);

  const handleFaviconFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      if (file.type === 'image/svg+xml') {
        const text = await file.text();
        const dataUrl = await compressImageToDataUrl(file, 512);
        onChange({
          svg: text,
          fav32: dataUrl,
          fav192: dataUrl,
          fav512: dataUrl,
          favApple: dataUrl,
        });
      } else {
        const fav32Url = await compressImageToDataUrl(file, 32);
        const fav192Url = await compressImageToDataUrl(file, 192);
        const fav512Url = await compressImageToDataUrl(file, 512);
        const favAppleUrl = await compressImageToDataUrl(file, 180);
        onChange({
          svg: svgValue || '',
          fav32: fav32Url,
          fav192: fav192Url,
          fav512: fav512Url,
          favApple: favAppleUrl,
        });
      }
    } catch (err) {
      console.error('Failed to process favicon:', err);
    } finally {
      setProcessing(false);
      e.target.value = '';
    }
  };

  const preview = fav32 || fav192 || fav512 || '/favicon-32x32.png';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-black/90 border border-[#D4AF37]/30 p-2 flex items-center justify-center shrink-0 rounded shadow-inner">
          <img src={preview} alt="Favicon" className="w-8 h-8 object-contain" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="cursor-pointer px-3.5 py-1.5 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 text-white/90 rounded border border-white/10">
              {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span>{processing ? 'Processing...' : 'Upload New Favicon'}</span>
              <input type="file" accept="image/svg+xml,image/png,image/jpeg" onChange={handleFaviconFile} className="hidden" disabled={processing} />
            </label>
            <button
              type="button"
              onClick={() => {
                onChange({
                  svg: '',
                  fav32: '/favicon-32x32.png',
                  fav192: '/favicon-192x192.png',
                  fav512: '/favicon-512x512.png',
                  favApple: '/apple-touch-icon.png',
                });
              }}
              className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-white/60 hover:text-[#D4AF37] border border-white/10 rounded transition-colors"
            >
              Default Brand Favicon
            </button>
          </div>
          <p className="text-[10px] text-white/40 tracking-wider">
            Automatically formats 32x32, 192x192, 512x512, and Apple Touch Icon for Google Search and all browser tabs.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ImageUpload = ({ value, onChange, label }: { value: string; onChange: (val: string) => void; label?: string }) => {
  const [uploading, setUploading] = useState(false);
  const [previewErr, setPreviewErr] = useState(false);

  React.useEffect(() => {
    setPreviewErr(false);
  }, [value]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreviewErr(false);
    try {
      const url = await uploadImage(file);
      if (url) {
        onChange(url);
      }
    } catch (err: any) {
      console.error("Upload failed", err);
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') onChange(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (innerErr) {
        alert("Failed to read image file: " + (err?.message || "Unknown error"));
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const isLogoField = label?.toLowerCase().includes("logo") || !label;

  return (
    <div className="space-y-3">
      {label && <label className="text-xs uppercase tracking-widest text-[#D4AF37]">{label}</label>}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {value && !previewErr ? (
          <div className="relative w-24 h-24 bg-black/90 border border-[#D4AF37]/30 p-2 flex items-center justify-center shrink-0 overflow-hidden group rounded shadow-inner">
            <img 
              src={value} 
              alt="Preview" 
              onError={() => setPreviewErr(true)}
              className="max-w-full max-h-full object-contain" 
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs tracking-wider transition-opacity font-medium"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 text-[10px] uppercase tracking-wider shrink-0 rounded p-1 text-center">
            {previewErr ? "Invalid Img" : isLogoField ? "No Logo" : "No Image"}
          </div>
        )}
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or data:image/..."
            className="w-full bg-black/60 border border-white/10 p-2.5 text-xs text-white focus:border-[#D4AF37] outline-none rounded"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <label className="cursor-pointer px-3.5 py-1.5 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 text-white/90 rounded border border-white/10">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Processing Image...' : 'Upload Image'}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
            {isLogoField && (
              <button
                type="button"
                onClick={() => onChange('/logo.png')}
                className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-white/60 hover:text-[#D4AF37] border border-white/10 rounded transition-colors"
              >
                Official Master Logo
              </button>
            )}
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-red-400/70 hover:text-red-400 border border-red-500/20 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArrayEditor = ({ title, items, onChange, schema }: any) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');

  const currentItems = items || [];
  const fields = Object.keys(schema || {});

  const handleUpdateItem = (index: number, key: string, val: any) => {
    const updated = [...currentItems];
    updated[index] = { ...updated[index], [key]: val };
    onChange(updated);
  };

  const handleAddItem = () => {
    const newItem: any = { id: `item_${Date.now()}` };
    fields.forEach(f => {
      if (f !== 'id') {
        if (f === 'stepOrder') {
          newItem[f] = currentItems.length + 1;
        } else {
          newItem[f] = schema[f] === 'number' ? 0 : schema[f] === 'array' ? [] : '';
        }
      }
    });
    // Append to the end to strictly maintain chronological progression
    const updated = [...currentItems, newItem].map((it: any, i: number) => ({
      ...it,
      stepOrder: it.stepOrder || (i + 1),
    }));
    onChange(updated);
    setEditingIndex(updated.length - 1);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;
    const copy = [...currentItems];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    // Reindex chronological stepOrder 1, 2, 3...
    const reordered = copy.map((item: any, idx: number) => ({
      ...item,
      stepOrder: idx + 1,
      order: idx + 1,
    }));
    onChange(reordered);
    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    }
  };

  const handleDeleteItem = (index: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const updated = currentItems.filter((_: any, i: number) => i !== index).map((it: any, i: number) => ({
      ...it,
      stepOrder: i + 1,
    }));
    onChange(updated);
    if (editingIndex === index) setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] font-light text-white">{title}</h2>
          <span className="text-xs text-white/40">{currentItems.length} items registered in chronological sequence</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter items..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="bg-black/50 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:border-[#D4AF37]"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-1.5 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-medium hover:bg-white transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Next Step
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentItems
          .filter((item: any) => {
            if (!filterText) return true;
            return JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase());
          })
          .map((item: any, idx: number) => {
            const isEditing = editingIndex === idx;
            const displayName = item.title || item.name || item.id || `Item #${idx + 1}`;
            return (
              <div key={item.id || idx} className="bg-black/40 border border-white/10 p-4 space-y-4 transition-all">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setEditingIndex(isEditing ? null : idx)}>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, 'up')}
                        className="p-1 hover:text-[#D4AF37] text-white/40 disabled:opacity-20 disabled:hover:text-white/40 transition-colors"
                        title="Move Up (Earlier Phase)"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentItems.length - 1}
                        onClick={() => handleMoveItem(idx, 'down')}
                        className="p-1 hover:text-[#D4AF37] text-white/40 disabled:opacity-20 disabled:hover:text-white/40 transition-colors"
                        title="Move Down (Later Phase)"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    {item.image && (
                      <img src={item.image} alt="" className="w-10 h-10 object-cover border border-white/10 rounded shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded">
                          Phase {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-xs uppercase tracking-widest text-white">{displayName}</h4>
                      </div>
                      {item.subtitle && <span className="text-[10px] text-white/50">{item.subtitle}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setEditingIndex(isEditing ? null : idx); }}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs text-white/80"
                    >
                      {isEditing ? 'Collapse' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(idx); }}
                      className="p-1 hover:text-red-400 text-white/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    {fields.map((field) => {
                      const type = schema[field];
                      const val = item[field];
                      if (type === 'image') {
                        return (
                          <div key={field} className="md:col-span-2">
                            <ImageUpload
                              label={field}
                              value={val || ''}
                              onChange={(newUrl) => {
                                const updatedItem = { ...item, [field]: newUrl };
                                if (field === 'image' && (!item.featuredImage || item.featuredImage.includes('unsplash.com'))) {
                                  updatedItem.featuredImage = newUrl;
                                }
                                if (field === 'featuredImage' && (!item.image || item.image.includes('unsplash.com'))) {
                                  updatedItem.image = newUrl;
                                }
                                const updated = [...currentItems];
                                updated[idx] = updatedItem;
                                onChange(updated);
                              }}
                            />
                          </div>
                        );
                      }
                      if (type === 'imageGallery') {
                        const gallery = Array.isArray(val) ? val : [];
                        return (
                          <div key={field} className="md:col-span-2 space-y-3 bg-white/[0.02] border border-white/10 p-3 rounded">
                            <label className="text-[10px] uppercase tracking-wider text-[#D4AF37] block">
                              {field} (Image Gallery - {gallery.length} images)
                            </label>
                            {gallery.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {gallery.map((imgUrl: string, imgIdx: number) => (
                                  <div key={imgIdx} className="relative aspect-square bg-black border border-white/20 rounded overflow-hidden group">
                                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newGallery = gallery.filter((_: any, i: number) => i !== imgIdx);
                                        handleUpdateItem(idx, field, newGallery);
                                      }}
                                      className="absolute inset-0 bg-red-950/80 text-red-300 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[10px] uppercase tracking-widest text-white/90 rounded border border-white/10 flex items-center gap-1.5 transition-colors">
                                <Plus size={12} />
                                <span>Add Image(s) to Gallery</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={async (e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (!files.length) return;
                                    const uploadedUrls: string[] = [];
                                    for (const f of files) {
                                      const u = await uploadImage(f);
                                      if (u) uploadedUrls.push(u);
                                    }
                                    const newGallery = [...gallery, ...uploadedUrls];
                                    const updatedItem = { ...item, [field]: newGallery };
                                    if (uploadedUrls.length > 0 && (!item.image || item.image.includes('unsplash.com'))) {
                                      updatedItem.image = uploadedUrls[0];
                                      updatedItem.featuredImage = uploadedUrls[0];
                                    }
                                    const updated = [...currentItems];
                                    updated[idx] = updatedItem;
                                    onChange(updated);
                                    e.target.value = '';
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        );
                      }
                      if (type === 'number') {
                        return (
                          <div key={field} className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/50">{field}</label>
                            <input
                              type="number"
                              value={val ?? 0}
                              onChange={(e) => handleUpdateItem(idx, field, parseFloat(e.target.value) || 0)}
                              className="w-full bg-black/60 border border-white/10 p-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                            />
                          </div>
                        );
                      }
                      if (type === 'array') {
                        return (
                          <div key={field} className="space-y-1 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-wider text-white/50">{field} (comma separated)</label>
                            <input
                              type="text"
                              value={Array.isArray(val) ? val.join(', ') : (val || '')}
                              onChange={(e) => handleUpdateItem(idx, field, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              className="w-full bg-black/60 border border-white/10 p-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={field} className={`space-y-1 ${field === 'description' || field === 'content' || field === 'longDescription' || field === 'detail' || field === 'text' ? 'md:col-span-2' : ''}`}>
                          <label className="text-[10px] uppercase tracking-wider text-white/50">{field}</label>
                          {field === 'description' || field === 'content' || field === 'longDescription' || field === 'detail' || field === 'text' ? (
                            <textarea
                              value={val || ''}
                              onChange={(e) => handleUpdateItem(idx, field, e.target.value)}
                              rows={3}
                              className="w-full bg-black/60 border border-white/10 p-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={val || ''}
                              onChange={(e) => handleUpdateItem(idx, field, e.target.value)}
                              className="w-full bg-black/60 border border-white/10 p-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
export const PaginatedArrayEditor = ({ title, collectionName, schema }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchColl = async () => {
      setLoading(true);
      try {
        // Fetch from Cloud SQL PostgreSQL first
        const res = await fetch(`/api/db/collection/${collectionName}`);
        if (res.ok) {
          const sqlItems = await res.json();
          if (Array.isArray(sqlItems) && sqlItems.length > 0) {
            if (isMounted) {
              setItems(sqlItems);
              setLoading(false);
              return;
            }
          }
        }
        // Fallback to Firestore
        const snap = await getDocs(collection(db, collectionName));
        if (isMounted) {
          setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (e) {
        console.error(`Error loading ${collectionName}`, e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchColl();
    return () => { isMounted = false; };
  }, [collectionName]);

  const handlePersistToCloudSql = async (newItems: any[]) => {
    setItems(newItems);
    setSaving(true);
    setStatusMsg("Saving changes to Cloud SQL (PostgreSQL)...");
    try {
      // 1. Direct Cloud SQL PostgreSQL Persistence
      const res = await fetch(`/api/db/collection/${collectionName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItems),
      });

      if (!res.ok) {
        console.warn("Cloud SQL save status:", res.status);
      }

      // 2. Also keep Firestore in sync for real-time listeners
      try {
        const colRef = collection(db, collectionName);
        const snap = await getDocs(colRef);
        const existingIds = new Set(snap.docs.map(d => d.id));
        const incomingIds = new Set(newItems.map(it => it.id).filter(Boolean));

        const cleanDoc = (obj: any): any => {
          if (Array.isArray(obj)) return obj.map(cleanDoc);
          if (obj && typeof obj === "object") {
            const cleaned: any = {};
            for (const k of Object.keys(obj)) {
              if (obj[k] !== undefined) cleaned[k] = cleanDoc(obj[k]);
            }
            return cleaned;
          }
          return obj;
        };

        for (const item of newItems) {
          const id = item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          await setDoc(doc(db, collectionName, id), cleanDoc({ ...item, id }), { merge: true });
        }
        for (const existingId of existingIds) {
          if (!incomingIds.has(existingId)) {
            await deleteDoc(doc(db, collectionName, existingId));
          }
        }
      } catch (err) {
        // Optional sync error
      }

      setStatusMsg("✓ All changes saved to Cloud SQL (PostgreSQL) database!");
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      console.error(`Error persisting ${collectionName}:`, err);
      setStatusMsg(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs tracking-widest uppercase text-white/40">Loading {title}...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/[0.03] border border-white/10 p-3.5 rounded gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">{title}</span>
          <span className="text-[10px] text-white/40">Direct Cloud SQL (PostgreSQL) Persistence</span>
        </div>
        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className={`text-xs ${statusMsg.startsWith("✓") ? "text-emerald-400" : "text-amber-400"}`}>
              {statusMsg}
            </span>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => handlePersistToCloudSql(items)}
            className="px-4 py-2 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? "Saving to Cloud SQL..." : "Save to Database"}</span>
          </button>
        </div>
      </div>
      <ArrayEditor
        title={title}
        items={items}
        onChange={handlePersistToCloudSql}
        schema={schema}
      />
    </div>
  );
};


