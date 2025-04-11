import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';
const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        'http://localhost:4000/api/employees',
        { name, email, designation, department },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add New Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;