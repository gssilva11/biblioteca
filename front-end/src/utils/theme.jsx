import { createTheme } from '@mui/material/styles';
import { yellow, pink } from '@mui/material/colors';
import { ptBR } from '@mui/x-data-grid'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5d2417',
    },
    secondary: {
      main: '#ffb48a',
    },
  },
  typography: {
    h1: {
      fontSize: '30px',
      fontWeight: 'bold'
    }
  }
}, ptBR);

export default theme
