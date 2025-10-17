import api from '../api';

const dataDelete = ( category, checkedRows ) => {
  let link = '';
  switch(category)
  {
    case "management_academy" : link = 'academy'; break;
    case "management_student" : link = 'users'; break;
    case "management_workbook" : link = 'workbook'; break;
    default: link = ''; break;
  };
  return api.delete(`/${link}/deletedata`, { data: {checkedRows} });
};

const addNormalInfo = ( category, data ) => {
  let link = '';
  switch(category)
  {
    case "management_academy" : link = 'academy'; break;
    case "management_student" : link = 'users'; break;
    default: link = ''; break;
  };
  return api.post(`/${link}/adddata`, { data });
};

const addFormInfo = ( data ) => {
  console.log(data, 'aaa');
  return api.post(`/workbook/adddata`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const changeInfo = ( category, data ) => {
  let link = '';
  switch(category)
  {
    case "management_academy" : link = 'academy'; break;
    case "management_student" : link = 'users'; break;
    case "management_workbook" : link = 'workbook'; break;
    default: link = ''; break;
  };
  console.log(data);
  return api.post(`/${link}/changedata`, { data });
};

const updateNovation = ( checkedRows ) => {
  console.log(checkedRows);
  return api.patch('/academy/novation', { checkedRows });
};

export { dataDelete, addNormalInfo, addFormInfo, changeInfo, updateNovation };