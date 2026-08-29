import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const getSession = () => {
  const token = Cookies.get('access_token');
  if(!token) return null;

  try
  {
    const payload = jwtDecode(token);
    if(payload.exp && payload.exp * 1000 <= Date.now())
    {
      Cookies.remove('access_token');
      return null;
    }

    return {
      token,
      userType: payload.userType,
      hashedUserId: payload.hashedUserId,
      hashedAcademyId: payload.hashedAcademyId,
      ok: payload.isItOk ?? payload.ok,
    };
  }
  catch(error)
  {
    console.warn('로그인 쿠키를 해석하지 못했습니다.', error);
    Cookies.remove('access_token');
    return null;
  }
};

export const verifyCookies = () => {
  const session = getSession();
  if(!session) return { status: 'noToken', message: '로그인이 필요합니다.' };
  if(session.userType === '관리자') return { status: 'managerAuthorized', userType: session.userType, session };
  if(session.userType === '교사') return { status: 'teacherAuthorized', userType: session.userType, session };
  return { status: 'studentAuthorized', message: '학생 계정은 관리자 페이지를 이용할 수 없습니다.', userType: session.userType, session };
};

export const getHomeForRole = (userType) => {
  if(userType === '관리자') return '/managementPage';
  if(userType === '교사') return '/forT';
  return '/';
};
