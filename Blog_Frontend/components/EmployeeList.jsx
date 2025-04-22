import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../src/contexts/AuthContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, userRole, logout } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('📦 Fetched employees:', response.data);
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          setError('Failed to fetch employees: Received non-array data');
          console.error('Received non-array data:', response.data);
        }
      } catch (err) {
        setError('Failed to fetch employees');
        console.error('Error fetching employees:', err);
        if (err.response && err.response.data) {
          console.error('Server response:', err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEmployees();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (err) {
        setError('Failed to delete employee');
        console.error(err);
        if (err.response && err.response.data) {
          console.error('Server response:', err.response.data);
        }
      }
    }
  };

  const handleLogout = () => {
    logout();  
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ marginBottom: '16px' }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Employee List
      </Typography>
      <Button
  variant="contained"
  color="warning"
  onClick={handleLogout}
  sx={{ marginBottom: '16px', ml: 'auto', display: 'block' }} 
>
  Logout
</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Department</TableCell>
              {userRole === 'admin' && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {employee.name}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.department}</TableCell>
                {userRole === 'admin' && (
                  <TableCell align="right">
                    <IconButton component={Link} to={`/employees/edit/${employee._id}`} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(employee._id)} aria-label="delete">
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {userRole === 'admin' && (
        <Button
          component={Link}
          to="/employees/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Add New Employee
        </Button>
      )}
    </div>
  );
};

export default EmployeeList;
