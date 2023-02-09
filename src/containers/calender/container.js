
import {connect} from 'react-redux'
import component from '../../components/calender'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)