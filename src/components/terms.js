import '../App.css';
import React, { useEffect, useState, useCallback } from 'react';

import api from '../api';
import SidebarAccordion from './sideSubNavBar';
import TermsMarkdownEditor from './termsEditor';
import TermsList from './termsList';

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
  });
  const [list, setList] = useState();

  const columns = [
    { key: "1", label: "ID" },
    { key: "2", label: "파일 이름" },
    { key: "3", label: "작성일" },
    { key: "4", label: "작성자" },
    { key: "5", label: "시행일" },
    { key: "6", label: "활성화" },
    { key: "7", label: "미리보기" },
  ];

  const renderContent = () => {
    if (activeMenu.main === 'privacy' && activeMenu.action === 'edit') {
      return <div style={ rightContent }><TermsMarkdownEditor title='개인정보 처리방침 작성' value={documents.privacy} onChange={(txt) => handleChangeText('privacy', txt)} /></div>;
    }
    if (activeMenu.main === 'privacy' && activeMenu.action === 'history') {
      return <TermsList title='개인정보 처리방침' columns = {columns} info = {list} handleToggle = {getAllTerms} />;
    }
    if (activeMenu.main === 'service' && activeMenu.action === 'edit') {
      return <div style={ rightContent }><TermsMarkdownEditor title='이용약관 작성' value={documents.service} onChange={(txt) => handleChangeText('service', txt)} /></div>;
    }
    if (activeMenu.main === 'service' && activeMenu.action === 'history') {
      return <TermsList title='이용약관' columns = {columns} info = {list} handleToggle = {getAllTerms} />;
    }
    if (activeMenu.main === 'credits' && activeMenu.action === 'edit') {
      return <div style={ rightContent }><TermsMarkdownEditor title='크레딧 작성' value={documents.credits} onChange={(txt) => handleChangeText('credits', txt)} /></div>;
    }
    if (activeMenu.main === 'credits' && activeMenu.action === 'history') {
      return <TermsList title='크레딧' columns = {columns} info = {list} handleToggle = {getAllTerms} />;
    }
    if (activeMenu.main === 'about' && activeMenu.action === 'edit') {
      return <div style={ rightContent }><TermsMarkdownEditor title='사업자 정보 작성' value={documents.about} onChange={(txt) => handleChangeText('about', txt)} /></div>;
    }
    if (activeMenu.main === 'about' && activeMenu.action === 'history') {
      return <TermsList title='사업자 정보' columns = {columns} info = {list} handleToggle = {getAllTerms} />;
    }

    return <div></div>;
  };

  const handleActiveType = ({ main, action }) => {
    forceRender++;
    setActiveMenu({ main, action });
  };
  const handleChangeText = ( type, text ) => {
    setDocuments(prev => ({
      ...prev,
      [type]: text,
    }));
  };

  const clickAddButton = async() => {
    const { main } = activeMenu;
    const contents = documents[main];
    try
    {
      const response = await api.post('/agreement/adddata', { contents, main });
    }
    catch(error)
    {
      console.error('약관을 등록하지 못했습니다.');
    }
  };

  const getAllTerms = async () => {
    const { main } = activeMenu;
    try
    {
      const response = await api.get('/agreement/alllist', { params: { main }, });

      setList(response.data);
    }
    catch(error)
    {
      console.error('약관로딩 실패', error);
    }
  };

  useEffect(() => {
      getAllTerms();
      console.log(list);
    }, [forceRender, activeMenu]);

  return (
    <>
      <div style={ bigBox }>
        <div style = { leftBox }><SidebarAccordion active={activeMenu} onChange={handleActiveType} /></div>
        <div style={ rightBox }>{ renderContent() }</div>
      </div>
      <div style = { buttonBox }>
        {activeMenu.main !== 'none' && activeMenu.action === 'edit' && <button id='add' style={ normalButton } onClick={clickAddButton}>등록하기</button>}
      </div>
    </>
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
const rightContent = {
  display: 'flex',
  width: '100%',
  height: '100%',
};
const buttonBox = {
  display: 'flex',
  minHeight: '6vh',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: '15px',
};
const normalButton = {
  backgroundColor: 'white',
  border: 0,
  textAlign: 'center',
  fontSize: '1.3em',
  fontWeight: 'bold',
  cursor: 'pointer',
}