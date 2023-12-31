import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/authContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {disableReactDevTools} from '@fvilers/disable-react-devtools';

disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<App/>}/>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);


