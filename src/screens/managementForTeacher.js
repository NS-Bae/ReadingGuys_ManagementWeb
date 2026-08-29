import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../App.css';
import { getApiErrorMessage } from '../api';
import AdminShell from '../components/AdminShell';
import { Badge, Button, DataTable, ErrorState, LoadingState, formatDate } from '../components/ui';
import { adminApi } from '../utils/adminApi';

const items = [
  { key: 'academy', label: '내 학원' },
  { key: 'records', label: '학습 기록' },
];

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
  </AdminShell>;
}
