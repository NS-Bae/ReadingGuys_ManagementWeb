import React from 'react';
import styles from './toggleButtonStyle.ts';

const ToggleButton = ({ value, handleToggle, id, trueLabel = '활성화', falseLabel = '비활성화', disabled = false }) => {
  return (
    <button
      onClick={ handleToggle }
      style={ value ? styles.paidToggle : styles.freeToggle }
      id={ id }
      value={ value }
      disabled={ disabled }
    >
      { value ? trueLabel : falseLabel }
    </button>
  );
};

export default ToggleButton;