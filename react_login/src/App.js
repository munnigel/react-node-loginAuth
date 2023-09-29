import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import UploadPage from './components/Upload';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import Admin from './components/Admin';
import Unauthorized from './components/Unauthorized';
import PersistLogin from './components/PersistLogin';
import Logs from './components/Logs';
import ResetPassword from './components/ResetPassword';

import {Routes, Route} from 'react-router-dom';


const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Public Routes */}
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="unauthorized" element={<Unauthorized/>} /> 
        <Route path="reset/:token" element={<ResetPassword/>} />

        {/* Persist Login */}
        <Route element={<PersistLogin/>}>
          {/* Private Routes that require auth (taken from useContext) */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
            <Route path="/" element={<Home/>}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
            <Route path="upload" element={<UploadPage/>}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
            <Route path="admin" element={<Admin/>}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
            <Route path="logs" element={<Logs/>}/>
          </Route>
        </Route>
        
        {/* catch error route */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  );
}

export default App;
