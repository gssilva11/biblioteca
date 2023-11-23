import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import myfetch from '../utils/myfetch'
import Waiting from '../components/ui/Waiting'
import Notification from '../components/ui/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ui/ConfirmDialog'
// import InputMask from 'react-input-mask'
// import InputAdornment from '@mui/material/InputAdornment'

// import userModel from '../models/user'
import { ZodError } from 'zod'


export default function UserForm() {

  const navigate = useNavigate()
  const params = useParams()

  const userDefaults = {
    email: '',
    name: '',
    code: '',
    phone: '',
    city: '',
    state: '',
    institution: '',
    role: ''
  }

  const [state, setState] = React.useState({
    user: userDefaults, 
    pubhisher_id: [],   
    showWaiting: false,
    notification: {
      show: false,
      severity: 'success',
      message: ''
    },
    openDialog: false,
    isFormModified: false
  })

  const {
    user,
    showWaiting,
    notification,
    openDialog,
    isFormModified
  } = state
  
  // const maskFormChars = {
  //   '9': '[0-9]',
  //   'A': '[A-Za-z]',
  //   '*': '[A-Za-z0-9]',
  //   '@': '[A-Ja-j0-9]', // Aceita letras de A a J (maiúsculas ou minúsculas) e dígitos
  //   '_': '[\s0-9]'
  // }
  
  const roleUser = ['STUDENT', 'EMPLOYEE', 'ADMIN']

  // useEffect com vetor de dependências vazio. Será executado
  // uma vez, quando o componente for carregado
  React.useEffect(() => {
    // Verifica se existe o parâmetro id na rota.
    // Caso exista, chama a função fetchData() para carregar
    // os dados indicados pelo parâmetro para edição
    fetchData(params.id)
  }, [])

  async function fetchData(isUpdating) {
    // Exibe o backdrop para indicar que uma operação está ocorrendo
    // em segundo plano
    setState({ ...state, showWaiting: true })
    try {

      let user = userDefaults

      // Se estivermos no modo de atualização, devemos carregar o
      // registro indicado no parâmetro da rota 
      if(isUpdating) {
        user = await myfetch.get(`user/${params.id}`)
      }

      setState({ ...state, showWaiting: false, user})

    } 
    catch(error) {
      setState({ ...state, 
        showWaiting: false, // Esconde o backdrop
        notification: {
          show: true,
          severity: 'error',
          message: 'ERRO: ' + error.message
        } 
      }) 
    }
  }

  function handleFieldChange(event) {
    const newUser = { ...user }
    newUser[event.target.name] = event.target.value

    setState({ 
      ...state, 
      user: newUser,
      isFormModified: true      // O formulário foi alterado
    })
  }

  async function handleFormSubmit(event) {
    setState({ ...state, showWaiting: true }) // Exibe o backdrop
    event.preventDefault(false)   // Evita o recarregamento da página
  
    try {

      console.log({user})

      // Chama a validação da biblioteca Zod
      // user.parse(user)

      let result 
      // se id então put para atualizar
      if(user.id) result = await myfetch.put(`user/${user.id}`, user)
      //senão post para criar novo 
      else result = await myfetch.post('user', user)
      setState({ ...state, 
        showWaiting: false, // Esconde o backdrop
        notification: {
          show: true,
          severity: 'success',
          message: 'Dados salvos com sucesso.'
        }  
      })  
    }
    catch(error) {
      if(error instanceof ZodError) {
        console.error(error)

        // Preenchendo os estado validationError
        // para exibir os erros para o usuário
        let valErrors = {}
        for(let e of error.issues) valErrors[e.path[0]] = e.message

        setState({
          ...state,
          validationErrors: valErrors,
          showWaiting: false, // Esconde o backdrop
          notification: {
            show: true,
            severity: 'error',
            message: 'ERRO: há campos inválidos no formulário.'
          }
        })
        
      }

      else setState({ ...state, 
        showWaiting: false, // Esconde o backdrop
        notification: {
          show: true,
          severity: 'error',
          message: 'ERRO: ' + error.message,
          validationErrors: {}
        } 
      })  
    }
  }

  function handleNotificationClose() {
    const status = notification.severity
    
    // Fecha a barra de notificação
    setState({...state, notification: { 
      show: false,
      severity: status,
      message: ''
    }})

    // Volta para a página de listagem
    if(status === 'success') navigate('..', { relative: 'path' })
  }

  function handleBackButtonClose(event) {
    // Se o formulário tiver sido modificado, abre a caixa de diálogo
    // para perguntar se quer mesmo voltar, perdendo as alterações
    if(isFormModified) setState({ ...state, openDialog: true })

    // Senão, volta à página de listagem
    else navigate('..', { relative: 'path' })
  }

  function handleDialogClose(answer) {

    // Fechamos a caixa de diálogo
    setState({ ...state, openDialog: false })

    // Se o usuário tiver respondido quer quer voltar à página
    // de listagem mesmo com alterações pendentes, faremos a
    // vontade dele
    if(answer) navigate('..', { relative: 'path' })
  }

  return(
    <>

      <ConfirmDialog
        title="Atenção"
        open={openDialog}
        onClose={handleDialogClose}
      >
        Há alterações que ainda não foram salvas. Deseja realmente voltar?
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
        display:'flex', 
        justifyContent:'center', 
        fontFamily:'ITC Benguiat',
        color:'#ffb48a'}}>
        Cadastro de Usuários
      </Typography>

      <form onSubmit={handleFormSubmit}>

        <Box className="form-fields">
        
          <TextField 
            id="cpf"
            name="cpf" 
            label="CPF" 
            variant="filled"
            required
            fullWidth
            value={user.cpf}
            onChange={handleFieldChange}
            autoFocus
          />

          <TextField 
            id="email"
            name="email" 
            label="E-mail" 
            variant="filled"
            required
            fullWidth
            value={user.email}
            onChange={handleFieldChange}
          />

          <TextField
            id="name"
            name="name" 
            label="Nome"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={user.name}
            onChange={handleFieldChange}
          />

          <TextField
            id="code"
            name="code" 
            label="Code"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={user.code}
            onChange={handleFieldChange}
          />

<         TextField
            id="phone"
            name="phone" 
            label="Telefone"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={user.phone}
            onChange={handleFieldChange}
          />

          <TextField
            id="city"
            name="city" 
            label="Cidade"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={user.city}
            onChange={handleFieldChange}
          />

          <TextField
            id="state"
            name="state" 
            label="Estado"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={user.state}
            onChange={handleFieldChange}
          />

          <TextField
            id="institution"
            name="institution" 
            label="Instituição"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={user.institution}
            onChange={handleFieldChange}
          />

          <TextField
            id="role"
            name="role" 
            label="Função"
            defaultValue=""
            fullWidth
            select
            required
            variant="filled"
            value={user.role}
            onChange={handleFieldChange}
          >
            {roleUser.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Toolbar sx={{ justifyContent:'space-around', display:'flex' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              type="submit"
            >
              Salvar
            </Button>
            
            <Button 
              color="secondary"
              variant="outlined"
              onClick={handleBackButtonClose}
            >
              Voltar
            </Button>
          </Toolbar>
        </Box>

        {/* <Box sx={{ fontFamily: 'monospace' }}>
          { JSON.stringify(user) }
        </Box> */}


      
      </form>
    </>

    
  )
}