import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';

const EditEmployee = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:4000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email, designation, department } = response.data;
        setName(name || '');
        setEmail(email || '');
        setDesignation(designation || '');
        setDepartment(department || '');
      } catch (err) {
        setError('Failed to fetch employee details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(
        `http://localhost:4000/api/employees/${id}`,
        { name, email, designation, department },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
      console.error(err);
    }
  };

  if (loading) return <p>Loading employee data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Edit Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
