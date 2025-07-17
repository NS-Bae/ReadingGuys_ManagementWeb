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
  
  const handleInputChange = (rowIndex, key, value) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row, index) =>
        index === rowIndex ? { ...row, [key]: value } : row
      );
      
      setChangeData((prev) => ({
        ...prev,
        [prevRows[rowIndex].id]: { ...prev[prevRows[rowIndex].id], [key]: value },
      }));

      return updatedRows;
    });
  };

  return (
    <div style={styles.table_place}>
      <table style = {styles.whole_table}>
        <thead style={styles.head_table}>
          <tr style={styles.table_row}>
            {columnInfo.map((col, index) => (
              <th key = {index} style={styles.table_data}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody style = {styles.body_table}>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columnInfo.map((col) => (
                <td key={col.key} style={styles.table_data}>
                {["id", "name", "academies"].includes(col.key) ? (
                  <p>{row[col.key]}</p>
                ) : col.type === "select" ? (
                  <select 
                    defaultValue={row[col.key] || ""}
                    onChange={(e) => handleInputChange(rowIndex, col.key, e.target.value)}>
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
                    onChange={(e) => handleInputChange(rowIndex, col.key, e.target.value)} />
                )}
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateTable;