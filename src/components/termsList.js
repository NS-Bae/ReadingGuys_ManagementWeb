import React from "react";

import styles from './tableStyle.ts';
import ToggleButton from './ToggleButton';


const TermsList = ({ title, columns, info, handleToggle }) => {
  return (
    <table style={styles.whole_table}>
      <thead style={styles.head_table}>
        <tr>
          {columns.map((col) => (
            <td key={col.key}>{col.label}</td>
          ))}
        </tr>
      </thead>
      <tbody style={styles.body_table}>
        {Array.from({ length: Math.min(info.length, 15) }, (_, i) => {
          const rowKey =`${info[i].i1}_${info[i].i2}`;
          return (
            <tr key={rowKey} >
              <td style={styles.table_data}>{info[i].id}</td>
              <td style={styles.table_data}>{info[i].title}</td>
              <td style={styles.table_data}>{info[i].createdAt}</td>
              <td style={styles.table_data}>{info[i].createdBy}</td>
              <td style={styles.table_data}>{info[i].effectiveDate}</td>
              <td style={styles.table_data}>
                <ToggleButton vaule={ info[i].title } id={ info[i].id } trueLabel="활성화" falseLabel="비활성화" handleToggle={ (e) => handleToggle(e, {title}) } />
              </td>
              <td><button>미리보기</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TermsList;