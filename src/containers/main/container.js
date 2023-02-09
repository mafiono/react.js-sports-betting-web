import {connect} from 'react-redux'
import component from '../../views/main'

const mapStateToProps  = (state, ownProps)=>{
 return {
     appState: state.appState,
     sportsbook :state.sportsbook,
     profile:state.profile,
     modalOpen:state.sb_modal.modalOpen
 }
}

const mpaDispatchToProps=(dispatch,ownProps)=>{
  return {
    dispatch:dispatch
  }
}
export default connect(mapStateToProps,mpaDispatchToProps)(component)