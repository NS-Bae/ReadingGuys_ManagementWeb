import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManagerLogOut } from '../utils/auth';
import { getHomeForRole, getSession } from '../utils/info';
import { Button } from './ui';

export default function AdminShell({ role, active, onChange, items, children }) {
  const navigate = useNavigate();
  const session = useMemo(() => getSession(), []);

  useEffect(() => {
    if(!session || session.userType !== role) navigate(session ? getHomeForRole(session.userType) : '/', { replace: true });
  }, [navigate, role, session]);

  useEffect(() => {
    const handleExpired = () => navigate('/', { replace: true });
    window.addEventListener('readingguys:auth-expired', handleExpired);
    return () => window.removeEventListener('readingguys:auth-expired', handleExpired);
  }, [navigate]);

  if(!session || session.userType !== role) return null;

  const logout = async() => {
    try { await ManagerLogOut(); }
    finally { navigate('/', { replace: true }); }
  };

  const nav = (mobile = false) => (
    <nav className={mobile ? 'mobile-nav' : 'nav-list'} aria-label="관리 메뉴">
      {items.map(item => <button key={item.key} type="button" className={`nav-button${active === item.key ? ' active' : ''}`} onClick={() => onChange(item.key)}>{item.label}</button>)}
    </nav>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row"><div className="brand-mark">R</div><div><p className="brand-title">독한 녀석들</p><p className="brand-caption">Management Console</p></div></div>
        {nav()}
      </aside>
      <div className="main-column">
        <header className="topbar"><span className="topbar-title">관리자 운영 대시보드</span><div className="topbar-actions"><span className="role-chip">{role}</span><Button variant="ghost" small onClick={logout}>로그아웃</Button></div></header>
        <main className="content-area">{children}</main>
        {nav(true)}
      </div>
    </div>
  );
}
