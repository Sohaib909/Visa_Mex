import React from 'react';
import AppRouter from './routes/AppRouter';
import './App.css';

const App = React.memo(() => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
});

App.displayName = 'App';

export default App;
