import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import {useNavigate, Link} from 'react-router-dom'
import useLogout from '../../hooks/useLogout';
import './styles.css'


const HeaderMenu = () => {
  const [current, setCurrent] = useState('mail');
  const navigate = useNavigate()
  const logout = useLogout()

  const signOut = async () => {
    await logout();
    navigate("/login");
  }


  const items = [
    {
      label: (
        <Link to="/">
          Home
        </Link>
      ),
      key: 'home',
      icon: <MailOutlined />,
    },
    {
      label: (
        <Link to="/upload">
          Upload
        </Link>
      ),
      key: 'upload',
      icon: <MailOutlined />,
    },
    {
      label: (
        <Link to="/admin">
          Admin
        </Link>
      ),
      key: 'admin',
      icon: <AppstoreOutlined />,
    },
    {
      label: (
        <Link to="/logs">
          Logs
        </Link>
      ),
      key: 'logs',
      icon: <SettingOutlined />,
    },
    {
      label: (
        <Button size='small' type='primary' danger onClick={signOut} className='button'>Sign Out</Button>
      ),
      key: 'signout',
    }
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className='menu'/>;
};
export default HeaderMenu;