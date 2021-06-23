/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, ListGroup } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { db } from '../Firebase';
// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-named-as-default
import Calendar from './Calendar';
import trashDeleteImage from '../icons/trashDelete.png';
import pencilEditImage from '../icons/pencilEdit.png';
import trashDeleteImageDark from '../icons/trashDeleteDark.png';
import pencilEditImageDark from '../icons/pencilEditDark.png';
import '../index.css';
import { ThemeContext, themes } from '../contexts/ThemeContext';

export default function Dashboard() {
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
  const theme = useContext(ThemeContext);
  const [myTasks, setMyTasks] = useState([]);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(localStorage.getItem('date') ? new Date(Date.parse(localStorage.getItem('date'))) : currentDate);

  useEffect(() => {
    db.collection('tasks').get().then((querySnapshot) => {
      const taskList = [];
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        if (task.dayList.uid === currentUser.uid) {
          task.id = doc.id;
          taskList.push(task);
        }
      });
      setMyTasks(taskList);
    });
  }, []);

  useEffect(() => function cleanLocalStorage() { localStorage.removeItem('date'); });

  const handleDayClick = (date) => {
    setSelectedDate(date);
    localStorage.setItem('date', date);
  };

  const tasksForToday = myTasks.filter((task) => task.dayList.date === selectedDate.toString());

  const toggleIsDone = async (id, title, description, isDone, date, dayId) => {
    await db.collection('tasks').doc(id).update({
      dayList: {
        date,
        dayId, // for <li> unique key
        taskList: {
          title,
          description,
          isDone: !isDone,
        },
        uid: currentUser.uid,
      },
    });
    await db.collection('tasks').get().then((querySnapshot) => {
      const taskList = [];
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        if (task.dayList.uid === currentUser.uid) {
          task.id = doc.id;
          taskList.push(task);
        }
      });
      setMyTasks(taskList);
    });
  };

  const deleteTask = async (id) => {
    await db.collection('tasks').doc(id).delete();
    await db.collection('tasks').get().then((querySnapshot) => {
      const taskList = [];
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        if (task.dayList.uid === currentUser.uid) {
          task.id = doc.id;
          taskList.push(task);
        }
      });
      setMyTasks(taskList);
    });
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
      <div style={{ marginTop: '3rem' }}>
        <Calendar
          handleDayClick={handleDayClick}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          myTasks={myTasks}
        />
      </div>
      <h4 style={{ textAlign: 'center', marginTop: '2rem', color: theme.fontcolor }}>
        {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString()}` : 'Please select a date'}
      </h4>
      <div style={{ maxHeight: '500px', marginTop: '2rem', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {/* {selectedDate && (tasksForToday.length !== 0 ? (tasksForToday.map((task) => ( */}
          {selectedDate && (tasksForToday.length !== 0 ? (tasksForToday.sort((a, b) => a.dayList.dayId - b.dayList.dayId).map((task) => (
            <ListGroup.Item
              key={task.dayList.dayId}
              style={task.dayList.taskList.isDone ? {
                listStyleType: 'none',
                textDecoration: 'line-through',
                textDecorationThickness: '3px',
                backgroundColor: theme.backgrounditem,
              } : { listStyleType: 'none', backgroundColor: theme.backgrounditem }}
            >
              <Link
                type="button"
                className="editDeleteButton"
                to={{
                  pathname: `/createtask/${selectedDate}`,
                  state: {
                    // eslint-disable-next-line object-shorthand
                    selectedDate: selectedDate,
                    taskId: task.id,
                    taskDayId: task.dayList.dayId,
                    taskTitle: task.dayList.taskList.title,
                    taskDescription: task.dayList.taskList.description,
                    taskIsDone: task.dayList.taskList.isDone,
                  },
                }}
              >
                <img src={theme === themes.light ? pencilEditImage : pencilEditImageDark} alt="trash" style={{ height: '27px' }} />
              </Link>
              <Link type="button" to={{ pathname: '/' }} className="editDeleteButton" onClick={() => deleteTask(task.id)}><img src={theme === themes.light ? trashDeleteImage : trashDeleteImageDark} alt="pencil" style={{ height: '30px' }} /></Link>
              <input
                type="checkbox"
                style={{
                  marginLeft: '1rem', width: '18px', height: '18px',
                }}
                checked={task.dayList.taskList.isDone}
                onChange={() => toggleIsDone(task.id, task.dayList.taskList.title, task.dayList.taskList.description, task.dayList.taskList.isDone, task.dayList.date, task.dayList.dayId)}
              />
              <span style={{ marginLeft: '1rem', fontSize: '22px', color: theme.fontcolor }}>
                {' '}
                {task.dayList.taskList.title}
              </span>
              <p style={{ color: theme.fontcolor }}>{task.dayList.taskList.description}</p>
              {' '}
              {/* <Button variant="secondary" style={{ marginRight: '8px' }}>Edit</Button> */}

            </ListGroup.Item>
          ))) : <div style={{ textAlign: 'center', color: theme.fontcolor }}><h5>No tasks...</h5></div>)}
        </ListGroup>
      </div>
      <Link
        type="button"
        className="btn btn-primary"
        style={{
          marginLeft: '280px', marginTop: '3rem', marginBottom: '3 rem',
        }}
        to={{
          pathname: `/createtask/${selectedDate}`,
          state: {
            // eslint-disable-next-line object-shorthand
            selectedDate: selectedDate,
          },
        }}
      >
        {`+ New task for ${selectedDate.toLocaleDateString() !== new Date().toLocaleDateString() ? selectedDate.toLocaleDateString() : 'today'} `}
      </Link>
    </>
  );
}
