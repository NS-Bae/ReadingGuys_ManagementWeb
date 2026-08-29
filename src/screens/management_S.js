import React, { useState } from 'react';
import '../App.css';
import AdminShell from '../components/AdminShell';
import { AcademiesPanel, TermsPanel, WorkbooksPanel } from '../components/adminPanels';

const items = [
  { key: 'academies', label: '학원 관리' },
  { key: 'workbooks', label: '문제집 관리' },
  { key: 'terms', label: '약관·앱 정보' },
];

export default function ManagementScreen() {
  const [active, setActive] = useState('academies');
  return (
    <AdminShell role="관리자" active={active} onChange={setActive} items={items}>
      {active === 'academies' && <AcademiesPanel />}
      {active === 'workbooks' && <WorkbooksPanel />}
      {active === 'terms' && <TermsPanel />}
    </AdminShell>
  );
}
