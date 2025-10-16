import '../App.css';
import React, { useCallback, useEffect, useState } from 'react';

import api from '../api';
import Table from './table';

const Student = ({category, forceRender, handleCheckboxChange}) => {
  const [studata, setStudata] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { key: "1", label: "학원 이름" },
    { key: "2", label: "학생 ID" },
    { key: "3", label: "학생 이름" },
    { key: "4", label: "사용자 분류" },
    { key: "5", label: "승인 여부" },
  ];

  const getStudent = useCallback(async () => {
    setLoading(true);
    try
    {
      const response = await api.get('/users/1');

      console.log(response.data);
      
      const convertData = response.data.map((item) => ({
        i1: item.rawAcademyName,
        i2: item.rawUserId,
        i3: item.rawUserName,
        i4: item.userType,
        i5: item.ok ? "승인됨" : "승인안됨",
        i6: item.hashedAcademyId,
        i7: item.hashedUserId,
      }));

      setStudata(convertData);
    }
    catch(error)
    {
      console.error('실패', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getStudent();
  }, [forceRender, getStudent]);
  return (
    loading ? <p>데이터 불러오는 중...</p> : <Table category={category} columns = {columns} info = {studata} handleCheckboxChange = {handleCheckboxChange} />
  )
};

export default Student;