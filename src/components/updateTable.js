import React, { useState, useEffect, useMemo } from "react";
import styles from './tableStyle.ts';
import api from '../api';

const UpdateTable = ({ onDataChange, columnInfo, checkedRow }) => {
  const [rows, setRows] = useState([]);
  const [changeData, setChangeData] = useState([]);

  useEffect(() => {
    setRows(checkedRow);
  }, [checkedRow]);
  useEffect(() => {
    onDataChange(changeData);
  }, [changeData]);
  
  const handleInputChange = (rowKey, key, value) => {
    setRows((prevRows) => {
      if (!prevRows || prevRows.length === 0) return prevRows;
  
      const updatedRows = prevRows.map((row) => {
        if (!row || !row.pk) return row;
        return row.pk === rowKey ? { ...row, [key]: value } : row;
      });
  
      setChangeData((prev) => ({
        ...prev,
        [rowKey]: { ...prev[rowKey], [key]: value },
      }));
  
      return updatedRows;
    });
  };

  return (
    <div style={styles.table_place}>
      <table style = {styles.whole_table}>
        <thead style={styles.head_table}>
          <tr style={styles.table_row}>
            {columnInfo.map((col, index) => {
              if(col.key === "pk") return null;
              return (<th key = {index} style={styles.table_data}>{col.label}</th>);
            })}
          </tr>
        </thead>
        <tbody style = {styles.body_table}>
          {rows.map((row, rowIndex) => {
            const rowKey = row.pk;
            console.log(rowKey);
            return (
              <tr key={row.pk}>
              {columnInfo.map((col) => {
                if(col.key === "pk") return null;
                return (
                  <td key={col.key} style={styles.table_data}>
                    {["id", "name", "academies"].includes(col.key) ? (
                      <p>{row[col.key]}</p>
                    ) : col.type === "select" ? (
                      <select 
                        defaultValue={row[col.key] || ""}
                        onChange={(e) => handleInputChange(rowKey, col.key, e.target.value)}>
                        {col.option.map((opt, index) => (
                          <option key={index} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.type}
                        defaultValue={row[col.key] || ""}
                        onChange={(e) => handleInputChange(rowKey, col.key, e.target.value)} />
                    )}
                  </td>
                );
              })}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateTable;