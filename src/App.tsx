import React from 'react';
import Layout from './components/layout/Layout';
import { NotesProvider } from './context/NotesContext';

function App() {
  return (
    <NotesProvider>
      <Layout />
    </NotesProvider>
  );
}

export default App;
