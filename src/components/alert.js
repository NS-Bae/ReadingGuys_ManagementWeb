import React, { useState, useEffect } from 'react';

import styles from './alertStyle.ts';

const CustomModal = ({ isOpen, message, onConfirm, onCancel }) => {
  const [isHoveredConfirm, setIsHoveredConfirm] = useState(false);
  const [isHoveredCancel, setIsHoveredCancel] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsHoveredConfirm(false);
      setIsHoveredCancel(false);
    }
    console.log(message)
  }, [isOpen]);

  if (!isOpen) return null;

  const okButtonStyle = {
    ...styles.modalButton, 
    color: isHoveredConfirm ? 'rgb(255, 166, 0)' : 'black',
  };
  const cancleButtonStyle = {
    ...styles.modalButton, 
    color: isHoveredCancel ? 'rgb(255, 166, 0)' : 'black',
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.smallmodalContent}>
        <p>{message}</p>
        <div style={styles.modalButtonPlace}>
          <button 
            onClick={onConfirm}
            style={okButtonStyle}
            onMouseEnter={() => setIsHoveredConfirm(true)}
            onMouseLeave={() => setIsHoveredConfirm(false)}>
              확인
          </button>
          <button 
            onClick={onCancel}
            style={cancleButtonStyle}
            onMouseEnter={() => setIsHoveredCancel(true)}
            onMouseLeave={() => setIsHoveredCancel(false)}>
              취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;