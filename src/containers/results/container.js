
import {connect} from 'react-redux'
import component from '../../components/results'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        appState: state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)