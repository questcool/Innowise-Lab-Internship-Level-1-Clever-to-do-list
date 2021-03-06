## 1. Task: [Innowise Lab Internship_ Level 1_ Clever to-do list](https://github.com/questcool/Innowise-Lab-Internship-Level-1-Clever-to-do-list/blob/master/Innowise%20Lab%20Internship_%20Level%201_%20Clever%20to-do%20list%20ed.docx)

## 2. How to run the app:

### `npm i`
Для запуска веб-приложения устанавливаем зависимости в проект.

### `npm start`
Запускаем приложение.
Открываем [http://localhost:3000](http://localhost:3000) в браузере.

### Краткое описание функционала:
- Для создания заметки мы выбираем день в календаре и нажимаем на кнопку "+ New task for [выбранная дата]".  
- Для изменения темы приложения: в файле ./src/Contexts/ThemeContext.js меняем код в 31 строке (там есть комментарий).  
- Для отображения дней в календаре от сегодняшнего и до конца текущего месяца, нажимаем на кнопку "Show from today", 
а чтобы вернуть обратно отображение всех дней нажимаем на неё же "Show all days".  

## 3. Database snapshot:
- Используется аутентификация пользователей по email.  
- Для хранения задач используется Firestore Database, в которой работают 2 коллекции: "users" (уникальные id пользователей) и "tasks"(ниже подробнее).  
  Коллекция "tasks" создаёт document (для каждой заметки) с уникальным названием, в котором содержится информация вида:  
  dayList: {  
    date: (string),  
    dayId: (number),  
    taskList: { title:(string), description:(string), isDone:(boolean) },  
    uid: (string) //уникальный id пользователя из коллекции "users"  
  }

## 4. Application stack
Приложение написано на функциональных компонентах, с использованием хуков.  
Создание приложения: Create React App.  
Навигация: React Router.  
Стили: CSS, React-Bootstrap.  
Форматирование кода: ESLint.

## 5. Структура папок:
Названия папок интуитивно понятны.  
- Папка ./src/Components хранит компоненты.  
- Папка ./src/Contexts хранит логику контекстов.  
- Папка ./src/Icons хранит графические файлы иконок.

