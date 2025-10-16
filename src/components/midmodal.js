import React, { useState, useEffect } from 'react';

import styles from './alertStyle.ts';
import { NormalButton } from './normalButtonStyle.ts';
import UpdateTable from './updateTable';
import api from '../api';

const ChangeModal = ({ isOpen, onConfirm, onCancel, checkedRow, category }) => {
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const studentColumns = [
    { key: "id", label: "ID", type: 'text' },
    { key: "pw", label: "PW", type: 'text' },
    { key: "name", label: "이름", type: 'text' },
    { key: "academies", label: "학원", type: 'text' },
    { key: "types", label: "사용자 분류", type: 'select', option: ["학생", "교사"] },
    { key: "pk", label: "pk", type: 'text' },
  ];
  const workbookColumns = [
    { key: "1", label: "학원ID", type: 'text' },
    { key: "2", label: "학원이름", type: 'text' },
  ];

  useEffect(() => {
    console.log(checkedRow);
    if(!isOpen) {
      setTableData([]);
    }
    else
    {
      getUsersInfo();
    }
  }, [isOpen]);

  if(!isOpen) return null;

  const mapDataToColumns = (apiData, columns) => {
    return apiData.map((item) => {
      const mappedItem = {};
      columns.forEach((col) => {
        switch (col.key) {
          case "id":
            mappedItem[col.key] = item.rawUserId;
            break;
          case "pw":
            mappedItem[col.key] = "";
            break;
          case "name":
            mappedItem[col.key] = item.rawUserName;
            break;
          case "academies":
            mappedItem[col.key] = `${item.rawAcademyName}`;
            break;
          case "types":
            mappedItem[col.key] = item.userType;
            break;
          case "pk": 
            mappedItem[col.key] = item.hashedUserId;
            break;
          default:
            mappedItem[col.key] = item[col.key];
        }
      });
      return mappedItem;
    });
  };
  async function getUsersInfo()
  {
    try
    {
      const response = await api.post('/users/info', { checkedRow });
      const mappedData = mapDataToColumns(response.data, studentColumns);
      setData(mappedData);
    }
    catch(error)
    {
      console.error('데이터 로딩 실패', error);
    }
  };

  const handleTableDataChange = (data) => {
    setTableData(data);
  };
  const handleConfirm = () => {
    onConfirm(tableData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.bigmodalContent}>
        <div style={styles.contentplace}>
          <h2>비밀번호 변경</h2>
          {category === 'management_workbook' && (
            <UpdateTable onDataChange={handleTableDataChange} columnInfo={workbookColumns} checkedRow={checkedRow} />
          )}
          {category === 'management_student' && (
            <UpdateTable onDataChange={handleTableDataChange} columnInfo={studentColumns} checkedRow={data} />
          )}
        </div>
        <div style={styles.modalButtonPlace}>
          <NormalButton onClick={handleConfirm}>
              확인
          </NormalButton>
          <NormalButton onClick={onCancel}>
              취소
          </NormalButton>
        </div>
      </div>
    </div>
  );
};

export default ChangeModal;