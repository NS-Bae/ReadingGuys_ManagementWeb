const styles = {
  table_place: {
    display: 'block',
    overflowX: 'auto',
    maxWidth: 'inherit',
    height: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    whitespace: 'nowrap',
  },
  whole_table: {
    marginTop: 20,
    marginBottom: 20,
    borderTop: "1px solid", 
    borderBottom: "1px solid",
    borderCollapse: "collapse",
    borderLeft: 0,
    borderRight: 0,
    width: "100%",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  head_table: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  body_table: {
    borderTop: "1px solid", 
    borderBottom: "1px solid",
    borderCollapse: "collapse",
    borderLeft: 0,
    borderRight: 0,
    width: "100%",
    textAlign: "center",
    fontSize: "1.1rem"
  },
  table_row: {
    width: "100%",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-around"

  }, 
  table_data: {
    padding: '5px',
    borderTop: "1px solid", 
    borderBottom: "1px solid",
    borderCollapse: "collapse",
  }
};

export default styles;