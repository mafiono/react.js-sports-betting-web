import React, { PureComponent } from 'react'
import {onFormInputFocus,onFormInputFocusLost} from '../../common'
 export default class KYCForm extends PureComponent{
  constructor(props){
    super(props)
    this.state={
      showPass:false,
      username:'',
      password:'',
      email:'',
    }
    this.toggleShow = this.toggleShow.bind(this);
    this.onInputChange = this.onInputChange.bind(this)
    this.attemptLogin = this.attemptLogin.bind(this)
    this.errMSG= {PhoneErr:'Invalid E-mail address',AccOrPassErr:'Unkown Account or Wrong Password'}
  }
  onInputChange(e){
    let $el = e.target,newState = {}
    newState[$el.name]= $el.value
    this.setState(newState)
  }
  attemptLogin(){
    const {password,email}=this.state
    this.props.onSubmit({email:email,password:password})
  }
toggleShow(){
  !this.props.attemptingLogin &&this.setState(prevState=>({showPass: !prevState.showPass}));
}
     render(){
      const {showPass,password,email}=this.state,{loginHasError,
        loginErrorMSG}= this.props.errorState,{attemptingLogin}=this.props
         return(
            <div className="sb-login-form-container sign-in">
            <div>
            <span onClick={this.props.onClose} className="sb-login-form-close icon-icon-close-x"></span>
              <div className="liquid-container ember-view" ><div className="liquid-child ember-view" style={{ top: "0px", left: "0px", opacity: "1" }}>
                <div data-step="sign-in" id="ember129058" className="sb-login-step active ember-view">  <div className="title">
                  <span>Account Verification</span>
                </div>
  
                  <div className="sb-login-form-wrapper">
                    <div className="social-icons">
                    </div>
                      <div className="form-group required">
                        <div className="form-element empty">
                          <div className="input-wrapper ">
  
                          <input disabled={attemptingLogin} name="email" value={email} className="ember-text-field ember-view" autoFocus={true} type="text" onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange}/>
                              <span className="placeholder placeholder-inactive">E-Mail</span>
  
                          </div>
                        </div>
                      </div>
  
                      <div className="form-group required">
                        <div className="form-element empty">
                          <div className="input-wrapper  show-password-switcher">
                            <div className="field-icons-container ember-view">   
                             <div className="password-visibility-block" onClick={this.toggleShow}>
                              <span className={`password-visibility icon ${showPass ?'icon-sb-hide':'icon-sb-show'}`}></span>
                            </div>
  
                            </div>
                            <input disabled={attemptingLogin} name="password" value={password} required className="ember-text-field ember-view" type={showPass?"text":"password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange}/>
                            <span className="placeholder placeholder-inactive">Password</span>
  
                          </div>
                        </div>
                      </div>
                      <div className="error-box">
                        <span>{loginHasError? this.errMSG[loginErrorMSG]?this.errMSG[loginErrorMSG]:loginErrorMSG:''}</span>
                      </div>
                      <button className="sb-account-btn btn-primary" onClick={this.attemptLogin} disabled={email==='' || password===''}>
                      {attemptingLogin ?
                            <div className="no-results-container sb-spinner">
                              <span className="btn-preloader sb-preloader"></span>
                            </div>
                            : 'Login'}
                      </button>

                    <div className="footer">
                      <div>
                        <span  className="as-link forgot-password step-change" data-step="forgot-password" data-side="left"><a onClick={()=>this.props.changeForm({formType:'forgotpassword'})}>Forgot password?</a></span>
                      </div>
                      <div>
                        <span  className="as-link step-change" data-step="sign-up" data-side="left"><a onClick={()=>{this.props.changeForm({formType:'register'})}}>Register</a></span>
                      </div>
                    </div>
                  </div>
  
                </div>
              </div></div>    </div>
          </div>
         )
     }
 }