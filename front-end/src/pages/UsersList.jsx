import React from 'react'
import Typography from '@mui/material/Typography'
// import Paper from '@mui/material/Paper';
// import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import myfetch from '../utils/myfetch'
import Notification from '../components/ui/Notification'
import Waiting from '../components/ui/Waiting'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';


export default function UsersList() {

  const [state, setState] = React.useState({
    users: [],
    openDialog: false,
    deleteId: null,
    showWaiting: false,
    notification: {
      show: false,
      severity: 'success',
      message: ''
    }
  })

  // Desestruturando as variáveis de estado
  const {
    users,
    openDialog,
    deleteId,
    showWaiting,
    notification
  } = state

  // Este useEffect() será executado apenas uma vez, durante o
  // carregamento da página
  React.useEffect(() => {
    loadData()    // Carrega dos dados do back-end
  }, [])

  async function loadData(afterDeletion = false) {
    // Exibe a tela de espera
    setState({ ...state, showWaiting: true, openDialog: false })
    try {
      const result = await myfetch.get('user?related=1')

      let notif = {
        show: false,
        severity: 'success',
        message: ''
      }

      if(afterDeletion) notif = {
        show: true,
        severity: 'success',
        message: 'Exclusão efetuada com sucesso.'
      }

      setState({
        ...state, 
        users: result, 
        showWaiting: false,
        openDialog: false,
        notification: notif
      })
    }
    catch(error) {
      setState({
        ...state,
        showWaiting: false,
        openDialog: false,
        notification: {
          show: true,
          severity: 'error',
          message: 'ERRO: ' + error.message
        }
      })
      // Exibimos o erro no console
      console.error(error)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 200
    },

    {
      field: 'code',
      headerName: 'Código',
      width: 200
    },
    {
      field: 'name',
      headerName: 'Nome',
      width: 200
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 200
    },
    {
      field: 'phone',
      headerName: 'Telefone',
      width: 200
    },
    {
      field: 'city',
      headerName: 'Cidade',
      width: 200
    },
    {
      field: 'state',
      headerName: 'Estado',
      width: 200
    },
    {
      field: 'institution',
      headerName: 'Instituição',
      width: 200
    },
    {
      field: 'role',
      headerName: 'Função',
      width: 200
    },

    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'left',
      align: 'left',
      width: 90,
      renderCell: params =>
        <Link to={'./' + params.id}>
          <IconButton aria-label="Editar">
            <EditIcon />
          </IconButton>
        </Link> 
    },
    {
      field: 'delete',
      headerName: 'Excluir',
      headerAlign: 'left',
      align: 'left',
      width: 90,
      renderCell: params =>
        <IconButton 
          aria-label="Excluir"
          onClick={() => handleDeleteButtonClick(params.id)}
        >
          <DeleteForeverIcon color="error" />
        </IconButton>
    }
  ];

  function handleDeleteButtonClick(id) {
    setState({ ...state, deleteId: id, openDialog: true })
  }

  async function handleDialogClose(answer) {
    // Fecha a caixa de diálogo de confirmação
    setState({ ...state, openDialog: false })

    if(answer) {
      try {
        // Faz a chamada ao back-end para excluir o cliente
        await myfetch.delete(`user/${deleteId}`)
        
        // Se a exclusão tiver sido feita com sucesso, atualiza a listagem
        loadData(true)
      }
      catch(error) {
        setState({
          ...state,
          showWaiting: false,
          openDialog: false,
          notification: {
            show: true,
            severity: 'error',
            message: 'ERRO: ' + error.message
          }
        })
        console.error(error)
      }
    }
  }

  function handleNotificationClose() {
    setState({...state, notification: { 
      show: false,
      severity: 'success',
      message: ''
    }});
  }
  
 
  return (
    <>
      <ConfirmDialog
        title="Confirmar operação"
        open={openDialog}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>
  
      <Waiting show={showWaiting} />
  
      <Notification
        show={notification.show}
        severity={notification.severity}
        message={notification.message}
        onClose={handleNotificationClose}
      />
  
  <Box sx={{ textAlign: 'left', ml: '20px', mt: '30px' }}>
        <Typography variant="h1" sx={{
          fontFamily: 'ITC Benguiat',
          color: '#ffb48a',
          fontSize: '2.5rem',
          mb:'20px'
        }}>
          Listagem de Usuários
        </Typography>
      </Box>
  
      <Box sx={{ position: 'absolute', top: 50, right: 5, margin: '15px' }}>
        <Link to="new">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddBoxIcon />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#ffb48a',
              '&:hover': {
                backgroundColor: '#e07d49',
              },
            }}
          >
            Novo
          </Button>
        </Link>
      </Box>
  
      <Paper elevation={4} sx={{ width: '100%', overflow: 'auto', backgroundColor: '#320000' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field} sx={{ borderBottom: '1px solid #e0e0e0', color: '#fff' }}>
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.field} sx={{ borderBottom: '1px solid #e0e0e0', padding: '16px', color: '#fff' }}>
                      {column.renderCell ? column.renderCell(row) : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
  

}