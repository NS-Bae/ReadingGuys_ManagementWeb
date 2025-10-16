import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainLogo from '../components/main_logo';
import LoginControl from '../components/loginControl';
import NavBar from '../components/nav_Bar';
import Academy from '../components/academy';
import Student from '../components/student';
import Workbook from '../components/workbook';
import CustomModal from '../components/alert';
import AddModal from '../components/bigmodal';
import ChangeModal from '../components/midmodal';

import api from '../api';

import { getMyInfo, verifyCookies } from '../utils/info.js';
import { ManagerLogOut } from '../utils/managementData.js';

function MyApp()
{
  const [category, setCategory] = useState('basic');
  const [buttonId, setButtonId] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [stateId, setStateId] = useState('');
  const [checkedRows, setCheckedRows] = useState([]);
  const [bookInfo, setBookInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBigModalOpen, setIsBigModalOpen] = useState(false);
  const [isMidModalOpen, setIsMidModalOpen] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const pageId = 'manager';

  let link = '';
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
      case 'teacherAuthorized' || 'studentAuthorized':
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
    setIsModalOpen(false);
    if(buttonId === 'delete')
    {
      deleteData();
    }
    else if(buttonId === 'novation')
    {
      novationData();
    }
    else if(buttonId === "toggle")
    {
      console.log(bookInfo);
      changeData(bookInfo);
    }
    if(stateId === 'logout' || stateId === '학생' || stateId === 'notLogin')
    {
      navigate('/');
    }
    else if(stateId === '교사')
    {
      navigate('/forT');
    }
    setCheckedRows([]);
    setBookInfo([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    if(stateId === 'logout' || stateId === '학생' || stateId === 'notLogin')
    {
      navigate('/');
    }
    else if(stateId === '교사')
    {
      navigate('/forT');
    }
    setForceRender((prev) => prev + 1);
    setCheckedRows([]);
  };

  const handleAddConfirm = (data) => {
    if(category === 'management_workbook')
    {
      console.log("확인 버튼을 클릭", data, data.length);
      if(data.length === 1)
      { 
        alert("추가할 정보가 없습니다.");
      }
      else
      {
        const formData = new FormData();

        data.forEach((item) => {
          if(item.id && item.value)
          {
            formData.append(item.id, item.value);
          }
        });

        const fileItem = data.find((item) => item instanceof File);
        if(fileItem)
        {
          formData.append("file", fileItem);
        };
        addData(formData);
      }
    }
    else
    {
      console.log("확인 버튼을 클릭", data);
      setIsBigModalOpen(false);
      if(data.length === 0)
      { 
        alert("추가할 정보가 없습니다.");
      }
      else
      {
        addData(data);
      }
    }
  };
  const handleAddCancel = () => {
    console.log("취소 버튼을 클릭", isBigModalOpen);
    setIsBigModalOpen(false);
  };

  const handleChangeConfirm = (data) => {
    console.log("확인 버튼을 클릭", data);
    setIsMidModalOpen(false);
    if(data.length === 0)
    { 
      alert("추가할 정보가 없습니다.");
    }
    else
    {
      const convertedData = Object.keys(data).map(key => {
        const userInfo = data[key];
        const result = { id: key, ...userInfo };
        return result;
      });

      changeData(convertedData);
    }
    setCheckedRows([]);
  };
  const handleChangeCancel = () => {
    console.log("취소 버튼을 클릭", isBigModalOpen);
    setIsMidModalOpen(false);
    setForceRender((prev) => prev + 1);
    setCheckedRows([]);
  };

  const onNavbarButtonClick = (e) => {
    setCategory(e.target.id);
    setCheckedRows([]);
  };
  const handleCheckboxChange = (event, key) => {
    const ischecked = event.target.checked;
    const [data1, data2] = key.split('_');

    if(ischecked)
    {
      setCheckedRows((prevCheckedRows) => [...prevCheckedRows, {data1, data2}]);
    }
    else
    {
      setCheckedRows((prevCheckedRows) => prevCheckedRows.filter((row) => row.data1 !== data1 && row.data2 !== data2));
    }
  };
  const handleToggle = (e) => {
    const [data1, data2] = e.target.id.split('_');
    setBookInfo((prevBookInfo) => [...prevBookInfo, {data1, data2}]);

    setAlertMessage('문제집의 공개상태를 바꾸겠습니까?');
    setButtonId('toggle');
    setIsModalOpen(true);
  }
  const clickAddButton = () => {
    setIsBigModalOpen(true);
  };
  const clickDeleteButton = (e) => {
    if(e.target.id === 'delete' || e.target.id === 'novation')
    {
      e.target.id === 'delete' ? setAlertMessage('진짜로 삭제하시겠습니까?') : setAlertMessage('구독을 갱신하겠습니까?') ;
      console.log(e.target.id, alertMessage);
      setButtonId(e.target.id);
      setIsModalOpen(true);
    }
    else
    {
      console.log('a',e.target.id);
      setIsMidModalOpen(true);
    }
  };
  

  async function deleteData()
  {
    switch(category)
    {
      case "management_academy" : link = 'academy'; break;
      case "management_student" : link = 'users'; break;
      case "management_workbook" : link = 'workbook'; break;
      default: link = ''; break;
    };

    try
    {
      console.log(checkedRows);
      const response = await api.delete(`/${link}/deletedata`, {
        data: {checkedRows},
      });
      console.log("삭제성공", response.data);
      alert(`${response.data.deletedCount}개의 정보를 삭제했습니다`);

      setForceRender((prev) => prev + 1);
    }
    catch(error)
    {
      console.log("삭제 실패", error);
    }
  };
  async function novationData()
  {
    console.log('b', buttonId, checkedRows);
    try
    {
      const response = await api.patch('/academy/novation', {
        checkedRows,
      });
      
      console.log("구독정보 업데이트에 성공했습니다.", response.data);
      alert(`${response.data.updatedCount}개 학읜의 구독 정보를 변경했습니다.`);
      
      setForceRender((prev) => prev + 1);
    }
    catch(error)
    {
      console.log("구독정보 갱신에 실패했습니다", error);
    }
  };
  async function addData(data)
  {
    switch(category)
    {
      case "management_academy" : link = 'academy'; break;
      case "management_student" : link = 'users'; break;
      case "management_workbook" : link = 'workbook'; break;
      default: link = ''; break;
    };
    console.log(data);

    const info = getMyInfo();
    const payload = {...data, ...info};

    if(category === "management_workbook")
    {
      try
      {
        const response = await api.post(`/${link}/adddata`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        alert(`${response.data.addedCount}개의 정보를 추가했습니다`);
        setForceRender((prev) => prev + 1);
      }
      catch(error)
      {
        console.log("추가 실패", error);
      }
    }
    else
    {
      try
      {
        const response = await api.post(`/${link}/adddata`, {
          data,
        });
        console.log("추가 성공", response.data);
        alert(`${response.data.addedCount}개의 정보를 추가했습니다`);

        setForceRender((prev) => prev + 1);
      }
      catch(error)
      {
        console.log("추가 실패", error);
      }
    }
  };
  async function changeData(data)
  {
    switch(category)
    {
      case "management_student" : link = 'users'; break;
      case "management_workbook" : link = 'workbook'; break;
      default: link = ''; break;
    };
    try
    {
      const response = await api.post(`/${link}/changedata`, { data });
      console.log("추가 성공", response.data);
      alert(`${response.data.updatedCount}개의 정보를 변경했습니다`);

      setForceRender((prev) => prev + 1);
    }
    catch(error)
    {
      console.log("데이터를 변경하는데 실패했습니다.", error);
    }
  };
  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <LoginControl handleLogout={handleLogout}/>
        <NavBar pageId={pageId} onButtonClick={onNavbarButtonClick} />
        <div className='basicspace'>
          {category==='management_academy' && (
            <Academy category={category} forceRender={forceRender} handleCheckboxChange = {handleCheckboxChange} />
          )}
          {category==='management_student' && (
            <Student category={category} forceRender={forceRender} handleCheckboxChange = {handleCheckboxChange} />
          )}
          {category==='management_workbook' && (
            <Workbook category={category} forceRender={forceRender} handleCheckboxChange = {handleCheckboxChange} handleToggle={handleToggle} />
          )}
        </div>
        <div className='btn_section'>
        {category !== 'basic' && (
          <>
          {category === "management_academy" && (
            <button id='novation' className='normal_btn' onClick = {clickDeleteButton} disabled = {checkedRows.length === 0} >구독 갱신</button>
          )}
          {category === "management_student" && (
            <button id='changePW' className='normal_btn' onClick = {clickDeleteButton}  >비밀번호 변경</button>
          )}
            <button id='add' className='normal_btn' onClick = {clickAddButton} >새로 추가하기</button>
            <button id='delete' className='normal_btn' onClick = {clickDeleteButton} disabled = {checkedRows.length === 0} >삭제하기</button>
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
      <AddModal
        isOpen={isBigModalOpen}
        onConfirm={handleAddConfirm}
        onCancel={handleAddCancel}
        category={category}
      />
      <ChangeModal
        isOpen={isMidModalOpen}
        onConfirm={handleChangeConfirm}
        onCancel={handleChangeCancel}
        checkedRow={checkedRows}
        category={category}
      />
    </div>
  );
}
export default MyApp;