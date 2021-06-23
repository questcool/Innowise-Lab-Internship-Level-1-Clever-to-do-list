import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signup from './LoginSignup/Signup';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
import Login from './LoginSignup/Login';
import PrivateRoute from './Privateroute';
import ForgotPassword from './LoginSignup/Forgotpassword';
import CreateTask from './CreateTask';
import { ThemeContext } from '../contexts/ThemeContext';

function App() {
  const theme = useContext(ThemeContext);
  return (

    <Container
      className="align-items-center justify-content-center"
      style={{ minHeight: '100vh', width: '762px', maxHeight: '100vh' }}
    >
      <div style={{ width: '762px', height: '762px' }}>
        <Router>
          <AuthProvider>
            <Switch>
              <ThemeContext.Provider value={theme}>
                <div style={{
                  alignItems: 'center', width: '350px', marginRight: 'auto', marginLeft: 'auto',
                }}
                >
                  <Route path="/signup" component={Signup} />
                  <Route path="/login" component={Login} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                </div>
                <div style={{ backgroundColor: theme.backgroundbody }}>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <PrivateRoute exact path="/createtask/:id" component={CreateTask} />
                </div>
              </ThemeContext.Provider>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
