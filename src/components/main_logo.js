import '../App.css';
import React from 'react';
import { Link } from "react-router-dom";

const MainLogo = () => {
  return (
    <h1 className='main_logo'><Link to = '/' className='main_logo'>독(讀)한 녀석들</Link></h1>
  );
}
export default MainLogo;