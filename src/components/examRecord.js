import React, { useState, useEffect } from "react";

import ListTable from './listTable';

const ExamRecord = ({ category, stuList, info, getExamRecord }) => {
  const [student, setSutdent] = useState('');
  const columns = [
    { key: "1", label: "학생 ID" },
    { key: "2", label: "문제집 이름" },
    { key: "3", label: "시험본 날" },
    { key: "4", label: "점수" },
  ];

  useEffect(() => {
    getExamRecord(student);
    console.log(info);
  }, [student])

  const transformedData = stuList.reduce((acc, { id, userName }) => {
    acc[`${id}_${userName}`] = `${userName}(${id})`;
    return acc;
  }, {});

  const handleChange = (e) => {
    setSutdent(e.target.value);
  };
  
  return (
    <>
      <select id="stuList" onChange={handleChange}>
        <option value={''}>선택하세요</option>
        <option value={'all'}>전체보기</option>
        {Object.entries(transformedData).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </select>
      <ListTable category={category} columns = {columns} info = {info} />
    </>
  );
};

export default ExamRecord;