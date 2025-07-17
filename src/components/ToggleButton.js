import React, { useState } from 'react';
import styles from './toggleButtonStyle.ts';

const ToggleButton = ({ item, handleToggle }) => {
  const [isPaid, setIsPaid] = useState(item.i5 === '유료공개' ? true : false);
  const btnId = `${item.i1}_${item.i2}`;
  
  return (
    <button
      onClick={handleToggle} 
      style={isPaid ? styles.paidToggle : styles.freeToggle }
      id={btnId}
      value={isPaid}>
      {isPaid ? '유료공개' : '무료공개'}
    </button>
  );
};

export default ToggleButton;