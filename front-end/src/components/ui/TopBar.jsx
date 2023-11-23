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
  
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%' // Define a largura total da barra
          }}>
  
            {/* Lado esquerdo */}
            <Box>
              <Link to='/' id='removerSublinhadoLink' sx={{ textDecoration: 'none' }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center' // Alinha o conteúdo verticalmente
                }}>
                  <img src={gif} alt="Gif de Livro se movendo" id='gifTopBar' />
  
                  <Typography variant="h5" sx={{
                    ml: '10px',
                    fontFamily: 'ITC Benguiat',
                    color: '#ffb48a',
                    marginTop: '5px'
                  }}>
                    Descubra o Poder do Saber.
                  </Typography>
                </Box>
              </Link>
            </Box>
  
            {/* Lado direito */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Link to='/user' id='removerSublinhadoLink' sx={{ textDecoration: 'none' }}>
                <Typography variant="h5" sx={{
                  ml: '10px',
                  fontFamily: 'ITC Benguiat',
                  color: '#ffb48a',
                  marginTop: '5px',
                  marginRight: '5px' // Adiciona espaçamento à direita
                }}>
                  Usuário
                </Typography>
              </Link>
              <Box sx={{ borderRight: '1px solid #ffb48a', height: '20px', margin: '0 10px' }} />
              <Link to='/book' id='removerSublinhadoLink' sx={{ textDecoration: 'none' }}>
                <Typography variant="h5" sx={{
                  ml: '10px',
                  fontFamily: 'ITC Benguiat',
                  color: '#ffb48a',
                  marginTop: '5px',
                  marginRight: '5px' // Adiciona espaçamento à direita
                }}>
                  Livros
                </Typography>
              </Link>
              <Box sx={{ borderRight: '1px solid #ffb48a', height: '20px', margin: '0 10px' }} />
              <Link to='/publisher' id='removerSublinhadoLink' sx={{ textDecoration: 'none' }}>
                <Typography variant="h5" sx={{
                  ml: '10px',
                  fontFamily: 'ITC Benguiat',
                  color: '#ffb48a',
                  marginTop: '5px',
                  marginRight: '5px' // Adiciona espaçamento à direita
                }}>
                  Editoras
                </Typography>
              </Link>
            </Box>
  
          </Box>
  
        </Toolbar>
      </AppBar>
    </Box>
  );
  
  
  
}