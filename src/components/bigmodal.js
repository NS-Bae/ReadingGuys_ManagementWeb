import React, { useState, useEffect } from 'react';

import styles from './alertStyle.ts';
import '../App.css';
import RegistTable from './registTable';
import RegistBookForm from './registbook.js';

const AddModal = ({ isOpen, onConfirm, onCancel, category }) => {
  const [rowCount, setRowCount] = useState(1);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const studentColumns = [
    { key: "1", label: "ID", type: 'text' },
    { key: "2", label: "PW", type: 'text' },
    { key: "3", label: "이름", type: 'text' },
    { key: "academies", label: "학원", type: 'select', optionKey: "academies" },
    { key: "types", label: "사용자 분류", type: 'select', optionKey: "types" },
  ];
  const academyColumns = [
    { key: "1", label: "학원ID", type: 'text' },
    { key: "2", label: "학원이름", type: 'text' },
  ];
  const parentOptions = {
    types: ["학생", "교사"],
  };

  useEffect(() => {
    if(!isOpen) {
      setRowCount(1);
      setTableData([]);
    }
  }, [isOpen]);

  if(!isOpen) return null;

  const managementLow = (e) => {
    const btnId = e.target.id;

    setRowCount((prev) => {
      if (btnId === 'add') return prev + 1;
      if (btnId === 'delete' && prev > 1) return prev - 1;
      return prev;
    });
  };
  const convertEnglish = (category) => 
  {
    const mapping = {
      management_academy : '학원',
      management_student : '학생',
      management_workbook : '문제집'
    }
    return mapping[category] || '알 수 없음.';
  };
  const handleTableDataChange = (data) => {
    setTableData(data);
  };
  const handleConfirm = () => {
    if(category === 'management_workbook')
    {
      setResetTrigger((prev) => prev + 1);
      console.log(resetTrigger, tableData);
      onConfirm(tableData);
    }
    else
    {
      console.log(tableData);
      onConfirm(tableData);
    }
  };
  const handleClickConfirm = (row, file) => {
    console.log(row, file);
    const data = row.concat(file);
    setTableData(data);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.bigmodalContent}>
        <div style={styles.contentplace}>
          <h2>{convertEnglish(category)} 추가하기</h2>
          {category !== 'management_workbook' && (
            <div style={styles.modalButtonPlace}>
              <button id='add' onClick={managementLow} className='normal_btn'>줄 추가</button>
              <button id='delete' onClick={managementLow} className='normal_btn' disabled={rowCount === 0}>줄 삭제</button>
            </div>
          )}
          {category === 'management_academy' && (
            <RegistTable onDataChange={handleTableDataChange} columnInfo={academyColumns} rowCount={rowCount} parentOptions={parentOptions} />
          )}
          {category === 'management_student' && (
            <RegistTable onDataChange={handleTableDataChange} columnInfo={studentColumns} rowCount={rowCount} parentOptions={parentOptions}/>
          )}
          {category === 'management_workbook' && (
            <RegistBookForm key={resetTrigger} onClickConfirm={handleClickConfirm} resetTrigger={resetTrigger} />
          )}
        </div>
        <div style={styles.modalButtonPlace}>
          <button 
            onClick={handleConfirm}
            className='normal_btn'>
              확인
          </button>
          <button 
            onClick={onCancel}
            className='normal_btn'>
              취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;