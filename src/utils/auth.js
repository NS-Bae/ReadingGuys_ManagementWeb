import Cookies from 'js-cookie';
import api from '../api';

export const ManagerLogIn = async(data) => {
  const response = await api.post('/auth/manager_login', data);
  if(!Cookies.get('access_token') && response.data?.accessToken)
  {
    Cookies.set('access_token', response.data.accessToken, {
      sameSite: 'strict',
      secure: window.location.protocol === 'https:',
    });
  }
  return response;
};

export const ManagerLogOut = async() => {
  try { return await api.post('/auth/manager_logout'); }
  finally { Cookies.remove('access_token'); }
};
