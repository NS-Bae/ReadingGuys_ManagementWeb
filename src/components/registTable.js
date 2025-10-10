import React, { useState, useEffect, useMemo } from "react";
import styles from './tableStyle.ts';
import api from '../api';

const RegistTable = ({ onDataChange, columnInfo, rowCount, parentOptions }) => {
  const [academy, setAcademy] = useState([]);
  const [rows, setRows] = useState([]);
  const [selOptions, setSelOptions] = useState({
    types: parentOptions.types || [],
    academies: [],
  });
  const memoizedColumns = useMemo(() => columnInfo, [JSON.stringify(columnInfo)]);

  useEffect(() => {
    console.log(selOptions)
    setRows((prevRows) => {
      const newRows = Array.from({ length: rowCount }, (_, index) => {
        const existingRows = prevRows.find(row => row.id === index + 1);
        return existingRows ? existingRows : { id: index + 1, ...Object.fromEntries(memoizedColumns.map(col => [col.key, ''])) };
      });
      return newRows;
    });
  }, [rowCount, memoizedColumns]);
  useEffect(() => {
    getAcademyList();
  }, []);
  
  //학원 목록 가져오기
  async function getAcademyList()
  {
    try 
    {
      const response = await api.get('/academy/totallist');
      const convertData = response.data.map(item => ({
        i1: item.hashedAcademyId,
        i2: item.academyName,
      }));
      setAcademy(convertData);
      setSelOptions((prev) => {
        const newAcademies = convertData.map(item => ({
          value: item.i1,
          label: item.i2,
        }));
        if (JSON.stringify(prev.academies) !== JSON.stringify(newAcademies)) {
          return { ...prev, academies: newAcademies };
        }
        return prev; // 상태가 동일하면 업데이트 안 함
      });
    } 
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }

  };
  const handleInputChange = (id, key, value) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      );

      onDataChange(updatedRows); // 부모에게 데이터 전달
      return updatedRows;
    });
  };

  return (
    <div style={styles.table_place}>
      <table style = {styles.whole_table}>
        <thead style={styles.head_table}>
          <tr style={styles.table_row}>
            {memoizedColumns.map((col, index) => (
              <th key = {index} style={styles.table_data}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody style = {styles.body_table}>
          {rows.map((row) => (
            <tr key={row.id}>
              {memoizedColumns.map((col, index) => (
                <td key={index} style={styles.table_data}>
                  {col.type === 'select' ? (
                    <select 
                      key={row[col.key]}
                      value={row[col.key]}
                      name={row.label}
                      onChange={(e) => handleInputChange(row.id, col.key, e.target.value)} >
                        <option value=''>선택</option>
                        {col.optionKey === 'academies' && selOptions.academies.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                        {col.optionKey === 'types' && selOptions.types.map((type, idx) => (
                          <option key={idx} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                  )
                  :
                  (
                    <input 
                      type="text" 
                      name={row.label}
                      value={row[col.key] || ''} 
                      onChange={(e) => handleInputChange(row.id, col.key, e.target.value)} />
                  )
                }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistTable;