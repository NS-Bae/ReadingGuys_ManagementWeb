import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import MainLogo from '../components/main_logo';
import CustomModal from '../components/alert';

import { ManagerLogIn } from '../utils/auth.js';
import { verifyCookies } from '../utils/info.js';
// AuthContent 컴포넌트 정의
function AuthContent({ title, children }) {
  return (
    <div className="auth_container">
      {children}
    </div>
  );
};

function LoginForm(props) {
  const [inputs, setInputs] = useState({
    ip1: '', 
    ip2: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    try
    {
      await ManagerLogIn( inputs );
      navigate("managementPage");
      const result = verifyCookies();

      switch(result.status)
      {
        case 'noToken':
          navigate("/");
          return;
        case 'managerAuthorized':
          navigate("/managementPage");
          return;
        case 'teacherAuthorized':
          navigate("/forT");
          return;
        case 'studentAuthorized':
          navigate("/");
          return;
        default:
          console.error("토큰 디코딩 오류:", result.message);
          navigate("/");
          break;
      }
    }
    catch(error)
    {
      console.error('실패', error);
      alert(error.response.data.message);
    }
  }
  return (
    <AuthContent title="로그인"> 
      <form onSubmit={handleLogin}>
        <div className="input_place">
          <label>ID</label>
          <input
              id='id'
              name='ip1'
              type="text"
              value={inputs.ip1}
              placeholder='ID'
              onChange={handleChange}
              required
            />
        </div>
        <div className="input_place">
          <label>PASSWORD</label>
          <input
            id='pw'
            name='ip2'
            type="password"
            value={inputs.ip2}
            placeholder='PASSWORD'
            onChange={handleChange}
            required
          />
        </div>
        <div className='place'>
          <button className='test_btn' type="submit" value="로그인">로그인</button>
        </div>
      </form>
    </AuthContent>
  );
}
function MyApp() {
  const [alertMessage, setAlertMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyToken = Cookies.get("access_token");
    
    if(!verifyToken)
    {
      setAlertMessage('로그인이 필요합니다.');
      setIsModalOpen(true);
      navigate("/");
      return;
    }

    try 
    {
      const decoded = jwtDecode(verifyToken);
      if (decoded.userType === "관리자") 
      {
        setAlertMessage('관리자님 환영합니다.');
        setIsModalOpen(true);
        navigate("/managementPage");
      }
      else if (decoded.userType === "교사") 
      {
        setAlertMessage('선생님 환영합니다');
        setIsModalOpen(true);
        navigate("/forT");
      }
      else
      {
        setAlertMessage('학생은 접근할 수 없습니다.');
        setIsModalOpen(true);
        navigate("/");
      }
    } 
    catch (error) 
    {
      console.error("토큰 디코딩 오류:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleConfirm = () => {
    console.log("확인 버튼을 클릭");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    console.log("취소 버튼을 클릭");
    setIsModalOpen(false);
  };
  return (
    <div className="background">
      <div className="wrap">
        <MainLogo />
        <LoginForm />
      </div>
      <CustomModal
        isOpen={isModalOpen}
        message={alertMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
export default MyApp;
