import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
// import { format } from 'date-fns'
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

export default function PublishersList() {

  const [state, setState] = React.useState({
    publishers: [],
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
    publishers,
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
      const result = await myfetch.get('publisher?related=1')

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
        publishers: result, 
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
    { field: 'id_publisher', headerName: 'ID', width: 90 },
    {
      field: 'name_publisher',
      headerName: 'Editora',
      width: 150
    },
    {
      field: 'city_publisher',
      headerName: 'Cidade',
      align: 'left',
      headerAlign: 'left',
      width: 150
    },
    {
      field: 'state_publisher',
      headerName: 'Estado',
      width: 150
    },
    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'left',
      align: 'left',
      width: 90,
      renderCell: params =>
        <Link to={'./' + params.id_publisher}>
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
          onClick={() => handleDeleteButtonClick(params.id_publisher)}
        >
          <DeleteForeverIcon color="error" />
        </IconButton>
    }
  ];

  function handleDeleteButtonClick(id_publisher) {
    setState({ ...state, deleteId: id_publisher, openDialog: true })
  }

  async function handleDialogClose(answer) {
    // Fecha a caixa de diálogo de confirmação
    setState({ ...state, openDialog: false })

    if(answer) {
      try {
        // Faz a chamada ao back-end para excluir o cliente
        await myfetch.delete(`publisher/${deleteId}`)
        
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

      <Typography variant="h1" sx={{ 
        mb: '50px' , 
        fontFamily:'ITC Benguiat',
        color:'#ffb48a'}}>
        Listagem de Editoras
      </Typography>

      <Box sx={{
        display: 'flex',
        justifyContent: 'right',
        mb: '25px'  // margin-bottom
      }}>
        <Link to="new">
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            startIcon={<AddBoxIcon />}
          >
            Cadastrar nova Editora
          </Button>
        </Link>
      </Box>

      <Paper elevation={4} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={publishers}
          columns={columns}
          getRowId={(row) => row.id_publisher}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  )
}