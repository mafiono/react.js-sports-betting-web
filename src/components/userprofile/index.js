import React, { PureComponent } from 'react'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import  moment from 'moment'
import 'moment/locale/fr'
import {onFormInputFocus,onFormInputFocusLost,onSelect,makeToast, getCookie} from '../../common'
import { allActionDucer } from '../../actionCreator'
import {  PROFILE, MODAL } from '../../actionReducers'
import {validateEmail,validateFullname,validatePassword,validateUsername} from '../../utils/index'
import { calcMD5 } from '../../utils/jsmd5'
import API from '../../services/api'
import Lang from '../../containers/Lang'
import { translate } from '../Lang'
const $api = API.getInstance()
export default class UserProfile extends PureComponent{
    constructor(props){
        super(props)
        this.state={
        formType:1,
        showPass:false,
        username:this.props.profile.nickname,
        password:'',
        old_password:'',
        c_password:'',
        uid:getCookie('id'),
        AuthToken:getCookie('AuthToken'),
        email:this.props.profile.email,
        firstname:this.props.profile.firstName,
        lastname:this.props.profile.lastName,
        phoneNumber:this.props.profile.mobilenumber,
        idnumber:this.props.profile.idnumber,
        gender:this.props.profile.gender,
        birth_date:this.props.profile.birth_date?moment.unix(this.props.profile.birth_date).format('YYYY/MM/DD'):'',
        address:this.props.profile.address,
        document_type:this.props.profile.document_type,
        formStep:1,
        countdown:60,
        canResend:false,
        terms:false,
        phoneNumberEmpty:false,
        usernameEmpty:false,
        lastnameEmpty:false,
        firstnameEmpty:false,
        termsEmpty:false,
        passwordEmpty:false,
        }
        $api.setToken(this.state.AuthToken)
         this.onInputChange= this.onInputChange.bind(this)
         this.toggleShow= this.toggleShow.bind(this)
         this.changePass= this.changePass.bind(this)
    }
     componentDidMount() {
        moment.locale(this.props.appState.lang.substr(0,2))
       $("#datepickerBD").datepicker({ maxDate: new Date(moment().subtract(18, 'years')), onSelect: function () { onSelect('datepickerBD') },changeMonth: true,
        changeYear: true});
        $("#datepickerBD").datepicker("option", "dateFormat", "yy/mm/dd");
        $("#datepickerBD").datepicker("setDate", new Date(this.state.birth_date));
        this.setState({birth_date: moment( $("#datepickerBD").val()).format('YYYY/MM/DD')})
     }
     changeForm(type){
        type !== this.props.formType && this.props.changeForm(type)
        if(type===1){
            $("#datepickerBD").datepicker({ maxDate: new Date(moment().subtract(18, 'years')), onSelect: function () { onSelect('datepickerBD') },changeMonth: true,
            changeYear: true});
            $("#datepickerBD").datepicker("option", "dateFormat", "yy/mm/dd");
            $("#datepickerBD").datepicker("setDate", new Date(this.state.birth_date));
            this.setState({birth_date: moment( $("#datepickerBD").val()).format('YYYY/MM/DD')})
        }
     }
     toggleShow(){
        !this.state.changingpass &&this.setState(prevState=>({showPass: !prevState.showPass}));
      }
     onDateChangeBD(e) {
        e.persist()
        let val = e.target.value
        $("#datepickerBD").val(moment(val).format('YYYY/MM/DD'));
        this.setState({birth_date: moment(val).format('YYYY/MM/DD'),formEdited:true})
      }
     onInputChange(e){
        let $el = e.target,newState = {}
        newState[$el.name]= $el.value
        newState[$el.name+'Empty']= false
        if(!this.state.formEdited)newState['formEdited']= true
        this.setState(newState)
        }
    updateInfo(){
        this.setState({updatingInfo:true})
        const {username,phoneNumber,formEdited,birth_date,document_type,idnumber,uid,email,AuthToken,address,gender,firstname,lastname}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss')
        let p = {mobilenumber:phoneNumber,uid:uid,AuthToken:AuthToken,idnumber:idnumber||'',address:address,email:email,gender:gender,nickname:username,firstName:firstname,lastName:lastname,document_type:document_type,time:$time}
        if(birth_date!== '') p['birth_date'] = moment(birth_date).unix(); else  p['birth_date'] = 0
        const $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobilenumber${phoneNumber}email${email}time${$time}${this.props.appState.$publicKey}`)
        p.hash=$hash
        if(formEdited)$api.updateProfile(p,this.onEditSucess.bind(this))
        else {
            this.setState({updatingInfo:false})
            makeToast('Noting to Update!', 5000)
        }
    }
    changePass(){
        this.setState({changingpass:true})
        const {uid,AuthToken,password,old_password,phoneNumber}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
        $hash =calcMD5(`uid${uid}password${old_password}AuthToken${AuthToken}time${$time}${this.props.appState.$publicKey}`)
        $api.changePassword({uid:uid,old_pass:old_password,mobilenumber:phoneNumber,password:password,time:$time,hash:$hash,AuthToken:AuthToken},this.onPasswordChanged.bind(this))
    }
    onPasswordChanged({data}){
        if(data.status ===200){
             makeToast(data.msg,5000)
             this.props.dispatchLogout(1)
             this.props.dispatch(allActionDucer(MODAL,{modalOpen:false,type:0}))
        }
        this.setState({changingpass:false,formEdited:false})
        makeToast(data.msg,5000)
    }
    onEditSucess({data}){
        if(data.status ===200){
            const {username,phoneNumber,birth_date,document_type,idnumber,uid,email,address,gender}= this.state
            this.props.dispatch(allActionDucer(PROFILE,{birth_date:birth_date!==''?moment(birth_date).unix():0,mobile:phoneNumber,uid:uid,idnumber:idnumber,address:address,email:email,gender:gender,nickname:username,document_type:document_type}))
        }
        this.setState({edited:data.msg,updatingInfo:false,formEdited:false})
        makeToast(data.msg,5000)
    }
    render(){
         const {showPass,password,phoneNumber,email,username,c_password,updatingInfo,changingpass,phoneNumberEmpty,
            usernameEmpty,
            termsEmpty,firstnameEmpty,lastnameEmpty,emailEmpty,
            passwordEmpty,idnumber,birth_date,gender,address,document_type,old_password,lastname,firstname}=this.state,{formType,onClose,profile}=  this.props
        return(
            <div className="section-content col-sm-9">
                <div className="filter">
                <div className="header">
                    <div className="title" style={{ padding: '15px' }}><Lang word="My Profile"/></div>
                    <div onClick={() => { onClose() }} className="close uci-close"></div>
                </div>
                <div className="sorter">
                <div className={formType == 1? 'active' : ''} onClick={() => { this.changeForm(1) }}> <span><Lang word="Edit Profile"/> </span>
                </div>
                <div className={formType == 2 ? 'active' : ''} onClick={() => { this.changeForm(2) }}><span><Lang word="Change Password"/></span>
                </div>
                </div>
                </div>
                 {
                     formType === 1?
                     <div className="sb-login-form-container sign-up" >
                        <div style={{width:'100%'}}>
                        <div className="proifle-complete">
                            <div className="complete-state">
                                {
                                    profile.completeInfo?
                                    <div style={{height:'40px',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                                        <span className="icon-sb-success" style={{fontSize:'30px'}}></span>
                                        <span style={{fontSize:'14px',paddingLeft:'20px'}}><Lang word ="Great, Your profile is complete!"/></span>
                                    </div>
                                    :
                                    <div style={{height:'40px',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                                        <span className="uci-warning" style={{fontSize:'30px',color: '#b6862e'}}></span>
                                        <span style={{fontSize:'14px',paddingLeft:'20px',color: '#b6862e'}}><Lang word="Complete your profile and get free bonus!"/></span>
                                    </div>
                                }
                            </div>
                            <div className="more-info"></div>
                        </div>
                        <div className="liquid-container ember-view" style={{overflow:'visible'}}>
                            <div className="liquid-child ember-view" style={{overflow:'visible'}}>
                            <div data-step="sign-up" className="sb-login-step active ember-view">
                            <div className="sb-login-form-wrapper">
                            <div className={`form ${formType !==1? 'animated fadeOut':'fadeIn animated'}`} id="first-form">
                                        <div className="ember-view col-sm-6"><div className="form-group required">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                        <input value={profile.dialing_code+''+phoneNumber} className={`ember-text-field ember-view`} type="text" readOnly disabled/>
                                                        <span className={`placeholder ${phoneNumber ==='' && 'placeholder-inactive'}`}><Lang word="Phone Number"/></span>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>

                                            <div className="ember-view col-sm-6"><div className="form-group required">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                    <div className="field-icons-container ember-view">
                                                            {(username !=='' && !validateUsername(username)) &&<React.Fragment>
                                                            <div className="warning-block">
                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                            </div> <div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                                                <div className="field-message-wrapper">
                                                                    <span><Lang word="Nickname must be minimum of 6 characters"/></span>
                                                            </div></div></React.Fragment>}
                                                        </div>
                                                        <input name="username" value={username} className={`${(username !=='' && !validateUsername(username)) ||usernameEmpty? 'error animated pulse':''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly={profile.completeInfo?true:false} disabled={profile.completeInfo?true:false}/>
                                                        <span className={`placeholder ${username ==='' && 'placeholder-inactive'}`}><Lang word ="Nickname"/></span>

                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group required">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                    <div className="field-icons-container ember-view">
                                                            {((firstname !=='' && !validateFullname(firstname)) || firstnameEmpty) && <React.Fragment>
                                                            <div className="warning-block">
                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                            </div> <div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                                                <div className="field-message-wrapper">
                                                                    <span><Lang word ={(firstname !=='' && !validateFullname(firstname)) ? 'First name must be minimum of 2 characters': 'First name cannot be empty'}/></span>
                                                            </div></div></React.Fragment>}
                                                        </div>
                                                        <input name="firstname" value={firstname} className={`${(firstname !=='' && !validateFullname(firstname)) ||firstnameEmpty? 'error animated pulse':''} ember-text-field ember-view`} type="text" autoComplete="off" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly={profile.completeInfo?true:false} disabled={profile.completeInfo?true:false}/>
                                                        <span className={`placeholder ${firstname ==='' && 'placeholder-inactive'}`}><Lang word ="First Name"/></span>

                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group required">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                    <div className="field-icons-container ember-view">
                                                            {((lastname !=='' && !validateFullname(lastname)) || lastnameEmpty) &&<React.Fragment>
                                                            <div className="warning-block">
                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                            </div><div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                                                <div className="field-message-wrapper">
                                                                    <span><Lang word ={(lastname !=='' && !validateFullname(lastname)) ? 'Last name must be minimum of 2 characters': 'Last name cannot be empty'}/></span>
                                                            </div></div></React.Fragment>}
                                                        </div>
                                                        <input name="lastname" value={lastname} className={`${(lastname !=='' && !validateFullname(lastname)) ||lastnameEmpty? 'error animated pulse':''} ember-text-field ember-view`} type="text" autoComplete="off"  onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly={profile.completeInfo?true:false} disabled={profile.completeInfo?true:false}/>
                                                        <span className={`placeholder ${lastname ==='' && 'placeholder-inactive'}`}><Lang word ="Last Name"/></span>

                                                    </div>
                                                </div>
                                            </div>
                                            </div>

                                            <div className="ember-view col-sm-6"><div className="form-group ">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                        <select name="gender" style={{padding: '18px 10px 0'}} value={gender} className={` ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" disabled={profile.completeInfo?true:false}>
                                                            <option value="U">{translate(this.props.appState.lang,"Don't Specify")}</option>
                                                            <option value="M">{translate(this.props.appState.lang,"Male")}</option>
                                                            <option value="F">{translate(this.props.appState.lang,"Female")}</option>
                                                        </select>
                                                        <span className={`placeholder ${gender ==='' && 'placeholder-inactive'}`}><Lang word ="Gender"/></span>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group required">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                    <div className="field-icons-container ember-view">
                                                            {((email !=='' && !validateEmail(email)) || emailEmpty) &&<React.Fragment>
                                                            <div className="warning-block">
                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                            </div> <div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                                                <div className="field-message-wrapper">
                                                                    <span><Lang word={(email !=='' && !validateEmail(email)) ? 'Invalid email format': 'Email cannot be empty'}/></span>
                                                            </div></div></React.Fragment>}
                                                        </div>
                                                        <input name="email" value={email} className={`${email !=='' && !validateEmail(email)? 'error animated pulse':''} ember-text-field ember-view`} type="text" onChange={(e) =>(profile.email===''||profile.email===null)&& this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" disabled={profile.completeInfo||(profile.email!==''&&profile.email!==null)?true:false} readOnly={profile.completeInfo||(profile.email!==''&&profile.email!==null)?true:false}/>
                                                        <span className={`placeholder ${email ==='' && 'placeholder-inactive'}`}><Lang word="Email"/> </span>
                                                    </div>
                                                </div>
                                            </div>

                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group ">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                        <select name="document_type" style={{padding: '18px 10px 0'}} value={document_type} className={`ember-text-field ember-view`}  onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" disabled={profile.completeInfo?true:false}>
                                                            <option value="1">Identity Card/ID Book</option>
                                                            <option value="2">Passport</option>
                                                            <option value="3">Driver License</option>
                                                            <option value="4">Firearms License</option>
                                                            <option value="5">Other</option>
                                                        </select>
                                                        <span className={`placeholder ${document_type ==='' && 'placeholder-inactive'}`}><lang word="ID Type"/></span>
                                                    </div>
                                                </div>
                                            </div>

                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group ">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                        <input name="idnumber" value={idnumber} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly={profile.completeInfo?true:false} disabled={profile.completeInfo?true:false}/>
                                                        <span className={`placeholder ${idnumber ==='' && 'placeholder-inactive'}`}><Lang word="ID Card Number"/></span>
                                                    </div>
                                                </div>
                                            </div>

                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group ">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                    <input type="text" id="datepickerBD" name="birth_date" onChange={(e) => { this.onDateChangeBD(e) }} autoComplete="off" className={`ember-text-field ember-view`} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} readOnly={profile.completeInfo?true:false} disabled={profile.completeInfo?true:false}/>
                                                    <span className={`placeholder ${birth_date ==='' && 'placeholder-inactive'}`}><Lang word="Date of Birth"/></span>
                                                    </div>
                                                </div>
                                            </div>

                                            </div>
                                            <div className="ember-view col-sm-6"><div className="form-group ">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper ">
                                                        <input name="address" value={address} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly={profile.completeInfo?true:false} disabled={profile.completeInfo?true:false}/>
                                                        <span className={`placeholder ${address ==='' && 'placeholder-inactive'}`}><Lang word="Address"/></span>
                                                    </div>
                                                </div>
                                            </div>

                                            </div>
                                            <div className="error-box">
                                                <span></span>
                                            </div>
                                            {profile.completeInfo===0 &&<button onClick={this.updateInfo.bind(this)}  className="sb-account-btn btn-primary submit-join-now " type="submit" >
                                            {updatingInfo ?
                                                <div className="no-results-container sb-spinner">
                                                <span className="btn-preloader sb-preloader"></span>
                                                </div> 
                                                :<Lang word='Submit'/>}
                                            </button>}
                                        </div>
                            </div>
                            </div>
                            </div>
                        </div>
                </div>
                </div>
                :
                <div className="sb-login-form-container sign-in" >
                <div >
                        
                        <div className="liquid-container ember-view">
                            <div className="liquid-child ember-view">
                            <div data-step="sign-in" className="sb-login-step active ember-view">
                            <div className="sb-login-form-wrapper">
                            <div className={`form ${formType !==2? 'animated fadeOut':'fadeIn animated'}`} id="first-form">
                                <div className="form-group required">
                                    <div className="form-element empty">
                                        <div className="input-wrapper  show-password-switcher">
                                            <div className="field-icons-container ember-view">   
                                            <div className="password-visibility-block" onClick={this.toggleShow}>
                                            <span className={`password-visibility icon ${showPass ?'icon-sb-hide':'icon-sb-show'}`}></span>
                                            </div>
                
                                            </div>
                                            <input  name="old_password" value={old_password} required className="ember-text-field ember-view" type={showPass?"text":"password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange}/>
                                            <span className={`placeholder ${old_password ==='' && 'placeholder-inactive'}`}> Old Password</span>
                
                                    </div>
                                    </div>
                                </div>    
                                <div className="form-group required">
                                    <div className="form-element empty">
                                        <div className="input-wrapper  show-password-switcher">
                                        <div className="field-icons-container ember-view">
                                            {password!=='' && <div className="password-visibility-block" onClick={this.toggleShow} >
                                                <span className={`password-visibility icon ${showPass ?'icon-sb-hide':'icon-sb-show'}`} ></span>
                                            </div>}
                                            {((password !=='' && !validatePassword(password)) || passwordEmpty) && <React.Fragment>
                                            <div className="warning-block">
                                                <span className={`warning icon-sb-warning icon`} ></span>
                                            </div>  <div className="field-message-container ember-view" style={{right: 0, top: "-44px"}}>
                                                <div className="field-message-wrapper">
                                                    <span>{(password !=='' && !validatePassword(password)) ? 'Password must be minimum of 8 characters': 'Password cannot be empty'}</span>
                                            </div></div></React.Fragment>}
                                        </div>
                                            <input  name="password" value={password} required className="ember-text-field ember-view" type={showPass?"text":"password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange}/>
                                            <span className={`placeholder ${password ==='' && 'placeholder-inactive'}`}> New Password</span>
                
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
                                            <input  name="c_password" value={c_password} required className="ember-text-field ember-view" type={showPass?"text":"password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange}/>
                                            <span className={`placeholder ${c_password ==='' && 'placeholder-inactive'}`}>Confirm New Password</span>
                
                                    </div>
                                    </div>
                                </div>    
                                    <div className="error-box">
                                        <span></span>
                                    </div>
                                    <button onClick={this.changePass.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit" >
                                    {changingpass ?
                                        <div className="no-results-container sb-spinner">
                                        <span className="btn-preloader sb-preloader"></span>
                                        </div>
                                        :'Submit'}
                                    </button>
                                </div>
                            </div>
                            </div>
                            </div>
                        </div>
                </div>
                </div>
                 }
            </div>
        )
    }
}