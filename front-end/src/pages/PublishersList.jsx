import React from 'react';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import myfetch from '../utils/myfetch';
import Notification from '../components/ui/Notification';
import Waiting from '../components/ui/Waiting';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

export default function PublishersList() {
  const [state, setState] = React.useState({
    publishers: [],
    openDialog: false,
    deleteId: null,
    showWaiting: false,
    notification: {
      show: false,
      severity: 'success',
      message: '',
    },
  });

  const { publishers, openDialog, deleteId, showWaiting, notification } = state;

  React.useEffect(() => {
    loadData();
  }, []);

  async function loadData(afterDeletion = false) {
    setState({ ...state, showWaiting: true, openDialog: false });
    try {
      const result = await myfetch.get('publisher?related=1');

      let notif = {
        show: false,
        severity: 'success',
        message: '',
      };

      if (afterDeletion)
        notif = {
          show: true,
          severity: 'success',
          message: 'Exclusão efetuada com sucesso.',
        };

      setState({
        ...state,
        publishers: result,
        showWaiting: false,
        openDialog: false,
        notification: notif,
      });
    } catch (error) {
      setState({
        ...state,
        showWaiting: false,
        openDialog: false,
        notification: {
          show: true,
          severity: 'error',
          message: 'ERRO: ' + error.message,
        },
      });
      console.error(error);
    }
  }

  const columns = [
    { field: 'id_publisher', headerName: 'ID', width: 90 },
    { field: 'name_publisher', headerName: 'Editora', width: 150 },
    { field: 'city_publisher', headerName: 'Cidade', align: 'left', headerAlign: 'left', width: 150 },
    { field: 'state_publisher', headerName: 'Estado', width: 150 },
    {
      field: 'edit',
      headerName: 'Editar',
      headerAlign: 'left',
      align: 'left',
      width: 90,
      renderCell: (params) => (
        <Link to={'./' + params.id_publisher}>
          <IconButton aria-label="Editar">
            <EditIcon />
          </IconButton>
        </Link>
      ),
    },
    {
      field: 'delete',
      headerName: 'Excluir',
      headerAlign: 'left',
      align: 'left',
      width: 90,
      renderCell: (params) => (
        <IconButton aria-label="Excluir" onClick={() => handleDeleteButtonClick(params.id_publisher)}>
          <DeleteForeverIcon color="error" />
        </IconButton>
      ),
    },
  ];

  function handleDeleteButtonClick(id_publisher) {
    setState({ ...state, deleteId: id_publisher, openDialog: true });
  }

  async function handleDialogClose(answer) {
    setState({ ...state, openDialog: false });

    if (answer) {
      try {
        await myfetch.delete(`publisher/${deleteId}`);
        loadData(true);
      } catch (error) {
        setState({
          ...state,
          showWaiting: false,
          openDialog: false,
          notification: {
            show: true,
            severity: 'error',
            message: 'ERRO: ' + error.message,
          },
        });
        console.error(error);
      }
    }
  }

  function handleNotificationClose() {
    setState({
      ...state,
      notification: {
        show: false,
        severity: 'success',
        message: '',
      },
    });
  }

  return (
    <>
      <ConfirmDialog
        title="Confirmar operação"
        open={openDialog}
        onClose={handleDialogClose}
        okButtonProps={{ style: { backgroundColor: '#ffb48a' } }} // Set the color for the "OK" button
        cancelButtonProps={{ style: { backgroundColor: '#ffb48a' } }} // Set the color for the "VOLTAR" button
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
        }}>
          Listagem de Editoras
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

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}>
        <Paper elevation={4} sx={{ width: '50%', overflow: 'auto', backgroundColor: '#320000' }}>
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
                {publishers.map((row) => (
                  <TableRow key={row.code}>
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
      </Box>
    </>
  );
}
