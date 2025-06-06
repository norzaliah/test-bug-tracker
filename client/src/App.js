import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Bugs from './pages/Bugs';
import BugDetails from './pages/BugDetails';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme();

function App() {
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                <Route index element={<Bugs />} />
                <Route path="bugs/:id" element={<BugDetails />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;