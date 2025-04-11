import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, userRole } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:4000/api/employees', {
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
        await axios.delete(`http://localhost:4000/api/employees/${id}`, {
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

  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Department</th>
            {userRole === 'admin' && (
              <th>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.designation}</td>
              <td>{employee.department}</td>
              {userRole === 'admin' && (
                <td>
                  <Link to={`/employees/edit/${employee._id}`}>Edit</Link>
                  <button onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {userRole === 'admin' && (
        <Link to="/employees/add">Add New Employee</Link>
      )}
    </div>
  );
};

export default EmployeeList;