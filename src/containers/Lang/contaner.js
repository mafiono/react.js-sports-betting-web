import {connect} from 'react-redux'
import component from '../../components/Lang'

const mapStateToProps = (state, ownProps) => {
    return {
        user_lang: state.appState.lang,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
      dispatch:dispatch,
      ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)