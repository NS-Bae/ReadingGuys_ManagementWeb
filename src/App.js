import './App.css';
import { Routes, Route } from "react-router-dom";

import Main from './screens/main_L';
import Management from './screens/management_S';
import ForT from './screens/managementForTeacher';

function App() {
  return (
    <Routes>
      <Route path = "/" element = {<Main />} />
      <Route path = "/managementPage" element = {<Management />} />
      <Route path = "/forT" element = {<ForT />} />
    </Routes>
  );
}

export default App;
