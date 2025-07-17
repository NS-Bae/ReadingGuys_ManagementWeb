import '../App.css';
import React, { useEffect, useState, useCallback } from 'react';

import api from '../api';
import Table from './table';

const Workbook = ({ category, forceRender, handleCheckboxChange, handleToggle }) => {
  const [bookdata, setBookdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { key: "1", label: "책 ID" },
    { key: "2", label: "책 이름" },
    { key: "3", label: "공개된 달" },
    { key: "4", label: "난이도" },
    { key: "5", label: "무료 공개 여부" },
  ];

  const getWorkbook = useCallback(async () => {
    setLoading(true);

    try
    {
      const response = await api.get('/workbook/totallist');
      console.log('성공', response.data);

      const convertData = response.data.map((item) => ({
        i1: item.workbookId,
        i2: item.workbookName,
        i3: item.releaseMonth,
        i4: item.Difficulty,
        i5: item.isPaid ? "유료공개" : "무료공개",
      }));

      setBookdata(convertData);
    }
    catch(error)
    {
      console.error('실패', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getWorkbook();
  }, [forceRender, getWorkbook]);

  return (
    loading ? <p>데이터 불러오는 중...</p> : <Table category={category} columns = {columns} info = {bookdata} handleCheckboxChange = {handleCheckboxChange} handleToggle={handleToggle} />
  )
};

export default Workbook;