import React from 'react';
import ListTable from './listTable.js';

import { NormalButton } from './normalButtonStyle.ts';
import styles from './alertStyle.ts';

const ListModal = ({ isOpen, onConfirm, onCancel, columns, info, category }) => {
  console.log(info);
  if(!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.bigmodalContent}>
        <div style={styles.contentplace}>
          <h2>소속 학생/직원</h2>
          <ListTable category={category} columns = {columns} info={info}/>
        </div>
        <div style={styles.modalButtonPlace}>
          <NormalButton onClick={onConfirm}>
              확인
          </NormalButton>
          <NormalButton onClick={onCancel}>
              취소
          </NormalButton>
        </div>
      </div>
    </div>
  );
}

export default ListModal;