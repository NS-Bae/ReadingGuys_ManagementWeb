import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import api from '../api';
import MainLogo from '../components/main_logo';
import LoginControl from '../components/loginControl';
import NavBar from '../components/nav_Bar';
import InfoTable from '../components/infoTable';
import CustomModal from '../components/alert';
import ListModal from '../components/listModal';
import ExamRecord from '../components/examRecord';

function MyApp() 
{
  const [category, setCategory] = useState('basic');
  const [alertMessage, setAlertMessage] = useState('');
  const [stateId, setStateId] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [academyInfo, setAcademyInfo] = useState([]);
  const [stuInfo, setStuInfo] = useState([]);
  const [stuList, setStuList] = useState([]);
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
    const verifyToken = Cookies.get("access_token");
    
    if(!verifyToken)
    {
      setAlertMessage('로그인이 필요합니다.');
      setIsModalOpen(true);
      setStateId('notLogin');
      return;
    }

    try 
    {
      const decoded = jwtDecode(verifyToken);
      setUserInfo(decoded.id);

      if (decoded.userType === "관리자") 
      {
        setAlertMessage('교사용 페이지입니다. 관리자계정이므로 관리자 페이지로 넘어갑니다.');
        setIsModalOpen(true);
        setStateId(decoded.userType);
      }
      if (decoded.userType === "학생") 
      {
        setAlertMessage('접근권한이 없습니다');
        setIsModalOpen(true);
        setStateId(decoded.userType);
      }
    } 
    catch (error) 
    {
      console.error("토큰 디코딩 오류:", error);
    }
  }, [navigate]);
  useEffect(() => {
    if (category === 'check_stdent_state') {
      getAcademyInfo(userInfo);
      getAcademyStudentList(userInfo);
    }
  }, [category]);

  const handleLogout = async(e) => {
    try
    {
      const response = await api.post('/auth/logout', {}, {withCredentials: true});
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
    console.log("확인 버튼을 클릭",category);
    setIsListModalOpen(false);
  };
  const handleListModalCancel = () => {
    console.log("취소 버튼을 클릭");
    setIsListModalOpen(false);
  };
  const onNavbarButtonClick = (e) => {
    setCategory(e.target.id);
    if(e.target.id === 'academy')
    {
      getAcademyInfo(userInfo);
    }
  };

  const clickDetail = () => {
    console.log(isListModalOpen);
    getAcademyStudentList(userInfo);
    setIsListModalOpen(true);
  };

  async function getAcademyInfo(data)
  {
    if(userInfo.length === 0) return ;
    try
    {
      const response = await api.post('/academy/myinfo', {userInfo});
      setAcademyInfo(response.data.myAcademy);
      setUserCount(response.data.myAcademyStudent);
    }
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }
  };
  async function getAcademyStudentList(data)
  {
    if(userInfo.length === 0) return ;
    try
    {
      const response = await api.post('/academy/academystudentlist', {userInfo});
      if(category === 'check_stdent_state')
      {
        const refineData = response.data.myAcademyStudent.map(({id, userName}) => ({id, userName}));
        console.log(refineData);
        setStuList(refineData);
      }
      else
      {
        setStuInfo(response.data.myAcademyStudent);
      }
    }
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }
  };
  async function getExamRecord(data)
  {
    const academyId = academyInfo.academyId;
    console.log(data);
    if(data !== '')
    {
      if(data === 'all')
      {
        try
        {
          const response = await api.post('/records/allstudent', { academyId });
          setRecordInfo(response.data);
        }
        catch(error)
        {
          console.error('데이터 로딩 실패', error);
        }
      }
      else
      {
        try
        {
          const response = await api.post('/records/onestudent', { data, academyId });
          setRecordInfo(response.data);
        }
        catch(error)
        {
          console.error('데이터 로딩 실패', error);
        }
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