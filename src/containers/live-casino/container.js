import React from 'react'
import {connect} from 'react-redux'
import component from '../../views/live-casino'


const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        appState:state.appState,
        GamesBanner: state.casinoMode.GamesBanner
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)