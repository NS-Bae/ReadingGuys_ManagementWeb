import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* import api from '../api'; */
import MainLogo from '../components/main_logo';
import LoginControl from '../components/loginControl';
import NavBar from '../components/nav_Bar';
import InfoTable from '../components/infoTable';
import CustomModal from '../components/alert';
import ListModal from '../components/listModal';
import ExamRecord from '../components/examRecord';

import { verifyCookies } from '../utils/info.js';
import { ManagerLogOut } from '../utils/auth.js';
import { searchMyAcademy, searchMyAcademyStudent, searchMyAcademyAllStudentRecord, searchMyAcademyOneStudentRecord } from '../utils/search.js';

function MyApp() 
{
  const [category, setCategory] = useState('basic');
  const [alertMessage, setAlertMessage] = useState('');
  const [stateId, setStateId] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [academyInfo, setAcademyInfo] = useState([]);
  const [stuInfo, setStuInfo] = useState([]);//소속인원 전부
  const [stuList, setStuList] = useState([]);//소속 학생만
  const [recordInfo, setRecordInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const pageId = 'teacher';
  const columns = [
    { key: "1", label: "사용자 ID" },
    { key: "2", label: "사용자 이름" },
    { key: "3", label: "사용자 분류" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const result = verifyCookies('forManager');

    switch(result.status)
    {
      case 'noToken':
        setAlertMessage(result.message);
        setIsModalOpen(true);
        setStateId('notLogin');
        return;
      case 'managerAuthorized' || 'studentAuthorized':
        setAlertMessage(result.message);
        setIsModalOpen(true);
        setStateId(result.userType);
        return;
      case 'invalid':
        setAlertMessage(result.message);
        setIsModalOpen(true);
        setStateId(result.userType);
        return;
      default:
        setStateId(result.userType);
        break;
    }
  }, [navigate]);
  useEffect(() => {
    getAcademyInfo();
    getAcademyStudentList();
  }, []);

  const handleLogout = async(e) => {
    try
    {
      await ManagerLogOut();
      setStateId(e.target.id);
      setAlertMessage('로그아웃에 성공했습니다. 로그아웃 페이지로 넘어갑니다.');
      setIsModalOpen(true);
    }
    catch(error)
    {
      console.error("로그아웃 실패:", error);
      alert("알 수 없는 이유로 로그아웃에 실패했습니다")
    }
  };
  const handleConfirm = () => {
    console.log("확인 버튼을 클릭",category);
    setIsModalOpen(false);
    if(stateId === 'logout' || stateId === '학생' || stateId === 'notLogin')
    {
      navigate('/');
    }
    else if(stateId === '관리자')
    {
      navigate('/managementPage');
    }
  };
  const handleCancel = () => {
    console.log("취소 버튼을 클릭");
    setIsModalOpen(false);
    if(stateId === 'logout' || stateId === '학생' || stateId === 'notLogin')
    {
      navigate('/');
    }
    else if(stateId === '관리자')
    {
      navigate('/managementPage');
    }
  };
  const handleListModalConfirm = () => {
    setIsListModalOpen(false);
  };
  const handleListModalCancel = () => {
    setIsListModalOpen(false);
  };
  const onNavbarButtonClick = (e) => {
    setCategory(e.target.id);
    if(e.target.id === 'academy')
    {
      getAcademyInfo();
    }
    console.log(stuList);
  };
  const clickDetail = () => {
    getAcademyStudentList();
    setIsListModalOpen(true);
  };

  async function getAcademyInfo()
  {
    try
    {
      const result = await searchMyAcademy();
      setAcademyInfo(result.data.myAcademy);
      setUserCount(result.data.myAcademyStudent);
    }
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }
  };
  async function getAcademyStudentList()
  {
    try
    {
      const result = await searchMyAcademyStudent();
      const refineData = result.data.myAcademyStudent
        .filter(({userType}) => userType === '학생')
        .map(({hashedUserId, rawUserId, rawUserName}) => ({hashedUserId, rawUserId, rawUserName}));
      setStuList(refineData);
      setStuInfo(result.data.myAcademyStudent);
    }
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }
  };
  async function getExamRecord(data)
  {
    if(data === 'all')
    {
      try
      {
        const result = await searchMyAcademyAllStudentRecord();
        setRecordInfo(result.data);
      }
      catch(error)
      {
        console.error('데이터 로딩 실패', error);
      }
    }
    if(data !== '' && data !== 'all')
    {
      try
      {
        const result = await searchMyAcademyOneStudentRecord(data);
        setRecordInfo(result.data);
      }
      catch(error)
      {
        console.error('데이터 로딩 실패', error);
      }
    }
  };

  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <LoginControl handleLogout={handleLogout} />
        <NavBar pageId={pageId} onButtonClick={onNavbarButtonClick} />
        <div className='basicspace'>
          {category==='academy' && (
            <InfoTable category={category} info={academyInfo} userCount={userCount} />
          )}
          {category==='check_stdent_state' && (
            <ExamRecord category={category} stuList={stuList} info={recordInfo} getExamRecord={getExamRecord} />
          )}
        </div>
        <div className='btn_section'>
        {category !== 'basic' && (
          <>
          {category === "academy" && (
            <button id='detail' className='normal_btn' onClick={clickDetail} >소속 학생보기</button>
          )}
          {category === "check_stdent_state" && (
            <button id='changePW' className='normal_btn' ></button>
          )}
          </>
        )}
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        message={alertMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ListModal
        isOpen={isListModalOpen}
        onConfirm={handleListModalConfirm}
        onCancel={handleListModalCancel}
        columns={columns}
        info={stuInfo}
        category={category}
      />
    </div>
  );
}
export default MyApp;