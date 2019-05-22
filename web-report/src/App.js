import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';

import './App.css';

const App = () => (
  <Switch>
    <Route exact={true} path="/" component={HomePage} />
  </Switch>
);

export default App;
