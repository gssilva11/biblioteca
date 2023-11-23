import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import imageBook from '../assets/livro.png'
import imageUser from '../assets/usuario.png'
import imagePublisher from '../assets/editora.png'
import { Link } from 'react-router-dom'
export default function Homepage() {

  return (
    <>
      <Typography variant="h1" sx={{
        display: 'flex',
        justifyContent:'center',
        mt:'40px',
        mb:'100px',
        fontFamily:'ITC Benguiat',
        color:'#ffb48a'
        
      }}>
        SEJA BEM VINDO(A) À BIBLIOTECA!
      </Typography>
      
      <Box
        sx={{
          display:'flex',
          justifyContent:'space-around'
        }}
      >
        <Box sx={{
          textAlign: 'center',
          '& img': {
            maxWidth: '300px',
            width: '80%',
            borderRadius:'10px'
          }
        }}>
          <Link to='/user/new'>
            <img 
              src={imageUser} alt="Cadastrar Usuários" 
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </Box>
        <Box sx={{
          textAlign: 'center',
          '& img': {
            maxWidth: '300px',
            width: '80%',
            borderRadius:'10px'

          }
        }}>
          <Link to='/book/new'>
            <img 
              src={imageBook} alt="Cadastrar Usuários" 
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </Box>
        <Box sx={{
          textAlign: 'center',
          '& img': {
            maxWidth: '300px',
            width: '80%',
            borderRadius:'10px'
          }
        }}>
          <Link to='/publisher/new'>
            <img 
              src={imagePublisher} alt="Cadastrar Usuários" 
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </Box>
      </Box>
    </>
  )
}