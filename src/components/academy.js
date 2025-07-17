import '../App.css';
import React, { useEffect, useState, useCallback } from 'react';

import api from '../api';
import Table from './table';

const Academy = ({category, forceRender, handleCheckboxChange}) => {
  const [academy, setAcademy] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { key: "1", label: "학원 ID" },
    { key: "2", label: "학원 이름" },
    { key: "3", label: "구독 여부" },
    { key: "4", label: "구독 시작일" },
    { key: "5", label: "구독 종료일" },
  ];

  const getAcademyList = useCallback(async () => {
    setLoading(true);
    try 
    {
      const response = await api.get('/academy/totallist');
      const convertData = response.data.map(item => ({
        i1: item.academyId,
        i2: item.academyName,
        i3: item.paymentStatus ? "지불" : "미지불",
        i4: item.startMonth,
        i5: item.endMonth,
      }));
      setAcademy(convertData);
    } 
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getAcademyList();
  }, [forceRender, getAcademyList]);

  return (
    loading ? <p>데이터 불러오는 중...</p> : <Table category={category} columns = {columns} info = {academy} handleCheckboxChange = {handleCheckboxChange} />
  )
};

export default Academy;