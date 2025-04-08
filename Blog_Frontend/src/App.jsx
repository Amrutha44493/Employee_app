import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import AddEmployee from '../components/AddEmployee';
import EditEmployee from '../components/EditEmployee';
import LoginPage from '../components/LoginPage';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

function PrivateRoute({ children, isAdmin }) {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (isAdmin && userRole !== 'admin') {
    return <Navigate to="/employees" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/add"
            element={
              <PrivateRoute isAdmin>
                <AddEmployee />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <PrivateRoute isAdmin>
                <EditEmployee />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;