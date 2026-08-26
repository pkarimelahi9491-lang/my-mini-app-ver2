/**
 * SHADOW / DESIGN REVIEW — Admin Panel
 *
 * Authenticated content-management app served at /admin.
 * Reuses the exact same CMS components that previously lived inside the
 * public site (ProjectsDashboard + editors), now backed by MySQL through
 * ProjectContext and gated behind a PHP-session login.
 *
 * Author: Hamidreza Derhami
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { LogOut, ExternalLink, KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { ProjectProvider, useProjects } from '../context/ProjectContext';
import { ProjectsDashboard } from '../components/cms/ProjectsDashboard';
import { ProjectEditorModal } from '../components/cms/ProjectEditorModal';
import { PictogramEditorModal } from '../components/cms/PictogramEditorModal';
import { CatalogEditorModal } from '../components/cms/CatalogEditorModal';

type GateState = 'checking' | 'login' | 'ready' | 'unreachable';

// -----------------------------------------------------------------
// Login screen
// -----------------------------------------------------------------
const LoginScreen: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setBusy(true);
    setError(null);
    try {
      await api.login(username.trim(), password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'ورود ناموفق بود.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center px-4 font-sans">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-[#101218] border border-white/10 rounded-2xl p-8 space-y-5"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-11 h-11 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#0066FF]" />
          </div>
          <h1 className="text-lg font-bold text-white">پنل مدیریت سایه</h1>
          <p className="text-xs text-slate-500">SHADOW / DESIGN REVIEW — ورود مدیر</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-user" className="block text-xs text-slate-400">نام کاربری</label>
          <input
            id="admin-user"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            dir="ltr"
            className="w-full h-11 px-3.5 rounded-lg bg-[#0b0d13] border border-white/10 focus:border-[#0066FF] outline-none text-sm text-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-pass" className="block text-xs text-slate-400">رمز عبور</label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            dir="ltr"
            className="w-full h-11 px-3.5 rounded-lg bg-[#0b0d13] border border-white/10 focus:border-[#0066FF] outline-none text-sm text-white transition-colors"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy || !username.trim() || !password}
          className="w-full h-11 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          {busy ? 'در حال بررسی…' : 'ورود به پنل'}
        </button>
      </form>
    </div>
  );
};

// -----------------------------------------------------------------
// Authenticated admin shell — mounts the same CMS components as before
// -----------------------------------------------------------------
const AdminShell: React.FC<{ onLogout: () => void; username?: string }> = ({ onLogout, username }) => {
  const {
    isEditorOpen,
    editingProject,
    closeEditor,
    isPictogramEditorOpen,
    editingPictogram,
    closePictogramEditor,
    isCatalogEditorOpen,
    editingCatalog,
    closeCatalogEditor
  } = useProjects();

  const [changeOpen, setChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwBusy(true);
    setPwError(null);
    setPwMessage(null);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPwMessage('رمز عبور با موفقیت تغییر کرد.');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setChangeOpen(false), 1200);
    } catch (err: any) {
      setPwError(err?.message || 'تغییر رمز ناموفق بود.');
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#e4e4e9] font-sans">
      {/* Admin top bar */}
      <div className="fixed top-0 inset-x-0 z-[60] h-12 bg-[#07080d]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#66a3ff] text-[10px] font-bold shrink-0">
            ADMIN
          </span>
          <span className="text-xs text-slate-400 truncate">
            پنل مدیریت محتوا {username ? `— ${username}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="مشاهده سایت"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مشاهده سایت</span>
          </button>
          <button
            onClick={() => { setChangeOpen(v => !v); setPwError(null); setPwMessage(null); }}
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="تغییر رمز عبور"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تغییر رمز</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs transition-colors cursor-pointer"
            title="خروج"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>

      {/* Inline change-password panel */}
      {changeOpen && (
        <form
          onSubmit={handleChangePassword}
          className="fixed top-14 left-4 z-[60] w-72 bg-[#101218] border border-white/10 rounded-xl p-4 space-y-3 shadow-2xl"
        >
          <p className="text-xs font-bold text-white">تغییر رمز عبور</p>
          <input
            type="password"
            placeholder="رمز فعلی"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            dir="ltr"
            className="w-full h-9 px-3 rounded-lg bg-[#0b0d13] border border-white/10 focus:border-[#0066FF] outline-none text-xs text-white"
          />
          <input
            type="password"
            placeholder="رمز جدید (حداقل ۸ کاراکتر)"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="new-password"
            dir="ltr"
            className="w-full h-9 px-3 rounded-lg bg-[#0b0d13] border border-white/10 focus:border-[#0066FF] outline-none text-xs text-white"
          />
          {pwError && <p className="text-[11px] text-red-400">{pwError}</p>}
          {pwMessage && <p className="text-[11px] text-emerald-400">{pwMessage}</p>}
          <button
            type="submit"
            disabled={pwBusy || !currentPassword || newPassword.length < 8}
            className="w-full h-9 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {pwBusy ? 'در حال ثبت…' : 'ثبت رمز جدید'}
          </button>
        </form>
      )}

      {/* CMS Dashboard (same components the public site used to host) */}
      <div className="pt-12">
        <ProjectsDashboard
          isOpen={true}
          onClose={() => { window.location.href = '/'; }}
          onSelectProject={(project) => {
            window.open(`/#project/${project.slug || project.id}`, '_blank');
          }}
        />
        <ProjectEditorModal
          isOpen={isEditorOpen}
          project={editingProject}
          onClose={closeEditor}
          onPreview={(project) => {
            closeEditor();
            window.open(`/#project/${project.slug || project.id}`, '_blank');
          }}
        />
        <PictogramEditorModal
          isOpen={isPictogramEditorOpen}
          project={editingPictogram}
          onClose={closePictogramEditor}
        />
        <CatalogEditorModal
          isOpen={isCatalogEditorOpen}
          catalog={editingCatalog}
          onClose={closeCatalogEditor}
        />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// Gate: session check -> login -> admin shell wrapped in the provider
// -----------------------------------------------------------------
export const AdminApp: React.FC = () => {
  const [gate, setGate] = useState<GateState>('checking');
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.session();
        if (cancelled) return;
        if (res.authenticated) {
          setUsername(res.username);
          setGate('ready');
        } else {
          setGate('login');
        }
      } catch {
        if (!cancelled) setGate('unreachable');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout
    }
    setGate('login');
  };

  if (gate === 'checking') {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center font-sans">
        <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
      </div>
    );
  }

  if (gate === 'unreachable') {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center px-4 font-sans">
        <div className="max-w-sm text-center space-y-3 bg-[#101218] border border-white/10 rounded-2xl p-8">
          <p className="text-sm font-bold text-white">اتصال به سرور برقرار نشد</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            سرویس API در مسیر <code dir="ltr" className="text-[#66a3ff]">/api</code> در دسترس نیست.
            مطمئن شوید پوشه <code dir="ltr" className="text-[#66a3ff]">api/</code> روی هاست آپلود شده و
            فایل <code dir="ltr" className="text-[#66a3ff]">api/config.php</code> تنظیم شده است.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 h-9 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold cursor-pointer"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (gate === 'login') {
    return <LoginScreen onSuccess={() => setGate('checking')} />;
  }

  return (
    <ProjectProvider>
      <AdminShell onLogout={handleLogout} username={username} />
    </ProjectProvider>
  );
};
