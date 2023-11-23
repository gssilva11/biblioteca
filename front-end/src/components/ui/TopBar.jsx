import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import slogan from '../../assets/slogan.png'
import MainMenu from './MainMenu'
import { Typography } from '@mui/material';
import gif from '../../assets/gif.gif'
import { Link } from 'react-router-dom'

export default function TopBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark>
        <Toolbar variant="dense">
          
          <MainMenu />
            <Link to='/'>
              <img src={gif} alt="Gif de Livro se movendo" />
            </Link>
          <Typography variant="h5" sx={{
            ml:'10px',
            display: 'flex',
            justifyContent:'center',
            fontFamily:'ITC Benguiat',
            color:'#ffb48a'
            }}>
            Descubra o Poder do Saber.
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}