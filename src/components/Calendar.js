/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import classnames from 'classnames';
import * as calendar from '../calendarConfig';
import '../index.css';
import { ThemeContext, themes } from '../contexts/ThemeContext';

export default function Calendar(props) {
  const years = [2021, 2022, 2023, 2024, 2025];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentMonth = new Date().getMonth();
  const theme = useContext(ThemeContext);
  const monthNamesFromToday = monthNames.slice(currentMonth, 12);

  const [date, setDate] = useState(localStorage.getItem('date') ? new Date(Date.parse(localStorage.getItem('date'))) : new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFromTodayTasks, setIsFromTodayTasks] = useState(false);

  const yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1));

  function year() {
    return date.getFullYear();
  }

  function month() {
    return date.getMonth();
  }

  const handleMonthSelectChange = (e) => {
    setDate(new Date(year(), e.target.value));
  };

  const handleYearSelectChange = (e) => {
    setDate(new Date(e.target.value, month()));
  };

  const monthData = calendar.getMonthData(year(), month());

  const printedItems = [];
  monthData.forEach((el) => {
    el.forEach((el2) => {
      printedItems.push(el2);
    });
  });
  const printedItemsFromToday = printedItems.filter((date) => date >= yesterdayDate);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const ref = useRef();
  const myRef = useRef(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const el = ref.current;
    if (el) {
      const onWheel = (e) => {
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 4,
          behavior: 'smooth',
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  const backToTodaysTasks = () => {
    setDate(new Date());
    setTimeout(() => {
      const el = myRef.current;
      el.scrollIntoView({ inline: 'center' });
    }, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    props.handleDayClick(currentDate);
  };

  const showDaysFromToday = () => {
    setIsFromTodayTasks(!isFromTodayTasks);
    if (!isFromTodayTasks) {
      setDate(new Date());
      setTimeout(() => {
        const el = ref.current;
        el.scrollTo({
          left: 0,
        });
      }, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      props.handleDayClick(currentDate);
    } else {
      setDate(new Date());
      setTimeout(() => {
        const el = myRef.current;
        el.scrollIntoView({ inline: 'center' });
      }, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      props.handleDayClick(currentDate);
    }
  };

  const scrollLeftButton = () => {
    const el = ref.current;
    // eslint-disable-next-line prefer-destructuring
    let scrollLeft = el.scrollLeft;
    scrollLeft += 300;
    el.scrollLeft = scrollLeft;
  };

  const scrollRightButton = () => {
    const el = ref.current;
    // eslint-disable-next-line prefer-destructuring
    let scrollLeft = el.scrollLeft;
    scrollLeft -= 300;
    el.scrollLeft = scrollLeft;
  };

  const { myTasks } = props;

  useEffect(() => myRef.current.scrollIntoView({ inline: 'center' }), []);

  return (
    <div className="calendar">
      <header>
        {(date.getMonth() !== new Date().getMonth() || date.getFullYear() !== new Date().getFullYear()) && <button onClick={backToTodaysTasks} className={theme === themes.light ? 'scrollButtonLight' : 'scrollButtonDark'} style={{ backgroundColor: theme.buttoncolor, color: theme.fontcolor }} type="button">Back to today</button>}
        <select
          value={month()}
          onChange={handleMonthSelectChange}
          style={{ backgroundColor: theme.selectmonthyear, color: theme.fontcolor }}
        >
          {(isFromTodayTasks && 1 === 5 && (date.getFullYear() === new Date().getFullYear()) ? monthNamesFromToday : monthNames).map((name, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={year()}
          onChange={handleYearSelectChange}
          style={{ backgroundColor: theme.selectmonthyear, color: theme.fontcolor }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={showDaysFromToday} className={theme === themes.light ? 'scrollButtonLight' : 'scrollButtonDark'} style={{ backgroundColor: theme.buttoncolor, color: theme.fontcolor }} type="button">{isFromTodayTasks ? 'Show all days' : 'Show from today'}</button>

      </header>

      <div className="row">
        <div className="col-1">
          <button
            type="button"
            className={theme === themes.light ? 'scrollButtonLight' : 'scrollButtonDark'}
            onClick={scrollRightButton}
            style={{
              width: '100%', height: '100%', background: theme.scrollbutton, color: theme.fontcolor,
            }}
          >
            {'<'}
          </button>
        </div>
        <div className="col-10">
          <div className="horizontalscrollwrapper" ref={ref}>

            <table>
              <tbody>

                <tr className="week">
                  {(isFromTodayTasks ? printedItemsFromToday : printedItems).map((date, index) => (
                    <td className="weekdayname" key={index} style={{ color: theme.fontcolor }}>
                      {date && daysOfWeek[date.getDay()]}
                    </td>
                  ))}
                </tr>

                <tr className="week">
                  {(isFromTodayTasks ? printedItemsFromToday : printedItems).map((date1, index) => (date1 ? (
                    <td
                      ref={date1.getDate() === date.getDate() ? myRef : null}
                      key={index}
                      className={classnames('day', {
                        today: calendar.areEqual(date1, currentDate),
                        selected: calendar.areEqual(date1, props.selectedDate),
                      })}
                      onClick={() => props.handleDayClick(date1)}
                      style={{ color: theme.fontcolor }}
                    >
                      {date1 ? date1.getDate() : null}
                    </td>
                  ) : (
                    <td key={index} />
                  )))}
                </tr>

                <tr style={{
                  textAlign: 'center', height: '8 px',
                }}
                >

                  {(isFromTodayTasks ? printedItemsFromToday : printedItems).map((date, index) => (
                    <td key={index}>
                      {date && (myTasks.find((task) => task.dayList.date === date.toString()))
                  && (
                    <>
                      {myTasks.filter((task) => task.dayList.date === date.toString()).find((el) => el.dayList.taskList.isDone) && (
                        <span style={{
                          height: 7, width: 7, borderRadius: '50%', backgroundColor: theme.dotcolor, display: 'inline-block',
                        }}
                        />
                      )}
                      {' '}
                      {myTasks.filter((task) => task.dayList.date === date.toString()).find((el) => el.dayList.taskList.isDone === false) && (
                      <span style={{
                        height: 7, width: 7, borderRadius: '50%', backgroundColor: 'black', display: 'inline-block',
                      }}
                      />
                      )}
                    </>

                  )}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
        <div className="col-1">
          <button
            type="button"
            className={theme === themes.light ? 'scrollButtonLight' : 'scrollButtonDark'}
            onClick={() => scrollLeftButton()}
            style={{
              width: '100%', height: '100%', background: theme.scrollbutton, color: theme.fontcolor,
            }}
          >
            {'>'}
          </button>
        </div>

      </div>
    </div>
  );
}
