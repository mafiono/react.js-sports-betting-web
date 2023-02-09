
import {connect} from 'react-redux'
import component from '../../components/bethistory'

const mapStateToProps = (state) => {
    return {
        sportsbook: state.sportsbook,
        appState: state.appState,
        profile: state.profile
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)