import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api';
import { ManagerLogIn } from '../utils/auth';
import { getHomeForRole, getSession } from '../utils/info';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ip1: '', ip2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getSession();
    if(session) navigate(getHomeForRole(session.userType), { replace: true });
  }, [navigate]);

  const login = async(event) => {
    event.preventDefault();
    if(!form.ip1.trim() || !form.ip2)
    {
      setError('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try
    {
      await ManagerLogIn(form);
      const session = getSession();
      if(!session) throw new Error('로그인 쿠키가 저장되지 않았습니다.');
      navigate(getHomeForRole(session.userType), { replace: true });
    }
    catch(error)
    {
      setError(getApiErrorMessage(error, error?.message || '로그인에 실패했습니다.'));
    }
    finally
    {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-card">
        <div className="brand-row">
          <div className="brand-mark">R</div>
          <div><p className="brand-title">독한 녀석들</p><p className="brand-caption">Management Console</p></div>
        </div>
        <div className="login-copy">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>운영자 로그인</h1>
          <p>관리자와 교사 계정으로 접속할 수 있습니다.</p>
        </div>
        <form onSubmit={login}>
          <div className="field">
            <label htmlFor="manager-id">아이디</label>
            <input id="manager-id" className="input" autoComplete="username" value={form.ip1} onChange={(event) => setForm(current => ({ ...current, ip1: event.target.value }))} placeholder="아이디를 입력하세요" />
          </div>
          <div className="field">
            <label htmlFor="manager-password">비밀번호</label>
            <input id="manager-password" className="input" type="password" autoComplete="current-password" value={form.ip2} onChange={(event) => setForm(current => ({ ...current, ip2: event.target.value }))} placeholder="비밀번호를 입력하세요" />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary login-submit" type="submit" disabled={loading}>{loading ? '로그인 중...' : '로그인'}</button>
        </form>
      </section>
    </div>
  );
}
