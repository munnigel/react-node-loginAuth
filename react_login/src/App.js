import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/login';
import LinkPage from './components/LinkPage';
import Home from './components/Home';
import {Routes, Route} from 'react-router-dom';
import Editor from './components/Editor';
import Missing from './components/Missing';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Public Routes */}
          <Route path="register" element={<Register/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="linkpage" element={<LinkPage/>}/>

        {/* Private Routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="editor" element={<Editor/>}/>

        {/* catch error route */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  );
}

export default App;
