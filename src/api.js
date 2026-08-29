import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401)
    {
      window.dispatchEvent(new CustomEvent('readingguys:auth-expired'));
    }

    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error, fallback = '요청을 처리하지 못했습니다.') => {
  const serverMessage = error?.response?.data?.message;

  if(Array.isArray(serverMessage)) return serverMessage.join(' ');
  if(typeof serverMessage === 'string' && serverMessage.trim()) return serverMessage;
  if(error?.code === 'ECONNABORTED') return '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.';
  if(!error?.response) return '서버에 연결할 수 없습니다. 네트워크와 서버 상태를 확인해 주세요.';

  return fallback;
};

export default api;
