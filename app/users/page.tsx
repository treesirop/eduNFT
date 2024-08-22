// pages/users.tsx
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NextPage } from 'next';

const UsersPage: NextPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users', {
        username,
        email,
        password,
      });
      setUsers([...users, response.data]);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
      <form onSubmit={(e) => { e.preventDefault(); createUser(); }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>Create User</button>
      </form>
    </div>
  );
};

export default UsersPage;