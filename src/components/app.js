import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth} from '../actions/auth';

export class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn && !this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
      this.addActivityMonitor();
      this.startActivity();
      
    } else if (!nextProps.loggedIn && this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
      this.removeActivityMonitor();
      this.stopActivity();
      
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
    this.stopActivityMonitor();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => {
        console.log('every so and so');
        return this.props.dispatch(refreshAuthToken());
      },
      15 * 60 * 1000 // One hour
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  addActivityMonitor(){
    window.addEventListener('click', this.resetActivity);
  }

  removeActivityMonitor(){
    window.removeEventListener('click', this.stopActivity);
  }

  startActivity(){
    console.log('Started Activity!');
    this.interval = setInterval(()=>{
      this.props.dispatch(clearAuth());
    }, 15 * 1000);

  }

  stopActivity(){ 
    console.log('Stopped Activity');
    clearInterval(this.interval);
  }

  resetActivity = () => {
    console.log('CLICK');
    console.log('Resetting Activity...');
    if(this.interval){
      console.log('an activity exists... stopping activity');
      this.stopActivity();
    }
    console.log('starting activity again...');
    this.startActivity();
  }

  render() {
    return (
      <div className="app">
        <HeaderBar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
