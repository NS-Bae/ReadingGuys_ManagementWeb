import api from '../api';

export const adminApi = {
  academies: {
    list: () => api.get('/academy/totallist'),
    create: (id, name) => api.post('/academy/adddata', { data: [{ '1': id, '2': name }] }),
    renew: (rows) => api.patch('/academy/novation', { checkedRows: rows.map(row => ({ data1: row.hashedAcademyId, data2: row.academyName })) }),
    remove: (rows) => api.delete('/academy/deletedata', { data: { checkedRows: rows.map(row => ({ data1: row.hashedAcademyId, data2: row.academyName })) } }),
  },
  users: {
    list: () => api.get('/users/1'),
    create: (form) => api.post('/users/adddata', { data: [{ '1': form.userId, '2': form.password, '3': form.userName, academies: form.hashedAcademyId, types: form.userType }] }),
    update: (hashedUserId, form) => api.post('/users/changedata', { data: [{ id: hashedUserId, ...(form.password ? { pw: form.password } : {}), ...(form.userType ? { types: form.userType } : {}) }] }),
    remove: (rows) => api.delete('/users/deletedata', { data: { checkedRows: rows.map(row => ({ data1: row.hashedAcademyId, data2: row.hashedUserId })) } }),
  },
  workbooks: {
    list: () => api.get('/workbook/totallist'),
    upload: (formData) => api.post('/workbook/adddata', formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
    togglePaid: (row) => api.post('/workbook/changedata', { data: [{ data1: row.workbookId, data2: row.workbookName }] }),
    remove: (rows) => api.delete('/workbook/deletedata', { data: { checkedRows: rows.map(row => ({ data1: row.workbookId, data2: row.workbookName })) } }),
  },
  terms: {
    list: (termsType) => api.get('/agreement/alllist', { params: { main: termsType } }),
    create: (payload) => api.post('/agreement/adddata', payload),
    activate: (termsType, id) => api.post('/agreement/changedata', { data: { type: termsType, id: String(id) } }),
    read: (id) => api.get(`/agreement/document/${id}`),
  },
  teacher: {
    academy: () => api.get('/academy/myinfo'),
    roster: () => api.post('/academy/academystudentlist'),
    records: (hashedUserId) => hashedUserId === 'all' ? api.post('/records/allstudent') : api.post('/records/onestudent', { data: hashedUserId }),
  },
};
