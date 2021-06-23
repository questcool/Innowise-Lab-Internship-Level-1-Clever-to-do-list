import React from 'react';

export const themes = {
  light: {
    fontcolor: 'black',
    backgroundbody: '#F5F5F5',
    backgrounditem: '#fafafa',
    dotcolor: 'grey',
    navbar: 'linear-gradient(#D9D9D9, white)',
    logoutbutton: 'linear-gradient(#D9D9D9, white)',
    selectmonthyear: 'white',
    buttoncolor: '#e3e3e3',
    inputfield: 'white',
    scrollbutton: 'linear-gradient(white, #D9D9D9)',
  },
  dark: {
    fontcolor: 'white',
    backgroundbody: '#595959',
    backgrounditem: '#6B6B6B',
    dotcolor: '#B8B8B8',
    navbar: 'linear-gradient(#BABABA, #666666)',
    logoutbutton: 'linear-gradient(#BABABA, #666666)',
    selectmonthyear: '#8F8F8F',
    buttoncolor: '#4782FF',
    inputfield: '#949494',
    scrollbutton: 'linear-gradient(#BABABA, #666666)',

  },
};

export const ThemeContext = React.createContext(themes.dark); // Set 'themes.dark' or 'themes.light'
