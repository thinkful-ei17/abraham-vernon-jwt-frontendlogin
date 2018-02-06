import React from 'react';
import {connect} from 'react-redux';

import '../popup.css';

export class PopUp extends React.Component {
    componentDidMount() {
      //this.props.dispatch(fetchProtectedData());
    }

    render() {
        return (
            <div className="popUp">
              <p className="popUpText"> Are you still there? </p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps)(PopUp);
