import React, { PureComponent } from 'react'
import API from '../../services/api'
import '../style.css'
import { validateEmail, validateFullname, validatePhone} from '../../utils/index'
import { onFormInputFocus, onFormInputFocusLost, makeToast } from '../../common'
const $api = API.getInstance()

export default class Franchice extends PureComponent {
    constructor(props) {
        super(props)
         this.state={
            phoneNumber: '',
            firstname: '',
            lastname: '',
            email: '',
            district: '',
            region: '',
            address: '',
            details: '',
            whatyouown:'',
            phoneNumberEmpty: false,
            apllyHasError: false,
            applyErrorMSG: '',
            FRANCHISE_BANNER:null
         }
        this.data = {}
    }
    componentDidMount() {
        $api.getBanners({bid:24,banner_id:76},this.bannersResult.bind(this),this.onError.bind(this))
    }
    onInputChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.value
        newState[$el.name + 'Empty'] = false
        this.setState(newState)
    }
    bannersResult({data}){
        this.setState({FRANCHISE_BANNER:data.data[0]})
    }
    onError(d){
        console.log(d)
    }
    attemptApply() {
        this.setState(prevState=>({attemptingApply:!prevState.attemptingApply}))
        const {firstname, lastname, email, phoneNumber, region, district, details, address,whatyouown
            } = this.state
        if(whatyouown!=='' &&firstname!=='' && validateFullname(firstname) && lastname!=='' && validateFullname(lastname) && email!== '' && validateEmail(email) && phoneNumber!== '' && validatePhone(phoneNumber) && address!=='' && region!=='' && details!=='' && district!=='' )
            {
            const data = new FormData()
            data.append('region',region)
            data.append('district',district)
            data.append('first_name',firstname)
            data.append('last_name',lastname)
            data.append('phone',phoneNumber)
            data.append('email',email)
            data.append('address',address)
            data.append('details',details)
            data.append('type',whatyouown)
            $api.franchise(data)
            .then(({data})=>{
                this.setState({attemptingApply:false})
                makeToast(data.msg,6000)
                if(data.status===200) this.setState({firstname:'', lastname:'', email:'', phoneNumber:'', region:'', district:'', details:'', address:'',whatyouown:''})
            })
            }else{
                makeToast('Please ensure that you have filled all required fields',6000)
                this.setState(prevState=>({attemptingApply:!prevState.attemptingApply}))
            }
    }
    render() {
        const { district, attemptingApply, firstname, lastname, email, phoneNumber, phoneNumberEmpty,details, address, region, salaryExpectation, coverLetter, apllyHasError
            , applyErrorMSG,FRANCHISE_BANNER } = this.state
        return (
            <div className="about-us col-sm-12">
                <div className="col-sm-8">
                    <div className="layui-form" style={{padding: "10px 0"}}>
                        <div className="layui-form-item" style={{ marginBottom: 0 }}>
                        {
                                null !== FRANCHISE_BANNER && FRANCHISE_BANNER.hasOwnProperty('id') &&<img src={FRANCHISE_BANNER.image} />
                            }
                        </div>
                        <div className="inline- col-sm-12">
                            <div className="inline-content col-sm-6" style={{ paddingRight: "20px", borderRight: "1px solid #ccc" }}>
                                <div className="layui-form-item">
                                    <h1 style={{ fontWeight: 700, marginTop: "30px" }}>Corisbet Gambling Franchise Program</h1>
                                </div>
                                <div className="layui-form-item">
                                    <p><b>Join us to enjoy</b></p>
                                    <ul>
                                        <li>High Commission with Zero Risk.</li>
                                        <li>Amazing turnover.</li>
                                        <li>100% Support.</li>
                                    </ul>
                                    <p style={{ marginTop: "20px" }}><b>Share your shop on the Corisbet Gambling money map now!</b></p>
                                    <ul >
                                        <li>To learn more about how you can start your franchise, simply fill in the form beside and click Send!</li>
                                        <li>Once you have submitted your details one of our helpful team members will revert to you.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="inline-content col-sm-6">
                              
                                <div className="sb-login-form-container login" style={{ minWidth: 'unset',maxHeight:'100%' }} >
                                    <div style={{ width: 'unset' }}>
                                        <div className="liquid-container ember-view">
                                            <div className="liquid-child ember-view">
                                                <div data-step="login" className="sb-login-step active ember-view">
                                                    <div className="title">
                                                        <span style={{ fontWeight: 700 }}>Apply Here</span>
                                                    </div>

                                                    <div className="sb-login-form-wrapper" style={{maxHeight:'unset'}}>
                                                        <div className="social-icons">
                                                        </div>

                                                        <div className={`form`} id="first-form">
                                                            <div className="ember-view col-sm-12">

                                                                <div className="ember-view col-sm-12">
                                                                    <div className="form-group required">
                                                                        <div className="form-element empty">
                                                                            <div className="input-wrapper">
                                                                                <input autoFocus={true} name="firstname" value={firstname} className={`${firstname !== '' && !validateFullname(firstname) ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                                <span className={`placeholder ${firstname === '' && 'placeholder-inactive'}`}>First Name</span>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ember-view col-sm-12">
                                                                    <div className="form-group required">
                                                                        <div className="form-element empty">
                                                                            <div className="input-wrapper ">

                                                                                <input name="lastname" value={lastname} className={`${lastname !== '' && !validateFullname(lastname) ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                                <span className={`placeholder ${lastname === '' && 'placeholder-inactive'}`}>Last Name</span>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                    <div className="form-group required">
                                                                        <div className="form-element empty">
                                                                            <div className="input-wrapper ">
                                                                                <input name="email" value={email} className={`${email !== '' && !validateEmail(email) ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                                <span className={`placeholder ${email === '' && 'placeholder-inactive'}`}>Email</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ember-view col-sm-12"><div className="form-group required">
                                                                    <div className="form-element empty">
                                                                        <div className="input-wrapper ">

                                                                            <input name="phoneNumber" value={phoneNumber} className={`${(phoneNumber !== '' && !validatePhone(phoneNumber)) || phoneNumberEmpty ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                            <span className={`placeholder ${phoneNumber === '' && 'placeholder-inactive'}`}>Phone Number</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                                <div className="ember-view col-sm-12">
                                                                    <div className="form-group required">
                                                                    <div className="form-element empty">
                                                                        <div className="input-wrapper ">

                                                                            <input name="district" value={district} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                            <span className={`placeholder ${district === '' && 'placeholder-inactive'}`}>District</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                                <div className="ember-view col-sm-12">
                                                                    <div className="form-group required">
                                                                    <div className="form-element empty">
                                                                        <div className="input-wrapper ">

                                                                            <input name="region" value={region} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                            <span className={`placeholder ${region === '' && 'placeholder-inactive'}`}>Region</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                               

                                                                    <div className="ember-view col-sm-12">
                                                                        <div className="form-group required">
                                                                            <div className="form-element empty">
                                                                                <div className="input-wrapper ">
                                                                                    <input name="address" value={salaryExpectation} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                                    <span className={`placeholder ${address === '' && 'placeholder-inactive'}`}>Address</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-gender-group">
                                                                        <label>What do you own?</label>
                                                                        <div className="input-wrapper cbx-group ">
                                                                            <div className="checkbox-group gender-group">
                                                                                <label className="checkbox">
                                                                                    <input className="" disabled="" name="whatyouown" value="shop" type="radio" onChange={(e) => this.onInputChange(e)}/>
                                                                                    <span>Shop</span>
                                                                                </label>
                                                                                <label className="checkbox">
                                                                                    <input className="" disabled="" name="whatyouown" value="pub" type="radio" onChange={(e) => this.onInputChange(e)}/>
                                                                                    <span>Pub</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ember-view col-sm-12">
                                                                        <div className="form-group required">
                                                                            <div className="form-element empty">
                                                                                <div className="input-wrapper ">
                                                                                    <textarea row={8} col={12} name="details" value={coverLetter} className={`ember-text-field ember-view coverletter`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                                    </textarea>
                                                                                    <span className={`placeholder ${details === '' && 'placeholder-inactive'}`}>Tell Us something about it</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                            
                                                                    <div className="error-box">
                                                                        <span>{apllyHasError ? applyErrorMSG : ''}</span>
                                                                    </div>
                                                                    <button disabled={attemptingApply} onClick={this.attemptApply.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit" style={{ position: 'relative' }}>
                                                                        {attemptingApply ?
                                                                            <div className="no-results-container sb-spinner">
                                                                                <span className="btn-preloader sb-preloader"></span>
                                                                            </div>
                                                                            : 'Submit'}
                                                                    </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}