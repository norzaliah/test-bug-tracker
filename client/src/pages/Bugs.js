import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBugs, createBug } from '../features/bugs/bugsSlice';
import { Container, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import BugTable from '../components/BugTable';
import BugFormModal from '../components/BugFormModal';

const Bugs = () => {
  const dispatch = useDispatch();
  const { bugs, status, error } = useSelector((state) => state.bugs);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBugs());
  }, [dispatch]);

  const handleSubmit = (bugData) => {
    dispatch(createBug(bugData));
    setOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Bug Tracker</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Bug
        </Button>
      </Box>

      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === 'succeeded' && <BugTable bugs={bugs} />}

      <BugFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default Bugs;