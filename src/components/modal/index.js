import React, { PureComponent } from 'react'
import BetHistory from '../../containers/bethistory'
import { MODAL } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import UserProfile from '../../containers/userprofile'
import Wallet from '../../containers/wallet'
import Transactions from '../../containers/transactions'
import { clearToast, makeToast, onFormInputFocusLost, onFormInputFocus } from '../../common'
import { Help } from '../help'
import API from '../../services/api'
const $api = API.getInstance()
export default class AccModal extends PureComponent{
    constructor(props){
        super(props)
        this.state={amount:'',claimData:{isCash:null},amountEmpty:!1,depositWithdraw:{type:null,merchant:null,msg:null}}
        this.closeModal = this.closeModal.bind(this)
        this.changeTab = this.changeTab.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.copyToClipboard = this.copyToClipboard.bind(this)
        this.openInNewTab = this.openInNewTab.bind(this)
        this.confirmClaim = this.confirmClaim.bind(this)
    }

  componentWillUnmount(){
      clearToast()
   }
   onInputChange(e){
    let $el = e.target,newState = {}
    newState[$el.name]= $el.value
    newState[$el.name+'Empty']= false
    this.setState(newState)
    }
    closeModal() {
        this.props.dispatch(allActionDucer(MODAL,{modalOpen:false,type:null}))
    }
    changeTab(type) {
        this.props.dispatch(allActionDucer(MODAL,{type:type,tabType:1}))
    }
    changeForm(type) {
        this.props.dispatch(allActionDucer(MODAL,{tabType:type}))
    }
    claimDialog(dat){
      let settable = {}
      dat.type=== 1?settable.attempttingBonusClaim=!this.props.sb_modal.attempttingBonusClaim: settable.attempttingBonusWithdraw=!this.props.sb_modal.attempttingBonusWithdraw
      this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!this.props.sb_modal.showClaimDialog,...settable}))
      this.setState({claimData:dat})
    }
    depositSuccessDialog(data){
      this.props.dispatch(allActionDucer(MODAL,{showDepositDialog:!this.props.sb_modal.showDepositDialog}))
      this.setState({depositWithdraw:data})
    }
    withdrawSuccessDialog(data){
      this.props.dispatch(allActionDucer(MODAL,{showWithdrawalDialog:!this.props.sb_modal.showWithdrawalDialog}))
      this.setState({depositWithdraw:data})
    }
    confirmClaim(){
      if(this.state.claimData.isCash && this.state.amount ===''){
        this.setState({amountEmpty:true})
        return true
      }
      else
     {  
       let p  = {...this.state.claimData}
      p.isCash ===1 && (p.amount= this.state.amount)
       p.type === 1 ?$api.getBonus(p)
      .then(({ data }) => {
        this.setState({amountEmpty:false})
        this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!1,attempttingBonusClaim:!1}))
        makeToast(data.msg, 6000)
      }): $api.withdrawBonus(p)
      .then(({ data }) => {
        this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!1,attempttingBonusWithdraw:!1}))
        makeToast(data.msg, 6000)
      })}
    }
    cancelClaim(){
      this.props.dispatch(allActionDucer(MODAL,{showClaimDialog:!1,attempttingBonusClaim:!1,attempttingBonusWithdraw:!1}))
      this.setState({claimData:{isCash:null},amount:''})
     }
    cancelDepositDialog(){
      this.props.dispatch(allActionDucer(MODAL,{showDepositDialog:!1}))
      this.setState({depositWithdraw:{type:null,merchant:null,msg:null}})
     }
     cancelWithdrawalDialog(){
      this.props.dispatch(allActionDucer(MODAL,{showWithdrawalDialog:!1}))
      this.setState({depositWithdraw:{type:null,merchant:null,msg:null}})
     }
     copyToClipboard = str => {
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };
     openInNewTab(url) {
      var win = window.open(url, '_blank');
      win.focus();
    }
    render(){
         const{modalOpen,type,tabType,showClaimDialog,showDepositDialog,showWithdrawalDialog,attempttingBonusClaim,attempttingBonusWithdraw}  = this.props.sb_modal,{amount,claimData,amountEmpty,depositWithdraw}= this.state, {sportsbook,profile,sendRequest,dispatchLogout}= this.props, showStyles={opacity:1,pointerEvents:'unset'}
        return (
                <>
                <div className={`sb-modal sb-modal-backdrop`} style={modalOpen?{...showStyles}:{}}>
                  <div className="sb-modal-backdrop" style={showClaimDialog?{...showStyles}:{}}>
                  <div className="account-popup-container container-no-background">
                      <div className="account-popup-header">
                         {claimData.type ===1? 'Claim Bonus' :'Withdraw Bonus'}
                    </div>

                      <div className="account-popup-body-container">
                      {claimData.type ===2 &&<div className="account-popup-message"> Early withdrawal bonuses can cause losses!  <a onClick={this.closeModal} href="/bonus-terms"><span>Read Bonus Terms</span></a>
                      </div>}
                      <div className="account-popup-message">Are you sure want to {claimData.type===1 ?'claim this ' : 'withdraw '} bonus?
                      </div>
                            {
                              claimData.isCash === 1 && <div className="ember-view col-sm-4">
                              <div className="sb-login-form-container sign-in">
                              <div>
                              <div className="sb-login-form-wrapper">
                              <div className="form-group required">
                              <div className="form-element empty">
                                  <div className="input-wrapper  show-password-switcher">
                                      <div className="field-icons-container ember-view">
                                          {(amountEmpty) && <React.Fragment>
                                          <div className="warning-block">
                                              <span className={`warning icon-sb-warning icon`} ></span>
                                          </div>  <div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                              <div className="field-message-wrapper">
                                                  <span>Amount is Required</span>
                                          </div></div></React.Fragment>}
                                      </div>
                                      <input name="amount" value={amount} className={`${amountEmpty? 'error animated pulse':''} ember-text-field ember-view`} type="number" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                      <span className={`placeholder ${amount ==='' && 'placeholder-inactive'}`}>Amount</span>
                                  </div>
                              </div>
                          </div>
                          </div>
                          </div>
                          </div>
                          </div>
                            }
                          <div className="account-popup-buttons">
                                  <a  href=" " className="btn btn1" onClick={this.confirmClaim.bind(this)}>Yes {claimData.type ===2 &&' Withdraw'}</a>
                                  <a href=" " className="btn btn1 cancel" onClick={this.cancelClaim}>Cancel</a>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div className="sb-modal-backdrop" style={showDepositDialog?{...showStyles}:{}}>
                  <div className="account-popup-container container-no-background">
                      <div className="account-popup-header">
                         <span className={`${depositWithdraw?.status==200?"icon-sb-success":"icon-sb-error"}`}></span>
                         <span>{depositWithdraw?.status===200?"Success": "Falied"}</span>
                    </div>

                      <div className="account-popup-body-container">
                      <div className="account-popup-message" style={{fontWeight:"900", fontSize:"16px"}}>{depositWithdraw?.type!==1 ?'Thank you for making a deposit' : ''} 
                      </div>
                      <div className="account-popup-message">{depositWithdraw?.type!==1 ?`Please click Okay button or copy the URL to transfer the requested funds: ` : ''} 
                      </div>
                      {depositWithdraw?.type!==1 &&<div className="account-popup-message">
                        <div style={{backgroundColor:"#E7E7E7",borderRadius:"5px",height:"25px",margin:"5px",padding:"4px",textAlign:"center",fontSize:"15px"}}>{depositWithdraw.url } <span className="icon-copy" style={{height:"20px",margin:"5px",cursor:"pointer",color:"#08b981"}} onClick={ ()=>this.copyToClipboard(depositWithdraw.url)}></span></div> 
                      </div>}
                      {depositWithdraw?.type!==1 &&<div className="account-popup-message">Validation takes about 5-15 minutes depending of transaction volume. We advice you to only contact Live chat if your doposit does not reflect 15 minutes after after fund transfer
                      </div>}
                          <div className="account-popup-buttons">
                                  {/* <a className="btn btn1" onClick={this.confirmClaim.bind(this)}>Yes {claimData.type ===2 &&' Withdraw'}</a> */}
                                  <a className="btn btn1 cancel" onClick={()=>{this.openInNewTab(depositWithdraw.url);this.cancelDepositDialog()}}>Okay</a>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div className="sb-modal-backdrop" style={showWithdrawalDialog?{...showStyles}:{}}>
                  <div className="account-popup-container container-no-background">
                      <div className="account-popup-header" style={{backgroundColor:depositWithdraw?.status!==200&&"krimson"}}>
                         <span className={`${depositWithdraw?.status===200?"icon-sb-success":"icon-sb-error"}`}></span>
                         <span style={{marginLeft:'20px'}}>{depositWithdraw?.status===200?"Success": "Falied"}</span>
                    </div>

                      <div className="account-popup-body-container">
                      <div className="account-popup-message" style={{fontWeight:"900", fontSize:"16px"}}>{depositWithdraw?.status==200?'Thank you for betting with Us':"Sorry Something is was not right"} 
                      </div>
                      <div className="account-popup-message">
                        {depositWithdraw.msg}
                      </div>
                          <div className="account-popup-buttons">
                                  {/* <a className="btn btn1" onClick={this.confirmClaim.bind(this)}>Yes {claimData.type ===2 &&' Withdraw'}</a> */}
                                  <a className="btn btn1 cancel" onClick={()=>{this.cancelWithdrawalDialog()}}>Okay</a>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div className="sb-modal-content">
                    <div className="sb-modal-menu col-sm-3">
                      <div className="user-balance-section">
                        <div className="user">
                          <div className="avatar-container col-sm-2"><div className="user-avatar"></div></div>
                          <div className="number-id col-sm-10">
                            <span className="number">{profile.nickname} </span>
                            <span className="id">{profile.dailing_code}{profile.mobilenumber}</span>
                            {/* <span className="id">ID: {profile.idnumber}</span> */}
                          </div>
                        </div>
                        <div className="money">
                          <div className="main-balance">
                            <span>Main Balance</span>
                            <span>{profile.currency} {profile.balance}</span>
                          </div>
                          <div className="bonus-balance">
                            <span>Bonus Balance</span>
                            <span>{profile.bonus}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`menu-link-item ${type ===1 && 'active'}`} onClick={()=>this.changeTab(1)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-edit-profile"></span></div>
                        <div className="col-sm-11">Profile</div>
                      </div>
                      <div className={`menu-link-item ${type ===3 && 'active'}`} onClick={()=>this.changeTab(3)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-wallet"></span></div>
                        <div className="col-sm-11">Wallet</div>
                      </div>
                      <div className={`menu-link-item ${type ===2 && 'active'}`} onClick={()=>this.changeTab(2)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-my-bets"></span></div>
                        <div className="col-sm-11">Bets History</div>
                      </div>
                      <div className={`menu-link-item ${type ===4 && 'active'}`} onClick={()=>this.changeTab(4)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-my-bets"></span></div>
                        <div className="col-sm-11">Transactions</div>
                      </div>
                      {/* <div className={`menu-link-item ${type ===5 && 'active'}`} onClick={()=>this.changeTab(5)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-bonuses"></span></div>
                        <div className="col-sm-11">Bonuses</div>
                      </div> */}
                      {/* <div className={`menu-link-item ${type ===7 && 'active'}`} onClick={()=>this.changeTab(7)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-messages"></span></div>
                        <div className="col-sm-11">Messages</div>
                      </div> */}
                      <div style={{backgroundColor:'crimson'}}className={`menu-link-item ${type ===6 && 'active'}`} onClick={()=>this.changeTab(6)}>
                        <div className="col-sm-1"><span className="profile-icon icon-sb-info" style={{color:"#fff"}}></span></div>
                        <div className="col-sm-11" >Help</div>
                      </div>
                    </div>
                    {type === 2 ?
                    <BetHistory  onClose={this.closeModal}
                      sendRequest={sendRequest}
                      />
                    :type===1?
                    // <div><h3>Under Construction</h3></div>
                    <UserProfile changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                   :type===3?
                  //  <div><h3>Under Construction</h3></div>
                    <Wallet changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType} withdrawSuccessDialog={this.withdrawSuccessDialog.bind(this)} depositSuccessDialog={this.depositSuccessDialog.bind(this)}/>
                    :type===4?
                    <Transactions changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                    // :type===5?
                    // <Bonuses changeForm={this.changeForm.bind(this)}attempttingBonusClaim={attempttingBonusClaim} attempttingBonusWithdraw={attempttingBonusWithdraw} showClaimDialog={this.claimDialog.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType} currency={profile.currency}/>
                    :type===6?
                    <Help changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                    :type===7?
                    <Help changeForm={this.changeForm.bind(this)} dispatchLogout={dispatchLogout} onClose={this.closeModal} formType={tabType}/>
                  :null}
                  </div>
                </div>
                
                </>
        )
    }
}