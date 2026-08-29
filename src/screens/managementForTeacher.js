import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../App.css';
import { getApiErrorMessage } from '../api';
import AdminShell from '../components/AdminShell';
import { Badge, Button, DataTable, ErrorState, LoadingState, formatDate } from '../components/ui';
import { adminApi } from '../utils/adminApi';
import { Modal } from '../components/ui';

const items = [
  { key: 'academy', label: '내 학원' },
  { key: 'records', label: '학습 기록' },
];

const PageHeading = ({ eyebrow, title, description, action }) => (
  <div className="page-heading-row">
    <div><p className="eyebrow">{eyebrow}</p><h1 className="page-title">{title}</h1><p className="page-description">{description}</p></div>
    {action}
  </div>
);

const Notice = ({ notice }) => notice ? <div className={`notice-${notice.tone || 'info'}`}>{notice.message}</div> : null;


const useRemoteList = (loader) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async() => {
    setLoading(true);
    setError('');
    try {
      const response = await loader();
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch(errorValue) {
      setError(getApiErrorMessage(errorValue, '데이터를 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [loader]);
  useEffect(() => { void load(); }, [load]);
  return { rows, setRows, loading, error, load };
};

const selectedRows = (rows, selected, rowKey) => rows.filter(row => selected.has(rowKey(row)));

function AcademyPanel({ academy, studentCount, roster, loading, error, reload }) {
  const columns = [
    { key: 'rawUserId', label: '사용자 ID' },
    { key: 'rawUserName', label: '이름' },
    { key: 'userType', label: '구분' },
    { key: 'ok', label: '계정 상태', render: row => <Badge tone={row.ok ? 'success' : 'danger'}>{row.ok ? '활성' : '정지'}</Badge> },
  ];
  return <>
    <div className="page-heading-row"><div><p className="eyebrow">MY ACADEMY</p><h1 className="page-title">{academy?.academyName || '내 학원'}</h1><p className="page-description">학원 구독 상태와 소속 회원을 확인합니다.</p></div><Button variant="ghost" onClick={reload}>새로고침</Button></div>
    {loading ? <section className="panel"><LoadingState /></section> : error ? <section className="panel"><ErrorState message={error} onRetry={reload} /></section> : <>
      <div className="stat-grid"><div className="stat-card"><p className="stat-label">소속 학생</p><p className="stat-value">{studentCount}명</p></div><div className="stat-card"><p className="stat-label">전체 계정</p><p className="stat-value">{roster.length}명</p></div><div className="stat-card"><p className="stat-label">구독 상태</p><p className="stat-value stat-with-badge"><Badge tone={academy?.paymentStatus ? 'success' : 'danger'}>{academy?.paymentStatus ? '사용 중' : '만료'}</Badge></p></div><div className="stat-card"><p className="stat-label">구독 종료</p><p className="stat-value stat-date">{formatDate(academy?.endMonth)}</p></div></div>
      <section className="panel"><div className="panel-header"><div><h2 className="panel-title">소속 회원</h2><p className="panel-subtitle">학생과 교사 계정을 함께 표시합니다.</p></div></div><DataTable columns={columns} rows={roster} rowKey={row => row.hashedUserId} /></section>
    </>}
  </>;
}

function RecordsPanel({ students }) {
  const [studentId, setStudentId] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const load = useCallback(async() => {
    setLoading(true); setError('');
    try { const response = await adminApi.teacher.records(studentId); setRows(Array.isArray(response.data) ? response.data : []); }
    catch(errorValue) { setError(getApiErrorMessage(errorValue, '학습 기록을 불러오지 못했습니다.')); }
    finally { setLoading(false); }
  }, [studentId]);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => rows.filter(row => `${row.rawUserId || ''} ${row.rawUserName || ''} ${row.WorkbookName || ''}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row.Rate || 0), 0) / rows.length) : 0;
  const columns = [
    { key: 'rawUserId', label: '학생 ID', render: row => row.rawUserId || '-' },
    { key: 'rawUserName', label: '학생 이름', render: row => row.rawUserName || '-' },
    { key: 'WorkbookName', label: '문제집' },
    { key: 'ExamDate', label: '시험 일시', render: row => formatDate(row.ExamDate || row.examDate, true) },
    { key: 'ProgressRate', label: '진행률', render: row => `${Number(row.ProgressRate ?? row.progressRate ?? 0)}%` },
    { key: 'Rate', label: '점수', render: row => <strong>{Number(row.Rate ?? row.rate ?? 0)}점</strong> },
  ];
  return <>
    <div className="page-heading-row"><div><p className="eyebrow">LEARNING RECORDS</p><h1 className="page-title">학생 학습 기록</h1><p className="page-description">학생별 시험 결과와 최근 학습 현황을 확인합니다.</p></div></div>
    <div className="stat-grid"><div className="stat-card"><p className="stat-label">조회 기록</p><p className="stat-value">{rows.length}회</p></div><div className="stat-card"><p className="stat-label">평균 점수</p><p className="stat-value">{average}점</p></div><div className="stat-card"><p className="stat-label">소속 학생</p><p className="stat-value">{students.length}명</p></div></div>
    <section className="panel"><div className="panel-header"><div><h2 className="panel-title">시험 기록</h2><p className="panel-subtitle">학생을 선택하면 해당 학생의 기록만 조회합니다.</p></div></div><div className="toolbar"><div className="record-filters"><select className="select student-select" value={studentId} onChange={event => setStudentId(event.target.value)}><option value="all">전체 학생</option>{students.map(student => <option key={student.hashedUserId} value={student.hashedUserId}>{student.rawUserName} ({student.rawUserId})</option>)}</select><input className="search-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="학생 또는 문제집 검색" /></div><Button variant="ghost" disabled={loading} onClick={load}>새로고침</Button></div>{loading ? <LoadingState label="학습 기록을 불러오고 있습니다." /> : error ? <ErrorState message={error} onRetry={load} /> : <DataTable columns={columns} rows={filtered} rowKey={(row) => `${row.hashedUserId || row.rawUserId}:${row.ExamDate || row.examDate}:${row.WorkbookName}`} />}</section>
  </>;
}

export function UsersPanel() {
  const loader = useCallback(() => adminApi.users.list(), []);
  const { rows, loading, error, load } = useRemoteList(loader);
  const [academies, setAcademies] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ userId: '', password: '', userName: '', hashedAcademyId: '', userType: '학생' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [formError, setFormError] = useState('');
  useEffect(() => { adminApi.academies.list().then(response => setAcademies(Array.isArray(response.data) ? response.data : [])).catch(() => setAcademies([])); }, []);
  const key = row => `${row.hashedAcademyId}:${row.hashedUserId}`;
  const filtered = useMemo(() => rows.filter(row => `${row.rawAcademyName} ${row.rawUserId} ${row.rawUserName} ${row.userType}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const targets = () => selectedRows(rows, selected, key);
  const openCreate = () => { setFormError(''); setForm({ userId: '', password: '', userName: '', hashedAcademyId: academies[0]?.hashedAcademyId || '', userType: '학생' }); setModal('create'); };
  const openEdit = () => { const row = targets()[0]; if(!row) return; setFormError(''); setForm({ userId: row.rawUserId, password: '', userName: row.rawUserName, hashedAcademyId: row.hashedAcademyId, userType: row.userType }); setModal('edit'); };
  const submit = async(event) => {
    event.preventDefault(); setBusy(true); setNotice(null); setFormError('');
    try {
      if(modal === 'create') {
        const response = await adminApi.users.create(form);
        setNotice({ tone: 'success', message: `${response.data.addedCount ?? 1}명의 사용자를 등록했습니다.` });
      } else {
        const response = await adminApi.users.update(targets()[0].hashedUserId, form);
        setNotice({ tone: 'success', message: `${response.data.updatedCount ?? 1}명의 정보를 변경했습니다.` });
      }
      setModal(null); setSelected(new Set()); await load();
    } catch(errorValue) { setFormError(getApiErrorMessage(errorValue, '사용자 정보를 저장하지 못했습니다.')); }
    finally { setBusy(false); }
  };
  const remove = async() => {
    const selectedUsers = targets();
    if(!selectedUsers.length || !window.confirm(`선택한 ${selectedUsers.length}명의 사용자를 삭제할까요?`)) return;
    setBusy(true); setNotice(null);
    try { const response = await adminApi.users.remove(selectedUsers); setNotice({ tone: 'success', message: `${response.data.deletedCount ?? selectedUsers.length}명을 삭제했습니다.` }); setSelected(new Set()); await load(); }
    catch(errorValue) { setNotice({ tone: 'error', message: getApiErrorMessage(errorValue, '사용자를 삭제하지 못했습니다.') }); }
    finally { setBusy(false); }
  };
  const columns = [
    { key: 'rawAcademyName', label: '학원' }, { key: 'rawUserId', label: '사용자 ID' }, { key: 'rawUserName', label: '이름' }, { key: 'userType', label: '구분' },
    { key: 'ok', label: '계정 상태', render: row => <Badge tone={row.ok ? 'success' : 'danger'}>{row.ok ? '활성' : '정지'}</Badge> },
  ];
  return <>
    <PageHeading eyebrow="USERS" title="회원 관리" description="학생·교사·관리자 계정을 등록하고 상태를 확인합니다." action={<Button onClick={openCreate}>새 회원 등록</Button>} />
    <Notice notice={notice} />
    <section className="panel"><div className="panel-header"><div><h2 className="panel-title">전체 회원</h2><p className="panel-subtitle">총 {rows.length}명 · {selected.size}명 선택</p></div></div><div className="toolbar"><input className="search-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="학원, ID, 이름으로 검색" /><div className="toolbar-actions"><Button variant="secondary" disabled={selected.size !== 1 || busy} onClick={openEdit}>정보 변경</Button><Button variant="danger" disabled={!selected.size || busy} onClick={remove}>삭제</Button></div></div>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : <DataTable columns={columns} rows={filtered} rowKey={key} selectedKeys={selected} onSelect={setSelected} />}</section>
    <Modal open={Boolean(modal)} title={modal === 'create' ? '새 회원 등록' : '회원 정보 변경'} onClose={() => setModal(null)} footer={<><Button variant="ghost" onClick={() => setModal(null)}>취소</Button><Button type="submit" form="user-form" disabled={busy}>저장</Button></>}>
      <form id="user-form" onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="user-id">사용자 ID</label><input id="user-id" className="input" required disabled={modal === 'edit'} value={form.userId} onChange={event => setForm(value => ({ ...value, userId: event.target.value }))} /></div><div className="field"><label htmlFor="user-name">이름</label><input id="user-name" className="input" required disabled={modal === 'edit'} value={form.userName} onChange={event => setForm(value => ({ ...value, userName: event.target.value }))} /></div><div className="field"><label htmlFor="user-password">{modal === 'edit' ? '새 비밀번호 (변경 시에만)' : '비밀번호'}</label><input id="user-password" className="input" type="password" required={modal === 'create'} value={form.password} onChange={event => setForm(value => ({ ...value, password: event.target.value }))} /></div><div className="field"><label htmlFor="user-academy">학원</label><select id="user-academy" className="select" required disabled={modal === 'edit'} value={form.hashedAcademyId} onChange={event => setForm(value => ({ ...value, hashedAcademyId: event.target.value }))}><option value="">학원 선택</option>{academies.map(academy => <option key={academy.hashedAcademyId} value={academy.hashedAcademyId}>{academy.academyName}</option>)}</select></div><div className="field"><label htmlFor="user-type">사용자 구분</label><select id="user-type" className="select" value={form.userType} onChange={event => setForm(value => ({ ...value, userType: event.target.value }))}><option>학생</option><option>교사</option><option>관리자</option></select></div></div>{formError && <p className="form-error" role="alert">{formError}</p>}</form>
    </Modal>
  </>;
}

export default function TeacherManagementScreen() {
  const [active, setActive] = useState('academy');
  const [academy, setAcademy] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async() => {
    setLoading(true); setError('');
    try {
      const [academyResponse, rosterResponse] = await Promise.all([adminApi.teacher.academy(), adminApi.teacher.roster()]);
      setAcademy(academyResponse.data.myAcademy || null);
      setStudentCount(Number(academyResponse.data.myAcademyStudent || 0));
      setRoster(Array.isArray(rosterResponse.data.myAcademyStudent) ? rosterResponse.data.myAcademyStudent : []);
    } catch(errorValue) { setError(getApiErrorMessage(errorValue, '학원 정보를 불러오지 못했습니다.')); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const students = useMemo(() => roster.filter(user => user.userType === '학생'), [roster]);
  return <AdminShell role="교사" active={active} onChange={setActive} items={items}>
    {active === 'academy' && <AcademyPanel academy={academy} studentCount={studentCount} roster={roster} loading={loading} error={error} reload={load} />}
    {active === 'records' && <RecordsPanel students={students} />}
    {active === 'users' && <UsersPanel students={students} />}
  </AdminShell>;
}
