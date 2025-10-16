import api from '../api';

const ManagerLogIn = ( data ) => {
  return api.post('/auth/manager_login', data);
};

const ManagerLogOut = () => {
  return api.post('/auth/manager_logout');
};

export { ManagerLogIn, ManagerLogOut };