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
// import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
// import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
// import ptLocale from 'date-fns/locale/pt-BR'
// import { parseISO } from 'date-fns'
// import { FormControlLabel, Switch } from '@mui/material'
// import InputAdornment from '@mui/material/InputAdornment'

// import publisherModel from '../models/publisher'
import { ZodError } from 'zod'


export default function PublisherForm() {

  const navigate = useNavigate()
  const params = useParams()

  const publisherDefaults = {
    name_publisher: '',
    city_publisher: '',
    state_publisher:''
  }

  const [state, setState] = React.useState({
    publisher: publisherDefaults, 
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
    publisher,
    // id,
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

  // useEffect com vetor de dependências vazio. Será executado
  // uma vez, quando o componente for carregado
  React.useEffect(() => {
    // Verifica se existe o parâmetro code na rota.
    // Caso exista, chama a função fetchData() para carregar
    // os dados indicados pelo parâmetro para edição
    fetchData(params.id)
  }, [])

  async function fetchData(isUpdating) {
    // Exibe o backdrop para indicar que uma operação está ocorrendo
    // em segundo plano
    setState({ ...state, showWaiting: true })
    try {

      let publisher = publisherDefaults

      // Se estivermos no modo de atualização, devemos carregar o
      // registro indicado no parâmetro da rota 
      if(isUpdating) {
        publisher = await myfetch.get(`publisher/${params.id}`)
        // publisher.selling_date = parseISO(publisher.selling_date)
      }

      // // Busca a listagem de clientes para preencher o componente
      // // de escolha
      // let id = await myfetch.get('id')

      // // Cria um cliente "fake" que permite não selecionar nenhum
      // // cliente
      // id.unshift({id: null, name_publisher: '(Sem Editora)'})

      // setState({ ...state, showWaiting: false, publisher, id })
      setState({ ...state, showWaiting: false, publisher})

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
    const newPublisher = { ...publisher }
    newPublisher[event.target.name] = event.target.value

    setState({ 
      ...state, 
      publisher: newPublisher,
      isFormModified: true      // O formulário foi alterado
    })
  }

  async function handleFormSubmit(event) {
    setState({ ...state, showWaiting: true }) // Exibe o backdrop
    event.preventDefault(false)   // Evita o recarregamento da página
  
    try {

      console.log({publisher})

      // Chama a validação da biblioteca Zod
      // publisher.parse(publisher)

      let result 
      // se id então put para atualizar
      if(publisher.id) result = await myfetch.put(`publisher/${publisher.id}`, publisher)
      //senão post para criar novo 
      else result = await myfetch.post('publisher', publisher)
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
  
  const statePublisher= ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
  
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
        Cadastro de Livros
      </Typography>

      <form onSubmit={handleFormSubmit}>

        <Box className="form-fields">
        
          <TextField 
            id="name_publisher"
            name="name_publisher" 
            label="Nome da Editora" 
            variant="filled"
            required
            fullWidth
            value={publisher.name_publisher}
            onChange={handleFieldChange}
            autoFocus
          />

          <TextField 
            id="city_publisher"
            name="city_publisher" 
            label="Cidade" 
            variant="filled"
            required
            fullWidth
            value={publisher.city_publisher}
            onChange={handleFieldChange}
          />
            
          <TextField
            id="state_publisher"
            name="state_publisher" 
            label="Estado"
            defaultValue=""
            fullWidth
            select
            required
            variant="filled"
            value={publisher.state_publisher}
            onChange={handleFieldChange}
          >
            {statePublisher.map((option) => (
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
          { JSON.stringify(publisher) }
        </Box> */}

      </form>
    </>

    
  )
}