import {connect} from 'react-redux'
import component from '../../views/home'
const mapStateToProps = (state, ownProps) => {
    return {
        appState: state.appState,
        sportsbook: state.sportsbook,
        homeData:state.homeData,
        profile:state.profile
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
      dispatch:dispatch,
      ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)