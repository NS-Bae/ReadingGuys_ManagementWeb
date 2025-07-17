const navbarStyles = {
  appBar: {
    backgroundColor: "rgb(255, 166, 0)",
    margin: "10px",
  },
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItem: "center",
  },
  button: {
    display: "flex",
    color: "white",
    "&:hover": {
      color: "rgb(200, 130, 0)",
    },
    fontSize:'1.5rem',
  },
};

export default navbarStyles;
