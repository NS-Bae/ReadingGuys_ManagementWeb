import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getApiErrorMessage } from '../api';
import { adminApi } from '../utils/adminApi';
import { Badge, Button, DataTable, ErrorState, LoadingState, Modal, formatDate } from './ui';

const difficultyLabels = { easy: '초급', normal: '중급', hard: '고급', 초급: '초급', 중급: '중급', 고급: '고급' };
const categoryLabels = { 인문철학: '인문/철학', 사회문화: '사회/문화', 과학기술: '과학/기술', 예술체육: '예술/체육', 융합: '융합' };
const termsLabels = { service: '이용약관', privacy: '개인정보 처리방침', credits: '제작 정보', about: '사업자 정보' };

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

export function AcademiesPanel() {
  const loader = useCallback(() => adminApi.academies.list(), []);
  const { rows, loading, error, load } = useRemoteList(loader);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ academyId: '', academyName: '' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => rows.filter(row => `${row.academyName} ${row.hashedAcademyId}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const picked = () => selectedRows(rows, selected, row => row.hashedAcademyId);
  const runBulk = async(action, confirmMessage, successWord) => {
    const targets = picked();
    if(!targets.length || !window.confirm(confirmMessage)) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await action(targets);
      const count = response.data.updatedCount ?? response.data.deletedCount ?? targets.length;
      setNotice({ tone: 'success', message: `${count}개 학원의 ${successWord} 처리가 완료되었습니다.` });
      setSelected(new Set());
      await load();
    } catch(errorValue) {
      setNotice({ tone: 'error', message: getApiErrorMessage(errorValue, `${successWord} 처리에 실패했습니다.`) });
    } finally { setBusy(false); }
  };
  const create = async(event) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    setFormError('');
    try {
      const response = await adminApi.academies.create(form.academyId.trim(), form.academyName.trim());
      setNotice({ tone: 'success', message: `${response.data.createdCount ?? 1}개 학원을 등록했습니다.` });
      setForm({ academyId: '', academyName: '' });
      setOpen(false);
      await load();
    } catch(errorValue) {
      setFormError(getApiErrorMessage(errorValue, '학원을 등록하지 못했습니다.'));
    } finally { setBusy(false); }
  };
  const columns = [
    { key: 'academyName', label: '학원명' },
    { key: 'paymentStatus', label: '구독 상태', render: row => <Badge tone={row.paymentStatus ? 'success' : 'danger'}>{row.paymentStatus ? '사용 중' : '만료'}</Badge> },
    { key: 'startMonth', label: '구독 시작', render: row => formatDate(row.startMonth) },
    { key: 'endMonth', label: '구독 종료', render: row => formatDate(row.endMonth) },
  ];
  return <>
    <PageHeading eyebrow="ACADEMY" title="학원 관리" description="등록된 학원과 구독 상태를 한 번에 관리합니다." action={<Button onClick={() => { setFormError(''); setOpen(true); }}>새 학원 등록</Button>} />
    <Notice notice={notice} />
    <section className="panel">
      <div className="panel-header"><div><h2 className="panel-title">전체 학원</h2><p className="panel-subtitle">총 {rows.length}개 · {selected.size}개 선택</p></div></div>
      <div className="toolbar"><input className="search-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="학원명으로 검색" /><div className="toolbar-actions"><Button variant="secondary" disabled={!selected.size || busy} onClick={() => runBulk(adminApi.academies.renew, '선택한 학원의 구독을 이번 달 말까지 갱신할까요?', '구독 갱신')}>구독 갱신</Button><Button variant="danger" disabled={!selected.size || busy} onClick={() => runBulk(adminApi.academies.remove, '선택한 학원을 삭제할까요? 관련 데이터에 영향을 줄 수 있습니다.', '삭제')}>삭제</Button></div></div>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : <DataTable columns={columns} rows={filtered} rowKey={row => row.hashedAcademyId} selectedKeys={selected} onSelect={setSelected} />}
    </section>
    <Modal open={open} title="새 학원 등록" onClose={() => setOpen(false)} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>취소</Button><Button type="submit" form="academy-form" disabled={busy}>등록</Button></>}>
      <form id="academy-form" onSubmit={create}><div className="field"><label htmlFor="academy-id">학원 ID</label><input id="academy-id" className="input" required value={form.academyId} onChange={event => setForm(value => ({ ...value, academyId: event.target.value }))} autoComplete="off" /></div><div className="field"><label htmlFor="academy-name">학원명</label><input id="academy-name" className="input" required value={form.academyName} onChange={event => setForm(value => ({ ...value, academyName: event.target.value }))} /></div>{formError && <p className="form-error" role="alert">{formError}</p>}</form>
    </Modal>
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

export function WorkbooksPanel() {
  const loader = useCallback(() => adminApi.workbooks.list(), []);
  const { rows, loading, error, load } = useRemoteList(loader);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ workbookName: '', releaseMonth: new Date().toISOString().slice(0, 10), Difficulty: 'easy', Category: '인문철학', isPaid: 'false', file: null });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [formError, setFormError] = useState('');
  const filtered = useMemo(() => rows.filter(row => `${row.workbookName} ${row.Difficulty} ${row.WorkbookCategory}`.toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const targets = () => selectedRows(rows, selected, row => String(row.workbookId));
  const upload = async(event) => {
    event.preventDefault();
    if(!form.file) { setFormError('업로드할 ZIP 파일을 선택해 주세요.'); return; }
    const data = new FormData();
    ['workbookName', 'releaseMonth', 'Difficulty', 'Category', 'isPaid'].forEach(key => data.append(key, form[key]));
    data.append('file', form.file);
    setBusy(true); setFormError(''); setNotice({ tone: 'info', message: '문제집을 업로드하고 있습니다. 파일 크기에 따라 시간이 걸릴 수 있습니다.' });
    try { const response = await adminApi.workbooks.upload(data); setNotice({ tone: 'success', message: response.data.message || '문제집을 등록했습니다.' }); setOpen(false); await load(); }
    catch(errorValue) { setNotice(null); setFormError(getApiErrorMessage(errorValue, '문제집을 업로드하지 못했습니다.')); }
    finally { setBusy(false); }
  };
  const toggle = async(row) => {
    if(!window.confirm(`'${row.workbookName}' 문제집의 유료/무료 상태를 바꿀까요?`)) return;
    setBusy(true); setNotice(null);
    try { const response = await adminApi.workbooks.togglePaid(row); setNotice({ tone: 'success', message: `${response.data.updatedCount ?? 1}개 문제집의 상태를 변경했습니다.` }); await load(); }
    catch(errorValue) { setNotice({ tone: 'error', message: getApiErrorMessage(errorValue, '공개 상태를 변경하지 못했습니다.') }); }
    finally { setBusy(false); }
  };
  const remove = async() => {
    const books = targets(); if(!books.length || !window.confirm(`선택한 ${books.length}개 문제집을 삭제할까요?`)) return;
    setBusy(true); setNotice(null);
    try { const response = await adminApi.workbooks.remove(books); setNotice({ tone: 'success', message: `${response.data.deletedCount ?? books.length}개 문제집을 삭제했습니다.` }); setSelected(new Set()); await load(); }
    catch(errorValue) { setNotice({ tone: 'error', message: getApiErrorMessage(errorValue, '문제집을 삭제하지 못했습니다.') }); }
    finally { setBusy(false); }
  };
  const columns = [
    { key: 'workbookId', label: '번호' }, { key: 'workbookName', label: '문제집명' }, { key: 'releaseMonth', label: '출시일', render: row => formatDate(row.releaseMonth) },
    { key: 'Difficulty', label: '난이도', render: row => difficultyLabels[row.Difficulty] || row.Difficulty || '-' }, { key: 'WorkbookCategory', label: '분야', render: row => categoryLabels[row.WorkbookCategory] || row.WorkbookCategory || '융합' },
    { key: 'isPaid', label: '이용 구분', render: row => <Badge tone={row.isPaid ? 'warning' : 'success'}>{row.isPaid ? '유료' : '무료'}</Badge> },
    { key: 'action', label: '상태 변경', render: row => <Button small variant="ghost" disabled={busy} onClick={() => toggle(row)}>{row.isPaid ? '무료로 변경' : '유료로 변경'}</Button> },
  ];
  return <>
    <PageHeading eyebrow="WORKBOOKS" title="문제집 관리" description="독해 문제집의 난이도·분야·이용 구분을 관리합니다." action={<Button onClick={() => { setFormError(''); setOpen(true); }}>문제집 업로드</Button>} />
    <Notice notice={notice} />
    <section className="panel"><div className="panel-header"><div><h2 className="panel-title">문제집 라이브러리</h2><p className="panel-subtitle">총 {rows.length}권 · {selected.size}권 선택</p></div></div><div className="toolbar"><input className="search-input" value={search} onChange={event => setSearch(event.target.value)} placeholder="문제집명, 난이도, 분야로 검색" /><div className="toolbar-actions"><Button variant="danger" disabled={!selected.size || busy} onClick={remove}>삭제</Button></div></div>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : <DataTable columns={columns} rows={filtered} rowKey={row => String(row.workbookId)} selectedKeys={selected} onSelect={setSelected} />}</section>
    <Modal open={open} title="새 문제집 업로드" onClose={() => !busy && setOpen(false)} footer={<><Button variant="ghost" disabled={busy} onClick={() => setOpen(false)}>취소</Button><Button type="submit" form="workbook-form" disabled={busy}>{busy ? '업로드 중…' : '업로드'}</Button></>}>
      <form id="workbook-form" onSubmit={upload}><div className="form-grid"><div className="field"><label htmlFor="book-name">문제집명</label><input id="book-name" className="input" required value={form.workbookName} onChange={event => setForm(value => ({ ...value, workbookName: event.target.value }))} /></div><div className="field"><label htmlFor="book-date">출시일</label><input id="book-date" className="input" type="date" required value={form.releaseMonth} onChange={event => setForm(value => ({ ...value, releaseMonth: event.target.value }))} /></div><div className="field"><label htmlFor="book-difficulty">난이도</label><select id="book-difficulty" className="select" value={form.Difficulty} onChange={event => setForm(value => ({ ...value, Difficulty: event.target.value }))}><option value="easy">초급</option><option value="normal">중급</option><option value="hard">고급</option></select></div><div className="field"><label htmlFor="book-category">분야</label><select id="book-category" className="select" value={form.Category} onChange={event => setForm(value => ({ ...value, Category: event.target.value }))}>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="field"><label htmlFor="book-paid">이용 구분</label><select id="book-paid" className="select" value={form.isPaid} onChange={event => setForm(value => ({ ...value, isPaid: event.target.value }))}><option value="false">무료</option><option value="true">유료</option></select></div><div className="field"><label htmlFor="book-file">문제집 ZIP 파일</label><input id="book-file" className="input file-input" type="file" accept=".zip,application/zip" required onChange={event => setForm(value => ({ ...value, file: event.target.files?.[0] || null }))} /></div></div>{formError && <p className="form-error" role="alert">{formError}</p>}</form>
    </Modal>
  </>;
}

export function TermsPanel() {
  const [type, setType] = useState('service');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ title: '', Version: '', effectiveDate: new Date().toISOString().slice(0, 16), contents: '' });
  const load = useCallback(async() => {
    setLoading(true); setError('');
    try { const response = await adminApi.terms.list(type); setRows(Array.isArray(response.data) ? response.data : []); }
    catch(errorValue) { setError(getApiErrorMessage(errorValue, '문서 목록을 불러오지 못했습니다.')); }
    finally { setLoading(false); }
  }, [type]);
  useEffect(() => { void load(); }, [load]);
  const create = async(event) => {
    event.preventDefault(); setBusy(true); setNotice(null); setFormError('');
    try { const response = await adminApi.terms.create({ main: type, ...form }); setNotice({ tone: 'success', message: response.data.message || '새 문서를 등록했습니다.' }); setEditorOpen(false); setForm({ title: '', Version: '', effectiveDate: new Date().toISOString().slice(0, 16), contents: '' }); await load(); }
    catch(errorValue) { setFormError(getApiErrorMessage(errorValue, '문서를 등록하지 못했습니다.')); }
    finally { setBusy(false); }
  };
  const activate = async(row) => {
    if(row.status === 'ACTIVE' || !window.confirm(`'${row.title}' 문서를 현재 활성 문서로 지정할까요?`)) return;
    setBusy(true); setNotice(null);
    try { const response = await adminApi.terms.activate(type, row.id); setNotice({ tone: 'success', message: response.data.message || '문서를 활성화했습니다.' }); await load(); }
    catch(errorValue) { setNotice({ tone: 'error', message: getApiErrorMessage(errorValue, '문서를 활성화하지 못했습니다.') }); }
    finally { setBusy(false); }
  };
  const read = async(row) => {
    setBusy(true); setNotice(null);
    try { const response = await adminApi.terms.read(row.id); setPreview(response.data); }
    catch(errorValue) { setNotice({ tone: 'error', message: getApiErrorMessage(errorValue, '문서 본문을 읽지 못했습니다.') }); }
    finally { setBusy(false); }
  };
  const columns = [
    { key: 'title', label: '제목' }, { key: 'Version', label: '버전' }, { key: 'effectiveDate', label: '시행일', render: row => formatDate(row.effectiveDate, true) }, { key: 'createdAt', label: '등록일', render: row => formatDate(row.createdAt, true) },
    { key: 'status', label: '상태', render: row => <Badge tone={row.status === 'ACTIVE' ? 'success' : 'neutral'}>{row.status === 'ACTIVE' ? '활성' : '대기'}</Badge> },
    { key: 'actions', label: '작업', render: row => <div className="button-row"><Button small variant="ghost" disabled={busy} onClick={() => read(row)}>본문 보기</Button><Button small variant="secondary" disabled={busy || row.status === 'ACTIVE'} onClick={() => activate(row)}>활성화</Button></div> },
  ];
  return <>
    <PageHeading eyebrow="DOCUMENTS" title="약관·앱 정보" description="앱에서 표시할 문서를 버전별로 등록하고 활성 문서를 지정합니다." action={<Button onClick={() => { setFormError(''); setEditorOpen(true); }}>새 문서 등록</Button>} />
    <Notice notice={notice} />
    <section className="panel"><div className="panel-header"><div><h2 className="panel-title">문서 이력</h2><p className="panel-subtitle">한 종류에서 한 문서만 활성화할 수 있습니다.</p></div><select className="select type-select" value={type} onChange={event => setType(event.target.value)}>{Object.entries(termsLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : <DataTable columns={columns} rows={rows} rowKey={row => String(row.id)} />}</section>
    <Modal open={editorOpen} title={`${termsLabels[type]} 등록`} wide onClose={() => !busy && setEditorOpen(false)} footer={<><Button variant="ghost" disabled={busy} onClick={() => setEditorOpen(false)}>취소</Button><Button type="submit" form="terms-form" disabled={busy}>{busy ? '저장 중…' : '저장'}</Button></>}>
      <form id="terms-form" onSubmit={create}><div className="form-grid"><div className="field"><label htmlFor="terms-title">문서 제목</label><input id="terms-title" className="input" required maxLength="100" value={form.title} onChange={event => setForm(value => ({ ...value, title: event.target.value }))} /></div><div className="field"><label htmlFor="terms-version">버전</label><input id="terms-version" className="input" required maxLength="45" placeholder="예: 1.0.0" value={form.Version} onChange={event => setForm(value => ({ ...value, Version: event.target.value }))} /></div><div className="field"><label htmlFor="terms-date">시행 일시</label><input id="terms-date" className="input" type="datetime-local" required value={form.effectiveDate} onChange={event => setForm(value => ({ ...value, effectiveDate: event.target.value }))} /></div></div>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="editor-grid"><div className="editor-pane field"><label htmlFor="terms-content">Markdown 본문</label><textarea id="terms-content" className="textarea" required value={form.contents} onChange={event => setForm(value => ({ ...value, contents: event.target.value }))} /></div><div className="editor-pane"><p className="field-label">미리보기</p><div className="markdown-preview"><ReactMarkdown remarkPlugins={[remarkGfm]}>{form.contents || '본문을 입력하면 여기에 미리보기가 표시됩니다.'}</ReactMarkdown></div></div></div></form>
    </Modal>
    <Modal open={Boolean(preview)} title={preview?.title || '문서 본문'} wide onClose={() => setPreview(null)} footer={<Button onClick={() => setPreview(null)}>닫기</Button>}><div className="document-meta"><Badge tone={preview?.status === 'ACTIVE' ? 'success' : 'neutral'}>{preview?.status === 'ACTIVE' ? '활성' : '대기'}</Badge><span>버전 {preview?.Version || '-'}</span><span>시행 {formatDate(preview?.effectiveDate, true)}</span></div><article className="markdown-preview document-preview"><ReactMarkdown remarkPlugins={[remarkGfm]}>{preview?.content || ''}</ReactMarkdown></article></Modal>
  </>;
}
