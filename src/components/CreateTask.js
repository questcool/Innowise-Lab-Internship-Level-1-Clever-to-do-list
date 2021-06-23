/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../Firebase';
import { ThemeContext, themes } from '../contexts/ThemeContext';

// eslint-disable-next-line space-before-blocks
export default function CreateTask(props){
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      history.push('/login');
    } catch {
      setError('Failed to log out');
    }
  }
  const location = useLocation();
  const isEdit = location.state && !!location.state.taskId;
  const taskDayId = location.state ? location.state.taskDayId : '';
  const selectedDate = location.state ? location.state.selectedDate : '';
  const taskIid = location.state ? location.state.taskId : '';
  const taskIsDone = location.state ? location.state.taskIsDone : '';
  const taskTitle = location.state ? location.state.taskTitle : '';
  const taskDescription = location.state ? location.state.taskDescription : '';
  const [title, setTitle] = useState(isEdit ? taskTitle : '');
  // eslint-disable-next-line no-unused-vars
  const [isDone, setIsDone] = useState(taskIsDone);
  const [description, setDescription] = useState(isEdit ? taskDescription : '');
  const theme = useContext(ThemeContext);

  function submitHandler(event) {
    event.preventDefault();
    if (title.trim()) {
    //   onCreate(title, description);
      setTitle('');
      setDescription('');
    }
  }
  const { match: { params: { id } } } = props;

  const setNewTask = async () => {
    await db.collection('tasks').add({
      dayList: {
        date: id,
        dayId: new Date().valueOf(), // for <li> unique key
        taskList: {
          title,
          description,
          isDone: false,
        },
        uid: currentUser.uid,
      },
    });
    localStorage.setItem('date', id);
    props.history.push('/');
  };

  // eslint-disable-next-line no-shadow
  const updateTask = async (taskIid) => {
    await db.collection('tasks').doc(taskIid).update({
      dayList: {
        date: id,
        dayId: taskDayId, // for <li> unique key
        taskList: {
          title,
          description,
          isDone: taskIsDone,
        },
        uid: currentUser.uid,
      },
    });
    localStorage.setItem('date', id);
    props.history.push('/');
  };
  return (
    <>
      <nav className="navbar navbar-light" style={{ background: theme.navbar }}>

        <p className="navbar-brand" style={{ color: theme.fontcolor, marginLeft: '1rem' }}>{`User: ${currentUser.email}`}</p>
        <h1 style={{ marginRight: '3rem', color: theme.fontcolor }}>Clever List</h1>
        <Button
          variant="button"
          className={theme === themes.light ? 'logoutButtonLight' : 'logoutButtonDark'}
          onClick={handleLogout}
          style={{
            background: theme.logoutbutton, marginRight: '1rem', padding: '0px', width: '80px', color: theme.fontcolor,
          }}
        >
          Log Out
        </Button>

      </nav>
      {error && <Alert variant="danger">{error}</Alert>}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h5 style={{ color: theme.fontcolor }}>{!isEdit ? selectedDate && `Create task for ${selectedDate.toLocaleDateString()}` : selectedDate && `Edit task for ${selectedDate.toLocaleDateString()}`}</h5>
      </div>

      <Form
        onSubmit={submitHandler}
        style={{
          marginTop: '3rem', width: '600px', marginRight: 'auto', marginLeft: 'auto',
        }}
      >
        <Form.Group>
          <Form.Label style={{ color: theme.fontcolor }}>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{ background: theme.inputfield, color: theme.fontcolor }}
            required
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label style={{ color: theme.fontcolor }}>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ background: theme.inputfield, color: theme.fontcolor }}
          />
        </Form.Group>
        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={isEdit ? () => updateTask(taskIid) : setNewTask}
            className={isEdit ? 'w-30 btn btn-secondary' : 'w-30 btn btn-primary'}
            type="submit"
            style={{ marginTop: '5%', marginRight: 'auto', marginLeft: 'auto' }}
          >
            {isEdit ? 'Update task' : 'Create task'}
          </Button>
        </div>
      </Form>
    </>
  );
}
