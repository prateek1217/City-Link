import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogout = () => {}

  return (
    <div>
      <h1 className='text-3xl font-bold'>Dashboard (Protected)</h1>
      {user ? (
        <>
          <p>Welcome to your dashboard, {user.fullName}!</p> 
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </div>
  );
}

export default Dashboard;