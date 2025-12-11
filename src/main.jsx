import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import App from './App';
import './index.css';

const theme = createTheme({
  primaryColor: 'salad-green',
  colors: {
    'salad-green': [
      "#f2fcf5",
      "#e1f8e8",
      "#c1efcf",
      "#9ce5b3",
      "#74db96",
      "#57d383",
      "#44bd72",
      "#349659",
      "#287645",
      "#1e5835"
    ],
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
