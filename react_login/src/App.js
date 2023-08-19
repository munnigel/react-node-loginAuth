import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import LinkPage from './components/LinkPage';
import Home from './components/Home';
import Editor from './components/Editor';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import Admin from './components/Admin';
import Unauthorized from './components/Unauthorized';

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
          <Route path="linkpage" element={<LinkPage/>}/>
          <Route path="unauthorized" element={<Unauthorized/>} /> 

        {/* Private Routes that require auth (taken from useContext) */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
          <Route path="/" element={<Home/>}/>
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]}/>}>
          <Route path="editor" element={<Editor/>}/>
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
          <Route path="admin" element={<Admin/>}/>
        </Route>
        
        {/* catch error route */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  );
}

export default App;