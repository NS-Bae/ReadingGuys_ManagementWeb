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
  const [documents, setDocuments] = useState({
    privacy: '',
    service: '',
    credits: '',
    about: '',
  })

  const renderContent = () => {
    if (activeMenu.main === 'privacy' && activeMenu.action === 'edit') {
      return <div style={ RightContent }><TermsMarkdownEditor title='개인정보 처리방침 작성' value={documents.privacy} onChange={(txt) => handleChangeText('privacy', txt)} /></div>;
    }
    if (activeMenu.main === 'privacy' && activeMenu.action === 'history') {
      return <div>개인정보 처리방침 버전 히스토리</div>;
    }
    if (activeMenu.main === 'service' && activeMenu.action === 'edit') {
      return <div style={ RightContent }><TermsMarkdownEditor title='이용약관 작성' value={documents.service} onChange={(txt) => handleChangeText('service', txt)} /></div>;
    }
    if (activeMenu.main === 'service' && activeMenu.action === 'history') {
      return <div>이용약관 버전 히스토리</div>;
    }
    if (activeMenu.main === 'credits' && activeMenu.action === 'edit') {
      return <div style={ RightContent }><TermsMarkdownEditor title='크레딧 작성' value={documents.credits} onChange={(txt) => handleChangeText('credits', txt)} /></div>;
    }
    if (activeMenu.main === 'credits' && activeMenu.action === 'history') {
      return <div>크레딧 버전 히스토리</div>;
    }
    if (activeMenu.main === 'about' && activeMenu.action === 'edit') {
      return <div style={ RightContent }><TermsMarkdownEditor title='사업자 정보 작성' value={documents.about} onChange={(txt) => handleChangeText('about', txt)} /></div>;
    }
    if (activeMenu.main === 'about' && activeMenu.action === 'history') {
      return <div>사업자 정보 버전 히스토리</div>;
    }

    return <div>none</div>;
  };

  const handleActiveType = ({ main, action }) => {
    setActiveMenu({ main, action });
  };
  const handleChangeText = ( type, text ) => {
    setDocuments(prev => ({
      ...prev,
      [type]: text,
    }));
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
  margin: 0,
  padding: 0,
};
const leftBox = {
  display: 'flex',
  width: '20%',
  maxWidth: 300,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginTop: 0,
  paddingTop: 0,
};
const rightBox = {
  display: 'flex',
  width: '78%',
  height: '100%',
  minHeight: '70vh',
  justifyContent: 'flex-start',
};
const RightContent = {
  display: 'flex',
  width: '100%',
  height: '100%',
};
