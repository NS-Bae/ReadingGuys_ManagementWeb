import styles from './tableStyle.ts';
import React from "react";

import ToggleButton from './ToggleButton';

const Table = ({category, columns, info, handleCheckboxChange, handleToggle}) => {
  const onCheckboxChange = (e, key) => {
    handleCheckboxChange(e, key);
  };
  
  return (
    <table style = {styles.whole_table}>
      <thead style={styles.head_table}>
        <tr>
          <td>체크</td>
          {columns.map((col) => (
            <td key = {col.key}>{col.label}</td>
          ))}
        </tr>
      </thead>
      <tbody style = {styles.body_table}>
        {Array.from({ length: Math.min(info.length, 15) }, (_, i) => {
          const rowKey =
            category === 'management_student' ? `${info[i].i6}_${info[i].i7}` : `${info[i].i1}_${info[i].i2}`;
          return (
            <tr
              key = {rowKey}
            >
              <td style={styles.table_data}>
                <input
                  type = "checkbox"
                  onChange={(e) => onCheckboxChange(e, rowKey)}
                />
              </td>
              {category !== 'management_academy' && (<td style={styles.table_data}>{info[i].i1}</td>)}
              <td style={styles.table_data}>{info[i].i2}</td>
              <td style={styles.table_data}>{info[i].i3}</td>
              <td style={styles.table_data}>{info[i].i4}</td>
              <td style={styles.table_data}>
                {category === 'management_workbook' ? <ToggleButton item={info[i]} handleToggle={handleToggle}/> : info[i].i5 }
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;