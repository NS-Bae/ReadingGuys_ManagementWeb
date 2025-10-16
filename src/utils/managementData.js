import api from '../api';
import { getMyInfo } from './info';

const ManagerLogIn = ( data ) => {
  const info = getMyInfo();
  const payload = {...data, ...info};
  return api.post('/auth/manager_login', payload, {withCredentials: true});
};

const ManagerLogOut = () => {
  const info = getMyInfo();
  console.log(info);
  return api.post('/auth/manager_logout', info, {withCredentials: true});
};

export { ManagerLogIn, ManagerLogOut };