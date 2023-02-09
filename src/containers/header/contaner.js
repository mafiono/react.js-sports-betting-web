import {connect} from 'react-redux'
import component from '../../components/header'

const mapStateToProps = (state, ownProps) => {
    return {
        appState: state.appState,
        profile: state.profile,
        searchData: state.sportsbook.searchData,
        searchDataC: state.sportsbook.searchDataC,
        searching:state.sportsbook.searching,
        activeView:state.sportsbook.activeView,
        Prematch:state.sportsbook.Prematch,
        Live:state.sportsbook.Live,
        searchingTicket:state.sportsbook.searchingTicket,
        site_recaptch_key:state.sportsbook.site_recaptch_key,
        checkResult:state.sportsbook.checkResult,
        config: state.sportsbook.config,
        casinoMode:state.casinoMode,
        oddType:state.sportsbook.oddType,
        appTheme:state.sportsbook.appTheme
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
      dispatch:dispatch,
      ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)