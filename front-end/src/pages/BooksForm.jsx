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

// import bookModel from '../models/book'
import { ZodError } from 'zod'


export default function BookForm() {

  const navigate = useNavigate()
  const params = useParams()

  const bookDefaults = {
    title: '',
    author: '',
    year: '',
    belongs_to: '',
    status: ''
  }

  const [state, setState] = React.useState({
    book: bookDefaults, 
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
    book,
    // publisher_id,
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
  
  const statusBook = ['AVAILABLE', 'RESERVED', 'BORROWED']


  const years = []
  // Anos, do mais recente ao mais antigo
  for(let year = 2023; year >= 2000; year--) years.push(year)

  // useEffect com vetor de dependências vazio. Será executado
  // uma vez, quando o componente for carregado
  React.useEffect(() => {
    // Verifica se existe o parâmetro code na rota.
    // Caso exista, chama a função fetchData() para carregar
    // os dados indicados pelo parâmetro para edição
    fetchData(params.code)
  }, [])

  async function fetchData(isUpdating) {
    // Exibe o backdrop para indicar que uma operação está ocorrendo
    // em segundo plano
    setState({ ...state, showWaiting: true })
    try {

      let book = bookDefaults

      // Se estivermos no modo de atualização, devemos carregar o
      // registro indicado no parâmetro da rota 
      if(isUpdating) {
        book = await myfetch.get(`book/${params.code}`)
        // book.selling_date = parseISO(book.selling_date)
      }

      // // Busca a listagem de clientes para preencher o componente
      // // de escolha
      // let publisher_id = await myfetch.get('publisher_id')

      // // Cria um cliente "fake" que permite não selecionar nenhum
      // // cliente
      // publisher_id.unshift({id: null, name_publisher: '(Sem Editora)'})

      // setState({ ...state, showWaiting: false, book, publisher_id })
      setState({ ...state, showWaiting: false, book})

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
    const newBook = { ...book }
    newBook[event.target.name] = event.target.value

    setState({ 
      ...state, 
      book: newBook,
      isFormModified: true      // O formulário foi alterado
    })
  }

  async function handleFormSubmit(event) {
    setState({ ...state, showWaiting: true }) // Exibe o backdrop
    event.preventDefault(false)   // Evita o recarregamento da página
  
    try {

      console.log({book})

      // Chama a validação da biblioteca Zod
      // book.parse(book)

      let result 
      // se id então put para atualizar
      if(book.code) result = await myfetch.put(`book/${book.code}`, book)
      //senão post para criar novo 
      else result = await myfetch.post('book', book)
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

      <Typography variant="h1" sx={{ mb: '50px' }}>
        Cadastro de Livros
      </Typography>

      <form onSubmit={handleFormSubmit}>

        <Box className="form-fields">
        
          <TextField 
            id="title"
            name="title" 
            label="Título" 
            variant="filled"
            required
            fullWidth
            value={book.title}
            onChange={handleFieldChange}
            autoFocus
          />

          <TextField 
            id="author"
            name="author" 
            label="Autor" 
            variant="filled"
            required
            fullWidth
            value={book.author}
            onChange={handleFieldChange}
          />

          <TextField
            id="year"
            name="year" 
            label="Ano de publicação"
            select
            defaultValue=""
            fullWidth
            variant="filled"
            value={book.year}
            onChange={handleFieldChange}
            required
          >
            {years.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="belongs_to"
            name="belongs_to" 
            label="Instituição Proprietária"
            defaultValue=""
            fullWidth
            required
            variant="filled"
            value={book.belongs_to}
            onChange={handleFieldChange}
          />

          {/* <TextField
            id="publisher_id"
            name="publisher_id" 
            label="Editora"
            select
            defaultValue=""
            fullWidth
            variant="filled"
            helperText="Selecione a Editora"
            value={book.customer_id}
            onChange={handleFieldChange}
          >
            {publisher_id.map(publisher_id => (
              <MenuItem key={publisher_id.id_publisher} value={publisher_id.id_publisher}>
                {publisher_id.name_publisher}
              </MenuItem>
            ))}
          </TextField> */}

          <TextField
            id="status"
            name="status" 
            label="Status do livro"
            defaultValue=""
            fullWidth
            select
            required
            variant="filled"
            value={book.status}
            onChange={handleFieldChange}
          >
            {statusBook.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          
        </Box>

        <Box sx={{ fontFamily: 'monospace' }}>
          { JSON.stringify(book) }
        </Box>

        <Toolbar sx={{ justifyContent: "space-around" }}>
          <Button 
            variant="contained" 
            color="secondary" 
            type="submit"
          >
            Salvar
          </Button>
          
          <Button 
            variant="outlined"
            onClick={handleBackButtonClose}
          >
            Voltar
          </Button>
        </Toolbar>
      
      </form>
    </>

    
  )
}