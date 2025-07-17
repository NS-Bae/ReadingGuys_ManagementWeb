import React, { useEffect, useState } from "react";

import styles from './registBookStyle.ts';

const RegistBookForm = ({ onClickConfirm, resetTrigger }) => {
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    onClickConfirm(rows, file);
  }, [file, rows]);
  useEffect(() => {
    setRows([]);
  }, [resetTrigger]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0)
    {
      setFile(e.target.files[0]);
    }
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setRows((prev) => {
      const existingRows = prev.findIndex((item) => item.id === id);
      
      if (existingRows !== -1) 
      {
        const updatedInputs = [...prev];
        updatedInputs[existingRows].value = value;
        return updatedInputs;
      }
      else
      {
        return [...prev, { id, value }];
      }
    });
  };
  console.log(rows);

  return (
    <div style={styles.basic} >
      <div style={styles.rowStyle} >
        <h3 style={styles.textStyle} >공개 월</h3>
        <input style={styles.inputStyle} id="releaseMonth" type="date" onChange={handleInputChange} ></input>
      </div>
      <div style={styles.rowStyle} >
        <h3 style={styles.textStyle} >책 이름</h3>
        <input style={styles.inputStyle} id="workbookName" type="text" onChange={handleInputChange} ></input>
      </div>
      <div style={styles.rowStyle} >
        <h3 style={styles.textStyle} >난이도</h3>
        <select style={styles.inputStyle} id="Difficulty" onChange={handleInputChange} >
          <option value=''>선택</option>
          <option value='쉬움'>쉬움</option>
          <option value='보통'>보통</option>
          <option value='어려움'>어려움</option>
        </select>
      </div>
      <div style={styles.rowStyle} >
        <h3 style={styles.textStyle} >무료공개 여부</h3>
        <select style={styles.inputStyle} id="isPaid" onChange={handleInputChange} >
          <option value=''>선택</option>
          <option value='0'>무료</option>
          <option value='1'>유료</option>
        </select>
      </div>
      <div style={styles.rowStyle} >
        <h3 style={styles.textStyle} >책 업로드</h3>
        <input 
          id="upload"
          type="file" 
          accept=".zip" 
          onChange={handleFileChange}
          style={styles.inputStyle} />
      </div>
    </div>
  );
};

export default RegistBookForm;