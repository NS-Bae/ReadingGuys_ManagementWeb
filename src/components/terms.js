import '../App.css';
import React, { useEffect, useState, useCallback } from 'react';

import api from '../api';
import SidebarAccordion from './sideSubNavBar';

const Terms = ({ category, forceRender, handleCheckboxChange, handleToggle }) => {
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState({
    main : 'none',
    action : 'none',
  });

  const renderContent = () => {
    const { main, action } = activeMenu;

    if (main === 'privacy' && action === 'edit') {
      return <div>개인정보 처리방침 편집 에디터</div>;
    }
    if (main === 'privacy' && action === 'history') {
      return <div>개인정보 처리방침 버전 히스토리</div>;
    }
    if (main === 'service' && action === 'edit') {
      return <div>이용약관 편집 에디터</div>;
    }
    if (main === 'service' && action === 'history') {
      return <div>이용약관 버전 히스토리</div>;
    }
    if (main === 'credits' && action === 'edit') {
      return <div>크레딧 편집 에디터</div>;
    }
    if (main === 'credits' && action === 'history') {
      return <div>크레딧 버전 히스토리</div>;
    }
    if (main === 'about' && action === 'edit') {
      return <div>사업자 정보 편집 에디터</div>;
    }
    if (main === 'about' && action === 'history') {
      return <div>사업자 정보 버전 히스토리</div>;
    }

    return <div>none</div>;
  };

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
    }, [forceRender, getAllTerms]);
  return (
    <div style={ bigBox }>
      <><SidebarAccordion active='' onChange=''/></>
      <>{ loading ? <p>데이터 불러오는 중...</p> : renderContent() }</>
    </div>
  );
}

export default Terms;

const bigBox = {
  display: 'flex',
  width: '100%',
  backgroundColor: 'white',
  padding: '10px',
  flexDirection: 'row',
  justifyContent: 'space-between'
};
