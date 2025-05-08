import React from 'react';
import Layout from './components/layout/Layout';
import { NotesProvider } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <Layout />
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
