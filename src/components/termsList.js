import React from "react";

import styles from './tableStyle.ts';
import ToggleButton from './ToggleButton';


const TermsList = ({ title, columns, info, handleToggle }) => {
  return (
    <table style={styles.whole_table}>
      <thead style={styles.head_table}>
        <tr>
          <td>체크</td>
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
              <td style={styles.table_data}>{info[i].i1}</td>
              <td style={styles.table_data}>{info[i].i2}</td>
              <td style={styles.table_data}>{info[i].i3}</td>
              <td style={styles.table_data}>{info[i].i4}</td>
              <td style={styles.table_data}>
                <ToggleButton item={info[i]} handleToggle={handleToggle} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TermsList;