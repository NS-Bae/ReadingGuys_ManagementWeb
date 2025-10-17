import api from '../api';

const searchMyAcademy = () => {
  return api.get('/academy/myinfo');
};

const searchMyAcademyStudent = () => {
  return api.post('/academy/academystudentlist');
};

const searchMyAcademyAllStudentRecord = () => {
  return api.post('/records/allstudent');
};

const searchMyAcademyOneStudentRecord = (data) => {
  return api.post('/records/onestudent', { data });
};

export { searchMyAcademy, searchMyAcademyStudent, searchMyAcademyAllStudentRecord, searchMyAcademyOneStudentRecord }