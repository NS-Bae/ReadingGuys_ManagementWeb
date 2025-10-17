import styles from './infoTableStyle.ts';

const InfoTable = ({ category, info, userCount }) => {
  return (
    <table style={styles.whole_table}>
      <tbody style={styles.body_table}>
        <tr style={styles.table_row}>
          <td style={styles.table_data}>내 학원 이름</td>
          <td style={styles.table_data}>{info.academyName}</td>
        </tr>
        <tr style={styles.table_row}>
          <td style={styles.table_data}>구독 여부</td>
          <td style={styles.table_data}>{info.paymentStatus ? "구독중" : "구독만료"}</td>
        </tr>
        <tr style={styles.table_row}>
          <td style={styles.table_data}>가입 일</td>
          <td style={styles.table_data}>{info.startMonth}</td>
        </tr>
        <tr style={styles.table_row}>
          <td style={styles.table_data}>구독 종료일</td>
          <td style={styles.table_data}>{info.endMonth}</td>
        </tr>
        <tr style={styles.table_row}>
          <td style={styles.table_data}>소속 학생 수</td>
          <td style={styles.table_data}>{userCount}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default InfoTable;