import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopBar from './components/ui/TopBar'
import theme from './utils/theme'
import { ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import FooterBar from './components/ui/FooterBar'
import CssBaseline from '@mui/material/CssBaseline'

import Homepage from './pages/Homepage'

// import UsersList from './pages/UsersList'
// import UsersForm from './pages/UsersForm'

import BooksForm from './pages/BooksForm'
import BooksList from './pages/BooksList'

// import PublishersForm from './pages/PublishersForm'
// import PublishersList from './pages/PublishersList'


function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ 
            width: '100vw', 
            minHeight: '100vh', 
            backgroundColor: 'background.default' 
          }}>
            <TopBar />
            <Box sx={{
              margin: '25px 25px 55px 25px'
            }}>

              <Routes>
                <Route path="/" element={ <Homepage /> } />
                {/* <Route path="/user" element={ <UsersList /> } />
                <Route path="/user/new" element={ <UsersForm /> } />
                <Route path="/user/:id" element={ <UsersForm /> } /> */}
                <Route path="/book" element={ <BooksList /> } />
                <Route path="/book/new" element={ <BooksForm /> } />
                <Route path="/book/:id" element={ <BooksForm /> } />
                {/* <Route path="/publisher" element={ <PublishersList /> } />
                <Route path="/publisher/new" element={ <PublishersForm /> } />
                <Route path="/publisher/:id" element={ <PublishersForm /> } /> */}
              </Routes>

            </Box>
            <FooterBar />
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App
