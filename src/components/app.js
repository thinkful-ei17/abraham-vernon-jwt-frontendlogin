import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth} from '../actions/auth';

import Popup from './PopUp';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopUp: false
    };
  }

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
    window.removeEventListener('click', this.resetActivity);
  }

  showPopUp() {
    this.setState({showPopUp: true});
  }

  hidePopUp() {
    this.setState({showPopUp: false});
  }

  startActivity(){
    console.log('Started Activity!');

    this.intervalPopUp = setInterval(()=>{
      console.log('5 more seconds!!!!!!');
      this.showPopUp();

    }, 2 * 1000);

    console.log('id: ', this.intervalPopUp);

    this.interval = setInterval(()=>{
      this.props.dispatch(clearAuth());
    }, 15 * 1000);

    console.log('id: ', this.interval);

  }

  stopActivity(){
    console.log('Stopped Activity');
    console.log('id: ', this.intervalPopUp);
    console.log('id: ', this.interval);

    clearInterval(this.interval);
    clearInterval(this.intervalPopUp);

    console.log('I stopped the timers.. checking.. again....');
    console.log('id: ', this.intervalPopUp);
    console.log('id: ', this.interval);

    this.hidePopUp();

  }

  resetActivity = () => {
    console.log('CLICK');
    console.log('Resetting Activity...');

    this.hidePopUp();

    console.log('id: ', this.intervalPopUp);
    console.log('id: ', this.interval);

    if(this.interval && this.intervalPopUp){
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
        {this.state.showPopUp ? <Popup /> : ''  }
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
