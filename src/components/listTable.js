import React from "react";

import styles from './tableStyle.ts';

const ListTable = ({category, columns, info}) => {
  console.log(category);
  return (
    <>
    {category === 'check_stdent_state' && info.length > 0 ? 
    (
      <table style = {styles.whole_table}>
        <thead style={styles.head_table}>
          <tr>
            {columns.map((col) => (
              <td key = {col.key}>{col.label}</td>
            ))}
          </tr>
        </thead>
        <tbody style = {styles.body_table}>
          {Array.from({ length: Math.min(info.length, 15) }, (_, i) => (
            <tr
              key = {`${info[i].UserID}_${info[i].UserName}_${info[i].examDate}`}
            >
              <td style={styles.table_data}>{info[i].UserName}({info[i].UserID})</td>
              <td style={styles.table_data}>{info[i].WorkbookName}</td>
              <td style={styles.table_data}>{info[i].examDate}</td>
              <td style={styles.table_data}>{info[i].ProgressRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <table style = {styles.whole_table}>
          <thead style={styles.head_table}>
            <tr>
              {columns.map((col) => (
                <td key = {col.key}>{col.label}</td>
              ))}
            </tr>
          </thead>
          <tbody style = {styles.body_table}>
            {Array.from({ length: Math.min(info.length, 15) }, (_, i) => (
              <tr
                key = {`${info[i].id}_${info[i].userName}`}
              >
                <td style={styles.table_data}>{info[i].id}</td>
                <td style={styles.table_data}>{info[i].userName}</td>
                <td style={styles.table_data}>{info[i].userType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}</>
  );
};

export default ListTable;