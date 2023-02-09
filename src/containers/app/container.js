import {connect} from 'react-redux'
import component from '../../App'

const mapStateToProps  = (state, ownProps)=>{
 return {
     appState: state.appState
 }
}

const mpaDispatchToProps=(dispatch,ownProps)=>{
  return {
  }
}
export default connect(mapStateToProps,mpaDispatchToProps)(component)