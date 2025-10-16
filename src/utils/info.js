import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const getMyInfo = () => {
  return {
    userAgent: navigator.userAgent,
  };
};

const verifyCookies = ( type ) => {
  const userToken = Cookies.get("access_token");

  if(!userToken)
  {
    return { status: 'noToken', message: '로그인이 필요합니다.' };
  }

  try
  {
    const decoded = jwtDecode(userToken);

    if(decoded.userType === "관리자")
    {
      return { status: 'managerAuthorized', message: '관리자만 접근 할 수 있습니다', userType: decoded.userType }
    }
    if(decoded.userType === "교사")
    {
      return { status: 'teacherAuthorized', message: '관리자만 접근 할 수 있습니다', userType: decoded.userType }
    }
    if(decoded.userType === "학생")
    {
      return { status: 'studentAuthorized', message: '관리자만 접근 할 수 있습니다', userType: decoded.userType }
    }
    
  }
  catch(error)
  {
    console.error("토큰 디코딩 오류:", error);
    return { status: 'invalid', message: '유효하지 않은 토큰입니다.' };
  }
}

export { getMyInfo, verifyCookies };