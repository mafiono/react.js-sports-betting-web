
import React, { PureComponent } from 'react';
import './App.css';
import  Main  from './containers/main';
import Casino from './containers/casino';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SlotGameBanner from './components/slotgamebanner';
import LoginForm from './components/login';

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route component={Main}/>
          <Route path="/casino" component={Casino}/>
          <Route path="/slotgamebanner" component={SlotGameBanner}/>
          <Route path="/login" component={LoginForm}/>
          <Route component={Main}/>
          </Switch>
      </Router>

    );
  }
}

export default App;
