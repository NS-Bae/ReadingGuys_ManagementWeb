import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './alertStyle.ts';
import { NormalButton } from './normalButtonStyle.ts';

const ReadModal = ({ isOpen, onCancel, data }) => {
  if(!isOpen) return null;
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.bigmodalContent}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data}
        </ReactMarkdown>
      <div style={styles.modalButtonPlace}>
        <NormalButton onClick={onCancel}>
          닫기
        </NormalButton>
      </div>
    </div>
  </div>
  )
};

export default ReadModal;