// Import React
import React from 'react';
import "./Navbar.css"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';

// Navbar component
const Navbar = () => {
  return (
    <AppBar className='appbar'>
      <Toolbar className='toolbar'>
      
        <Typography className='item' component="div">
      <a href='/' className='navlink'>
        Home
        </a>
        </Typography>
        <Typography className='item'  component="div">
        <a href='/'  className='navlink'>
        About
        </a>
        </Typography>
        <Typography className='item' component="div">
        <a href='/'  className='navlink'>
        Contact
        </a>
        </Typography>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
