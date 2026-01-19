import '../App.css';
import React, { useEffect, useState, useCallback } from 'react';
import { alignItems, flexDirection, maxWidth, minHeight } from '@mui/system';

import api from '../api';
import SidebarAccordion from './sideSubNavBar';
import TermsMarkdownEditor from './termsEditor';

const Terms = ({ category, forceRender, handleCheckboxChange, handleToggle }) => {
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState({
    main : 'none',
    action : 'none',
  });

  const renderContent = () => {
    if (activeMenu.main === 'privacy' && activeMenu.action === 'edit') {
      return <div backgroundColor='red'><p>개인정보 처리방침 편집 에디터</p></div>;
    }
    if (activeMenu.main === 'privacy' && activeMenu.action === 'history') {
      return <div>개인정보 처리방침 버전 히스토리</div>;
    }
    if (activeMenu.main === 'service' && activeMenu.action === 'edit') {
      return <div><TermsMarkdownEditor /></div>;
    }
    if (activeMenu.main === 'service' && activeMenu.action === 'history') {
      return <div>이용약관 버전 히스토리</div>;
    }
    if (activeMenu.main === 'credits' && activeMenu.action === 'edit') {
      return <div>크레딧 편집 에디터</div>;
    }
    if (activeMenu.main === 'credits' && activeMenu.action === 'history') {
      return <div>크레딧 버전 히스토리</div>;
    }
    if (activeMenu.main === 'about' && activeMenu.action === 'edit') {
      return <div>사업자 정보 편집 에디터</div>;
    }
    if (activeMenu.main === 'about' && activeMenu.action === 'history') {
      return <div>사업자 정보 버전 히스토리</div>;
    }

    return <div>none</div>;
  };

  const handleActiveType = ({ main, action }) => {
    setActiveMenu({ main, action });
  }

  const getAllTerms = useCallback( async() => {
    setLoading(true);

    try
    {
      const response = await api.get('/terms/alllist');
    }
    catch(error)
    {
      console.error('약관로딩 실패', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
      getAllTerms();
      console.log(activeMenu);
    }, [forceRender, getAllTerms]);

  return (
    <div style={ bigBox }>
      <div style = { leftBox }><SidebarAccordion active={activeMenu} onChange={handleActiveType} /></div>
      <div style={ rightBox }>{ loading ? <p>데이터 불러오는 중...</p> : renderContent() }</div>
    </div>
  );
}

export default Terms;

const bigBox = {
  display: 'flex',
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  padding: '10px',
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: 'yellow',
  margin: 0,
  padding: 0,
};
const leftBox = {
  display: 'flex',
  width: '20%',
  maxWidth: 280,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginTop: 0,
  paddingTop: 0,
  backgroundColor: 'green'
};
const rightBox = {
  display: 'flex',
  width: '80%',
  minHeight: '70vh',
  justifyContent: 'flex-start',
  backgroundColor: 'red',
};
