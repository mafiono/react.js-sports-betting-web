import React, { PureComponent } from 'react'
import { onFormInputFocus, onFormInputFocusLost } from '../../common'
import { validateEmail, validateFullname, validatePhone, validatePassword, validateUsername, validateSMSCode } from '../../utils/index'
import 'animate.css'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import API from '../../services/api'
import Lang from '../../containers/Lang'
const $api = API.getInstance()
export default class RegisterFrom extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showPass: false,
            username: '',
            password: '',
            email: '',
            firstname: '',
            lastname: '',
            sms: '',
            phoneNumber: '',
            selected_question: "",
            promo_code: "",
            dialing_code: "",
            recovery_pin: "",
            question_answer: "",
            formStep: 1,
            countdown: 60,
            canResend: false,
            terms: false,
            phoneNumberEmpty: false,
            usernameEmpty: false,
            termsEmpty: false,
            passwordEmpty: false,
            recaptch_value: '',
            country_code: "",
            CPassword:"",
            selected_currency: "",
            sendingSMS: false,
            lastnameEmpty: false,
            firstnameEmpty: false,
            selected_currencyEmpty:false,
            selected_questionEmpty:false,
            country_codeEmpty:false,
            gender:'',
            emailEmpty: false,
            accountExist: false,
            accExistMSG: ''
        }
        this.toggleShow = this.toggleShow.bind(this);
        this.timer = this.timer.bind(this);
        this.verifyPhone = this.verifyPhone.bind(this);
        this.startCountDown = this.startCountDown.bind(this);
        this.recaptchaRef = React.createRef()
        this.onSMSSend = this.onSMSSend.bind(this)
        this.resendSMS = this.resendSMS.bind(this)
        this.countdownTimer = null
        this.currencies = [
            // { value: "GBP", name: "UK Sterling(GBP)" },
            // { value: "EUR", name: "Euro(EUR)" },
            { value: "CFA", name: "West African CFA franc(CFA)" },
            // { value: "USD", name: "US Dollar(USD)" }
        ]
        this.security_questions = [
            { value: "FFN", name: "Father's first Name" },
            { value: "MFN", name: "Mother's first Name" },
            { value: "FS", name: "First School" }
        ]
        this.countries = [
            {"name": "Afghanistan", "code": "AF"},
            {"name": "Åland Islands", "code": "AX"},
            {"name": "Albania", "code": "AL"},
            {"name": "Algeria", "code": "DZ"},
            {"name": "American Samoa", "code": "AS"},
            {"name": "AndorrA", "code": "AD"},
            {"name": "Angola", "code": "AO"},
            {"name": "Anguilla", "code": "AI"},
            {"name": "Antarctica", "code": "AQ"},
            {"name": "Antigua and Barbuda", "code": "AG"},
            {"name": "Argentina", "code": "AR"},
            {"name": "Armenia", "code": "AM"},
            {"name": "Aruba", "code": "AW"},
            {"name": "Australia", "code": "AU"},
            {"name": "Austria", "code": "AT"},
            {"name": "Azerbaijan", "code": "AZ"},
            {"name": "Bahamas", "code": "BS"},
            {"name": "Bahrain", "code": "BH"},
            {"name": "Bangladesh", "code": "BD"},
            {"name": "Barbados", "code": "BB"},
            {"name": "Belarus", "code": "BY"},
            {"name": "Belgium", "code": "BE"},
            {"name": "Belize", "code": "BZ"},
            {"name": "Benin", "code": "BJ"},
            {"name": "Bermuda", "code": "BM"},
            {"name": "Bhutan", "code": "BT"},
            {"name": "Bolivia", "code": "BO"},
            {"name": "Bosnia and Herzegovina", "code": "BA"},
            {"name": "Botswana", "code": "BW"},
            {"name": "Bouvet Island", "code": "BV"},
            {"name": "Brazil", "code": "BR"},
            {"name": "British Indian Ocean Territory", "code": "IO"},
            {"name": "Brunei Darussalam", "code": "BN"},
            {"name": "Bulgaria", "code": "BG"},
            {"name": "Burkina Faso", "code": "BF"},
            {"name": "Burundi", "code": "BI"},
            {"name": "Cambodia", "code": "KH"},
            {"name": "Cameroon", "code": "CM"},
            {"name": "Canada", "code": "CA"},
            {"name": "Cape Verde", "code": "CV"},
            {"name": "Cayman Islands", "code": "KY"},
            {"name": "Central African Republic", "code": "CF"},
            {"name": "Chad", "code": "TD"},
            {"name": "Chile", "code": "CL"},
            {"name": "China", "code": "CN"},
            {"name": "Christmas Island", "code": "CX"},
            {"name": "Cocos (Keeling) Islands", "code": "CC"},
            {"name": "Colombia", "code": "CO"},
            {"name": "Comoros", "code": "KM"},
            {"name": "Congo", "code": "CG"},
            {"name": "Congo, The Democratic Republic of the", "code": "CD"},
            {"name": "Cook Islands", "code": "CK"},
            {"name": "Costa Rica", "code": "CR"},
            {"name": "Cote D\'Ivoire", "code": "CI"},
            {"name": "Croatia", "code": "HR"},
            {"name": "Cuba", "code": "CU"},
            {"name": "Cyprus", "code": "CY"},
            {"name": "Czech Republic", "code": "CZ"},
            {"name": "Denmark", "code": "DK"},
            {"name": "Djibouti", "code": "DJ"},
            {"name": "Dominica", "code": "DM"},
            {"name": "Dominican Republic", "code": "DO"},
            {"name": "Ecuador", "code": "EC"},
            {"name": "Egypt", "code": "EG"},
            {"name": "El Salvador", "code": "SV"},
            {"name": "Equatorial Guinea", "code": "GQ"},
            {"name": "Eritrea", "code": "ER"},
            {"name": "Estonia", "code": "EE"},
            {"name": "Ethiopia", "code": "ET"},
            {"name": "Falkland Islands (Malvinas)", "code": "FK"},
            {"name": "Faroe Islands", "code": "FO"},
            {"name": "Fiji", "code": "FJ"},
            {"name": "Finland", "code": "FI"},
            {"name": "France", "code": "FR"},
            {"name": "French Guiana", "code": "GF"},
            {"name": "French Polynesia", "code": "PF"},
            {"name": "French Southern Territories", "code": "TF"},
            {"name": "Gabon", "code": "GA"},
            {"name": "Gambia", "code": "GM"},
            {"name": "Georgia", "code": "GE"},
            {"name": "Germany", "code": "DE"},
            {"name": "Ghana", "code": "GH"},
            {"name": "Gibraltar", "code": "GI"},
            {"name": "Greece", "code": "GR"},
            {"name": "Greenland", "code": "GL"},
            {"name": "Grenada", "code": "GD"},
            {"name": "Guadeloupe", "code": "GP"},
            {"name": "Guam", "code": "GU"},
            {"name": "Guatemala", "code": "GT"},
            {"name": "Guernsey", "code": "GG"},
            {"name": "Guinea", "code": "GN"},
            {"name": "Guinea-Bissau", "code": "GW"},
            {"name": "Guyana", "code": "GY"},
            {"name": "Haiti", "code": "HT"},
            {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
            {"name": "Holy See (Vatican City State)", "code": "VA"},
            {"name": "Honduras", "code": "HN"},
            {"name": "Hong Kong", "code": "HK"},
            {"name": "Hungary", "code": "HU"},
            {"name": "Iceland", "code": "IS"},
            {"name": "India", "code": "IN"},
            {"name": "Indonesia", "code": "ID"},
            {"name": "Iran, Islamic Republic Of", "code": "IR"},
            {"name": "Iraq", "code": "IQ"},
            {"name": "Ireland", "code": "IE"},
            {"name": "Isle of Man", "code": "IM"},
            {"name": "Israel", "code": "IL"},
            {"name": "Italy", "code": "IT"},
            {"name": "Jamaica", "code": "JM"},
            {"name": "Japan", "code": "JP"},
            {"name": "Jersey", "code": "JE"},
            {"name": "Jordan", "code": "JO"},
            {"name": "Kazakhstan", "code": "KZ"},
            {"name": "Kenya", "code": "KE"},
            {"name": "Kiribati", "code": "KI"},
            {"name": "Korea, Democratic People\'S Republic of", "code": "KP"},
            {"name": "Korea, Republic of", "code": "KR"},
            {"name": "Kuwait", "code": "KW"},
            {"name": "Kyrgyzstan", "code": "KG"},
            {"name": "Lao People'S Democratic Republic", "code": "LA"},
            {"name": "Latvia", "code": "LV"},
            {"name": "Lebanon", "code": "LB"},
            {"name": "Lesotho", "code": "LS"},
            {"name": "Liberia", "code": "LR"},
            {"name": "Libyan Arab Jamahiriya", "code": "LY"},
            {"name": "Liechtenstein", "code": "LI"},
            {"name": "Lithuania", "code": "LT"},
            {"name": "Luxembourg", "code": "LU"},
            {"name": "Macao", "code": "MO"},
            {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
            {"name": "Madagascar", "code": "MG"},
            {"name": "Malawi", "code": "MW"},
            {"name": "Malaysia", "code": "MY"},
            {"name": "Maldives", "code": "MV"},
            {"name": "Mali", "code": "ML"},
            {"name": "Malta", "code": "MT"},
            {"name": "Marshall Islands", "code": "MH"},
            {"name": "Martinique", "code": "MQ"},
            {"name": "Mauritania", "code": "MR"},
            {"name": "Mauritius", "code": "MU"},
            {"name": "Mayotte", "code": "YT"},
            {"name": "Mexico", "code": "MX"},
            {"name": "Micronesia, Federated States of", "code": "FM"},
            {"name": "Moldova, Republic of", "code": "MD"},
            {"name": "Monaco", "code": "MC"},
            {"name": "Mongolia", "code": "MN"},
            {"name": "Montserrat", "code": "MS"},
            {"name": "Morocco", "code": "MA"},
            {"name": "Mozambique", "code": "MZ"},
            {"name": "Myanmar", "code": "MM"},
            {"name": "Namibia", "code": "NA"},
            {"name": "Nauru", "code": "NR"},
            {"name": "Nepal", "code": "NP"},
            {"name": "Netherlands", "code": "NL"},
            {"name": "Netherlands Antilles", "code": "AN"},
            {"name": "New Caledonia", "code": "NC"},
            {"name": "New Zealand", "code": "NZ"},
            {"name": "Nicaragua", "code": "NI"},
            {"name": "Niger", "code": "NE"},
            {"name": "Nigeria", "code": "NG"},
            {"name": "Niue", "code": "NU"},
            {"name": "Norfolk Island", "code": "NF"},
            {"name": "Northern Mariana Islands", "code": "MP"},
            {"name": "Norway", "code": "NO"},
            {"name": "Oman", "code": "OM"},
            {"name": "Pakistan", "code": "PK"},
            {"name": "Palau", "code": "PW"},
            {"name": "Palestinian Territory, Occupied", "code": "PS"},
            {"name": "Panama", "code": "PA"},
            {"name": "Papua New Guinea", "code": "PG"},
            {"name": "Paraguay", "code": "PY"},
            {"name": "Peru", "code": "PE"},
            {"name": "Philippines", "code": "PH"},
            {"name": "Pitcairn", "code": "PN"},
            {"name": "Poland", "code": "PL"},
            {"name": "Portugal", "code": "PT"},
            {"name": "Puerto Rico", "code": "PR"},
            {"name": "Qatar", "code": "QA"},
            {"name": "Reunion", "code": "RE"},
            {"name": "Romania", "code": "RO"},
            {"name": "Russian Federation", "code": "RU"},
            {"name": "RWANDA", "code": "RW"},
            {"name": "Saint Helena", "code": "SH"},
            {"name": "Saint Kitts and Nevis", "code": "KN"},
            {"name": "Saint Lucia", "code": "LC"},
            {"name": "Saint Pierre and Miquelon", "code": "PM"},
            {"name": "Saint Vincent and the Grenadines", "code": "VC"},
            {"name": "Samoa", "code": "WS"},
            {"name": "San Marino", "code": "SM"},
            {"name": "Sao Tome and Principe", "code": "ST"},
            {"name": "Saudi Arabia", "code": "SA"},
            {"name": "Senegal", "code": "SN"},
            {"name": "Serbia and Montenegro", "code": "CS"},
            {"name": "Seychelles", "code": "SC"},
            {"name": "Sierra Leone", "code": "SL"},
            {"name": "Singapore", "code": "SG"},
            {"name": "Slovakia", "code": "SK"},
            {"name": "Slovenia", "code": "SI"},
            {"name": "Solomon Islands", "code": "SB"},
            {"name": "Somalia", "code": "SO"},
            {"name": "South Africa", "code": "ZA"},
            {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
            {"name": "Spain", "code": "ES"},
            {"name": "Sri Lanka", "code": "LK"},
            {"name": "Sudan", "code": "SD"},
            {"name": "Suriname", "code": "SR"},
            {"name": "Svalbard and Jan Mayen", "code": "SJ"},
            {"name": "Swaziland", "code": "SZ"},
            {"name": "Sweden", "code": "SE"},
            {"name": "Switzerland", "code": "CH"},
            {"name": "Syrian Arab Republic", "code": "SY"},
            {"name": "Taiwan, Province of China", "code": "TW"},
            {"name": "Tajikistan", "code": "TJ"},
            {"name": "Tanzania, United Republic of", "code": "TZ"},
            {"name": "Thailand", "code": "TH"},
            {"name": "Timor-Leste", "code": "TL"},
            {"name": "Togo", "code": "TG"},
            {"name": "Tokelau", "code": "TK"},
            {"name": "Tonga", "code": "TO"},
            {"name": "Trinidad and Tobago", "code": "TT"},
            {"name": "Tunisia", "code": "TN"},
            {"name": "Turkey", "code": "TR"},
            {"name": "Turkmenistan", "code": "TM"},
            {"name": "Turks and Caicos Islands", "code": "TC"},
            {"name": "Tuvalu", "code": "TV"},
            {"name": "Uganda", "code": "UG"},
            {"name": "Ukraine", "code": "UA"},
            {"name": "United Arab Emirates", "code": "AE"},
            {"name": "United Kingdom", "code": "GB"},
            {"name": "United States", "code": "US"},
            {"name": "United States Minor Outlying Islands", "code": "UM"},
            {"name": "Uruguay", "code": "UY"},
            {"name": "Uzbekistan", "code": "UZ"},
            {"name": "Vanuatu", "code": "VU"},
            {"name": "Venezuela", "code": "VE"},
            {"name": "Viet Nam", "code": "VN"},
            {"name": "Virgin Islands, British", "code": "VG"},
            {"name": "Virgin Islands, U.S.", "code": "VI"},
            {"name": "Wallis and Futuna", "code": "WF"},
            {"name": "Western Sahara", "code": "EH"},
            {"name": "Yemen", "code": "YE"},
            {"name": "Zambia", "code": "ZM"},
            {"name": "Zimbabwe", "code": "ZW"}
            ]
            
    }
    componetDidMount() {
        // ReactGA.modalview('/register');
    }
    onInputChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.value
        newState[$el.name + 'Empty'] = false
        this.state.accountExist && (newState.accountExist = false);
        this.setState(newState)
    }
    onAgreeChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.checked
        newState[$el.name + 'Empty'] = false
        this.setState(newState)
        // $el.checked &&  this.recaptchaRef.current.execute()
    }
    canContinue() {
        const { password, phoneNumber, firstname, lastname, email, terms } = this.state
        return (password === '' || phoneNumber === '' || lastname === '' || firstname === '' || email !== '' || !terms)
    }
    toggleShow() {

        this.setState(prevState => ({ showPass: !prevState.showPass }));
    }
    startCountDown() {
        this.setState({ countdown: 60 })
        this.countdownTimer = setInterval(() => this.timer(), 1000)
    }
    timer() {
        let count = this.state.countdown
        if (count >= 1) this.setState({ countdown: count - 1 })
        else {
            clearInterval(this.countdownTimer)
            this.setState({ canResend: true })
        }
    }
    verifyPhone() {
        const { phoneNumber, password, terms, firstname,CPassword, lastname, email, dialing_code} = this.state
        if ((phoneNumber !== '' && validatePhone(phoneNumber)) && (email !== '' && validateEmail(email)) && (lastname !== '' && validateFullname(lastname)) && (firstname !== '' && validateFullname(firstname)) && (password !== '' && validatePassword(password))&& (CPassword!==''&&password===CPassword)&&terms) {
            this.setState({ canResend: false, attemptingSignup: true })
            $api.checkExistance({mobilenumber: phoneNumber.substr(dialing_code.length), password: password, lastName: lastname, firstName: firstname, email: email, source: 42,dialing_code:dialing_code})
                .then(({ data }) => {
                    if (data.status === 200) {
                        this.attemptSignup()
                    } else {
                        this.setState({ accountExist: true, accExistMSG: typeof data.msg == String? data.msg:data.msg[Object.keys(data.msg)[0]][0], sendingSMS: false })
                    }
                })
        } else {
            let dirty = {}
            if (!terms)
                dirty.termsEmpty = true
            if (phoneNumber === '' || !validatePhone(phoneNumber))
                dirty.phoneNumberEmpty = true
            if (firstname === '' || !validateFullname(firstname))
                dirty.firstnameEmpty = true
            if (lastname === '' || !validateFullname(lastname))
                dirty.lastnameEmpty = true
            if (email === '' || !validateEmail(email))
                dirty.emailEmpty = true
            if (password === '' || !validatePassword(password))
                dirty.passwordEmpty = true
            // if (country_code === '' )
            //     dirty.country_codeEmpty = true
            // if (selected_currency === '' )
            //     dirty.selected_currencyEmpty = true
            // if (selected_question === '' )
            //     dirty.selected_questionEmpty = true
            // if (question_answer === '' )
            //     dirty.question_answerEmpty = true
            if (CPassword === '' ||CPassword!==password)
                dirty.CPasswordEmpty = true
            // if (recovery_pin === '' ||recovery_pin.length<4)
            //     dirty.recovery_pinEmpty = true
            // if (gender === '')
            //     dirty.genderEmpty = true
            this.setState(dirty)
        }
    }
    resendSMS() {
        this.setState({ canResend: false, sendingSMS: true, countdown: 60 })
        this.props.sendTextMSG(this.state.phoneNumber.substr(this.state.dialing_code.length), this.onSMSSend)
    }
    onSMSSend() {
        this.setState({ formStep: 2, sendingSMS: false })
        this.startCountDown()
    }
    back() {
        clearInterval(this.countdownTimer)
        this.setState({ formStep: 1, countdown: 60, canResend: false })
    }
    setRecaptchaValue(e) {
        e.persist()
        this.setState({ recaptch_value: e.target.value })
        // e.value !==''  && this.verifyPhone()
    }
    attemptSignup() {
        // clearInterval(this.countdownTimer)
        const { phoneNumber, CPassword, password, sms, lastname, firstname, email, dialing_code} = this.state
        this.props.register({sms:sms, mobilenumber: phoneNumber.substr(dialing_code.length),dialing_code:dialing_code, password: password,CPassword:CPassword, lastName: lastname, firstName: firstname, email: email, source: 42})
    }
    close() {
        clearInterval(this.countdownTimer)
        this.props.onClose()
    }
    render() {
        const { showPass, password, phoneNumber, email, emailEmpty, sms, lastname, firstname, formStep, countdown, canResend, terms, phoneNumberEmpty,
            lastnameEmpty, firstnameEmpty,
            termsEmpty,
            passwordEmpty, accountExist,CPassword,CPasswordEmpty,
            accExistMSG } = this.state, { attemptingSignup, signupHasError, signupErrorMSG, smsErrorMSG, smsHasError, created } = this.props
        return (
            <div>
                <div className="sb-login-form-container sign-up">
                    <div>
                        <span onClick={this.close.bind(this)} className="sb-login-form-close icon-icon-close-x"></span>

                        <div className="liquid-container " style={{ overflow: 'visible' }}>
                            <div className="liquid-child " style={{ overflow: 'visible' }}>
                                <div data-step="sign-up" className="sb-login-step active ">
                                    <div className="title">
                                        <span><Lang word={"Registration"}/></span>
                                    </div>

                                    <div className="sb-login-form-wrapper">
                                        <div className="social-icons">
                                        </div>
                                        {
                                            created ?
                                                <div className={` ${formStep !== 2 ? 'animated fadeOut' : 'animated fadeIn'}`} di="second-form">
                                                    <p className="recaptcha-version-3" style={{ fontSize: '20px' }}>
                                                        <Lang word={"Thank You for joining Corisbet Gambling, Your Account was created successfully!"}/>
                                            </p>
                                                    {/* <span>Pleae check your Email and verify your account.</span> */}
                                                    <span style={{ fontSize: '20px' }}><Lang word={"Bet more, Win Big!!!"}/></span>
                                                </div>
                                                :
                                                formStep === 1 && !created ?
                                                    <div className={`form ${formStep !== 1 ? 'animated fadeOut' : 'fadeIn animated'}`} id="first-form">

                                                        <div className=" ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {((firstname !== '' && !validateFullname(firstname)) || firstnameEmpty) && <React.Fragment>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div> <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{<Lang word = {((firstname !== '' && !validateFullname(firstname)) ? 'First name must be minimum of 2 characters' : 'First name cannot be empty')}/>}</span>
                                                                                </div></div></React.Fragment>}
                                                                    </div>
                                                                    <input autoFocus={true} name="firstname" value={firstname} className={`${(firstname !== '' && !validateFullname(firstname)) || firstnameEmpty ? 'error animated pulse' : ''} ember-text-field `} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                    <span className={`placeholder ${firstname === '' && 'placeholder-inactive'}`}><Lang word={"First Name"}/></span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className=" ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {((lastname !== '' && !validateFullname(lastname)) || lastnameEmpty) && <React.Fragment>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div><div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{< Lang word = {(lastname !== '' && !validateFullname(lastname)) ? 'Last name must be minimum of 2 characters' : 'Last name cannot be empty'}/>}</span>
                                                                                </div></div></React.Fragment>}
                                                                    </div>
                                                                    <input name="lastname" value={lastname} className={`${(lastname !== '' && !validateFullname(lastname)) || lastnameEmpty ? 'error animated pulse' : ''} ember-text-field `} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                    <span className={`placeholder ${lastname === '' && 'placeholder-inactive'}`}><Lang word={"Last Name"}/></span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        {/* <div className="ember-view col-sm-6"><div className="form-group ">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                <div className="field-icons-container ">
                                                                        {(genderEmpty) && <React.Fragment>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div><div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>Please select your gender</span>
                                                                                </div></div></React.Fragment>}
                                                                    </div>
                                                                    <select name="gender" value={gender} className={`${genderEmpty?'error animated pulse':''}ember-text-field`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                        <option value="">Seelct Gender</option>
                                                                        <option value="M">Male</option>
                                                                        <option value="F">Female</option>
                                                                    </select>
                                                                    <span className={`placeholder ${(genderEmpty) && 'placeholder-inactive'}`}>Gender</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div> */}
                                                        <div className=" ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {((email !== '' && !validateEmail(email)) || emailEmpty) && <React.Fragment>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div> <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{<Lang word ={(email !== '' && !validateEmail(email)) ? 'Invalid email format' : 'Email cannot be empty'}/>}</span>
                                                                                </div></div></React.Fragment>}
                                                                    </div>
                                                                    <input name="email" value={email} className={`${(email !== '' && !validateEmail(email)) || emailEmpty ? 'error animated pulse' : ''} ember-text-field `} type="email" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                    <span className={`placeholder ${email === '' && 'placeholder-inactive'}`}><Lang word={"Email"}/></span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        </div>
                                                        <div className=" ember-view col-sm-6"><div className="form-group required">
                                                            {/* <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {((phoneNumber !== '' && !validatePhone(phoneNumber)) || phoneNumberEmpty) && <React.Fragment>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div>  <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{(phoneNumber !== '' && !validatePhone(phoneNumber)) ? 'Phone number must match format: 0240000000  or 240000000' : 'Phone number cannot be empty'}</span>
                                                                                </div></div></React.Fragment>}
                                                                    </div>
                                                                    <input name="phoneNumber" value={phoneNumber} className={`${(phoneNumber !== '' && !validatePhone(phoneNumber)) || phoneNumberEmpty ? 'error animated pulse' : ''} ember-text-field `} type="tel" maxLength="10" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                    <span className={`placeholder ${phoneNumber === '' && 'placeholder-inactive'}`}>Phone Number</span>
                                                                </div>
                                                            </div> */}
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper">
                                                                    <div className="field-icons-container ">
                                                                        {((phoneNumber !== '' && !validatePhone(phoneNumber)) || phoneNumberEmpty) && <React.Fragment>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div>  <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{<Lang word={(phoneNumber !== '' && !validatePhone(phoneNumber)) ? 'Phone number must be valid' : 'Phone number cannot be empty'}/>}</span>
                                                                                </div></div></React.Fragment>}
                                                                    </div>
                                                                    <PhoneInput
                                                                    country={'ci'}
                                                                    inputProps={ {name:"phoneNumber",
                                                                    required: true,
                                                                    placeholder:"Mobile Number"}}
                                                                    value={phoneNumber}
                                                                    onChange={(phoneNumber, country,) => this.setState({phoneNumber,dialing_code:country.dialCode})}
                                                                    />
                                                                    
                                                                </div>
                                                                </div>
                                                        </div>
                                                        </div>

                                                        {/* <div className=" ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {(country_codeEmpty) && <>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div> <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{'You must select your country'}</span>
                                                                                </div></div></>}
                                                                    </div>
                                                                    <select name="country_code" value={country_code} className={`${country_codeEmpty ? 'error animated pulse' : ''} ember-text-field `} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" >
                                                                        <option>Select your country</option>
                                                                        {
                                                                            this.countries.map((country, i) => <option key={i} value={JSON.stringify(country)}>{country.name}</option>)
                                                                        }
                                                                    </select>
                                                                    <span className={`placeholder ${username === '' && 'placeholder-inactive'}`}>Country</span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div> */}
                                                        {/* <div className="ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {(selected_questionEmpty) && <>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div> 
                                                                            <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{(selected_question !== '' && selected_question == null) ? 'You must select a security question' : ''}</span>
                                                                                </div></div></>}
                                                                    </div>
                                                                    <select name="selected_question" value={selected_question??''} className={`${selected_questionEmpty ? 'error animated pulse' : ''} ember-text-field `} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" >
                                                                        <option>Select security question</option>
                                                                        {
                                                                            this.security_questions.map((question, i) => <option key={i} value={question.value}>{question.name}</option>)
                                                                        }
                                                                    </select>
                                                                    <span className={`placeholder ${username === '' && 'placeholder-inactive'}`}>Security Question</span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div> */}
                                    
                                                        {/* <div className="ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {(selected_currencyEmpty) && <>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div> 
                                                                            <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{(selected_currency !== '' && selected_currency == null) ? 'You must select a security question' : ''}</span>
                                                                                </div></div></>}
                                                                    </div>
                                                                    <select name="selected_currency" value={selected_currency} className={`${selected_currencyEmpty? 'error animated pulse' : ''} ember-text-field `} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" >
                                                                        <option>Select Currency</option>
                                                                        {
                                                                            this.currencies.map((currency, i) => <option key={i} value={currency.value}>{currency.name}</option>)
                                                                        }
                                                                    </select>
                                                                    <span className={`placeholder ${username === '' && 'placeholder-inactive'}`}>Security Question</span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div> */}
                                                        {/* <div className="ember-view col-sm-6"><div className="form-group required">
                                                            <div className="form-element empty">
                                                                <div className="input-wrapper ">
                                                                    <div className="field-icons-container ">
                                                                        {(question_answer == '' && selected_question!=='')||question_answerEmpty&& <>
                                                                            <div className="warning-block">
                                                                                <span className={`warning icon-sb-warning icon`} ></span>
                                                                            </div> <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                <div className="field-message-wrapper">
                                                                                    <span>{(question_answer == '' || question_answer == null||question_answerEmpty) ? 'You must answer security question' : ''}</span>
                                                                                </div></div></>}
                                                                    </div>
                                                                    <input name="question_answer" value={question_answer} className={`${((question_answer == '' && selected_question!=='')||question_answerEmpty) ? 'error animated pulse' : ''} ember-text-field `} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" disabled={selected_question?false:true}/>
                                                                       
                                                                    <span className={`placeholder ${username === '' && 'placeholder-inactive'}`}>Security Answer</span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div> */}
                                                        <div className=" ember-view col-sm-6">
                                                            <div className="form-group required">
                                                                <div className="form-element empty">
                                                                    <div className="input-wrapper  show-password-switcher">
                                                                        <div className="field-icons-container ">
                                                                            {password !== '' && <div className="password-visibility-block" onClick={this.toggleShow} >
                                                                                <span className={`password-visibility icon ${showPass ? 'icon-sb-hide' : 'icon-sb-show'}`} ></span>
                                                                            </div>}
                                                                            {((password !== '' && !validatePassword(password)) || passwordEmpty) && <React.Fragment>
                                                                                <div className="warning-block">
                                                                                    <span className={`warning icon-sb-warning icon`} ></span>
                                                                                </div>  <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                    <div className="field-message-wrapper">
                                                                                        <span>{<Lang word ={(password !== '' && !validatePassword(password)) ? 'Password must be minimum of 8 characters' : 'Password cannot be empty'}/>}</span>
                                                                                    </div></div></React.Fragment>}
                                                                        </div>
                                                                        <input name="password" value={password} className={`${(password !== '' && !validatePassword(password)) || passwordEmpty ? 'error animated pulse' : ''} ember-text-field `} type={showPass ? 'text' : 'password'} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                        <span className={`placeholder ${password === '' && 'placeholder-inactive'}`}><Lang word={"Password"}/></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className=" ember-view col-sm-6">
                                                            <div className="form-group required">
                                                                <div className="form-element empty">
                                                                    <div className="input-wrapper  show-password-switcher">
                                                                        <div className="field-icons-container ">
                                                                            {(CPassword !== ''|| CPasswordEmpty) && <div className="password-visibility-block" onClick={this.toggleShow} >
                                                                                <span className={`password-visibility icon ${showPass ? 'icon-sb-hide' : 'icon-sb-show'}`} ></span>
                                                                            </div>}
                                                                            {((CPassword !== '' && !validatePassword(CPassword)) || CPasswordEmpty) && <React.Fragment>
                                                                                <div className="warning-block">
                                                                                    <span className={`warning icon-sb-warning icon`} ></span>
                                                                                </div>  <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                    <div className="field-message-wrapper">
                                                                                        <span>{<Lang word= {CPassword !== '' && password!==CPassword ? 'Password mismatch' : 'Retype password'}/>}</span>
                                                                                    </div></div></React.Fragment>}
                                                                        </div>
                                                                        <input name="CPassword" value={CPassword} className={`${(CPassword !== '' && password!==CPassword) || CPasswordEmpty ? 'error animated pulse' : ''} ember-text-field `} type={showPass ? 'text' : 'password'} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                        <span className={`placeholder ${CPassword === '' && 'placeholder-inactive'}`}><Lang word={"Re-type Password"}/></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="ember-view col-sm-6">
                                                            <div className="form-group required">
                                                                <div className="form-element empty">
                                                                    <div className="input-wrapper  show-password-switcher">
                                                                        <div className="field-icons-container ">
                                                                            {((promo_code !== '' && !promo_code.length < 3)) && <React.Fragment>
                                                                                <div className="warning-block">
                                                                                    <span className={`warning icon-sb-warning icon`} ></span>
                                                                                </div>  <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                    <div className="field-message-wrapper">
                                                                                        <span>{(password !== '' && !promo_code.length < 3) ? 'Code not valid' : ''}</span>
                                                                                    </div></div></React.Fragment>}
                                                                        </div>
                                                                        <input name="promo_code" value={promo_code} className={`${(promo_code !== '' && !promo_code.length < 3) ? 'error animated pulse' : ''} ember-text-field `} type={'text'} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                        <span className={`placeholder ${promo_code === '' && 'placeholder-inactive'}`}>Promo Code</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        {/* <div className="ember-view col-sm-6">
                                                            <div className="form-group required">
                                                                <div className="form-element empty">
                                                                    <div className="input-wrapper  show-password-switcher">
                                                                        <div className="field-icons-container ">
                                                                            {((recovery_pin !== '' && recovery_pin.length < 4)||recovery_pinEmpty) && <React.Fragment>
                                                                                <div className="warning-block">
                                                                                    <span className={`warning icon-sb-warning icon`} ></span>
                                                                                </div>  <div className="field-message-container " style={{ right: 0, top: "-44px" }}>
                                                                                    <div className="field-message-wrapper">
                                                                                        <span>{(recovery_pin !== '' && !recovery_pin.length < 4) ? 'Code not valid' : 'Please enter your pin'}</span>
                                                                                    </div></div></React.Fragment>}
                                                                        </div>
                                                                        <input name="recovery_pin" value={recovery_pin} maxLength={4} className={`${(recovery_pin !== '' && recovery_pin.length < 4) ||recovery_pinEmpty? 'error animated pulse' : ''} ember-text-field `} type={'text'} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                        <span className={`placeholder ${recovery_pin === '' && 'placeholder-inactive'}`}>Recovery Pin</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        {/* <div className=" ember-view col-sm-6">
                                                <div className="form-group ">
                                                <div className="form-element empty">
                                                    <div className="input-wrapper  show-password-switcher">
                                                        <div className="field-icons-container ">
                                                            <div className="password-visibility-block">
                                                                <span className="password-visibility icon icon-preview-sb"> </span>
                                                            </div>

                                                        </div>
                                                        <input name="c_password" className="ember-text-field " type="text" onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                        <span className="placeholder placeholder-inactive">Confirm Password</span>

                                                    </div>
                                                </div>
                                            </div>
                                            </div> */}
                                                        <div className="sb-styled-checkbox">
                                                            <label className="checkbox terms-link" htmlFor="agreetoterms">
                                                                <input name="terms" value={terms} onChange={(e) => this.onAgreeChange(e)} id="agreetoterms" className={`ember-checkbox `} type="checkbox" />
                                                                <span className={`${termsEmpty && 'error animated pulse'}`}></span>
                                                            </label>

                                                            <span className="">
                                                                <Lang word={"I agree to all"}/>
                                                        <Link to="/general-terms-and-conditions"><Lang word={"Terms"}/> &amp; <Lang word={"Conditions"}/></Link>

                                                            &amp;
                                                            <Link to="/privacy-policy">
                                                             <Lang word={"Privacy Policy"}/>
                                                            </Link>
                                                        <Lang word={"and I am over 18 years of age"}/>.<sup>*</sup>
                                                            </span>
                                                        </div>
                                                        {/* <p className="recaptcha-version-3">
                                                This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
                                            </p> */}
                                                        <div className="error-box">
                                                            <span>{smsHasError ? smsErrorMSG : accountExist ? accExistMSG : ''}</span>
                                                        </div>
                                                        {/* <button disabled={sendingSMS} className="sb-account-btn btn-primary submit-join-now " type="submit" onClick={this.verifyPhone}>
                                                            {sendingSMS ?
                                                                <div className="no-results-container sb-spinner">
                                                                    <span className="btn-preloader sb-preloader"></span>
                                                                </div>
                                                                : 'Create Account'}
                                                        </button> */}
                                                        <button disabled={attemptingSignup} onClick={this.verifyPhone} className="sb-account-btn btn-primary submit-join-now " type="submit">
                                                            {attemptingSignup ?
                                                                <div className="no-results-container sb-spinner">
                                                                    <span className="btn-preloader sb-preloader"></span>
                                                                </div>
                                                                : <Lang word='Create Account'/>}
                                                        </button>
                                                    </div>
                                                    :
                                                    <div className={` ${formStep !== 2 ? 'animated fadeOut' : 'animated fadeIn'}`} di="second-form">
                                                        <p className="recaptcha-version-3" style={{ fontSize: '20px' }}>
                                                            <Lang word={"Verify your Phone Number"}/>
                                            </p>
                                                        <span><Lang word={"We have sent an SMS code to the number"}/> : {phoneNumber}</span>
                                                        <p onClick={this.back.bind(this)} className="recaptcha-version-3" style={{ cursor: 'pointer' }}>
                                                            <Lang word={"Not your phone number"}/> ?
                                            </p>
                                                        <div className=" col-sm-12" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <div className="form-group ">
                                                                <div className="form-element empty">
                                                                    <div className="input-wrapper  show-password-switcher">
                                                                        <div className="field-icons-container ">
                                                                            <div className="password-visibility-block">
                                                                                {canResend ?
                                                                                    <div onClick={this.resendSMS} title="resend" className="password-visibility icon icon-sb-refresh"></div>
                                                                                    : <span title="count down" className="password-visibility count-down">{countdown}</span>}
                                                                            </div>

                                                                        </div>
                                                                        <input autoFocus={true} name="sms" value={sms} className={`ember-text-field `} type={showPass ? 'text' : 'password'} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                        <span className={`placeholder ${sms === '' && 'placeholder-inactive'}`}><Lang word={"SMS CODE"}/></span>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="error-box">
                                                            <span>{signupHasError ? signupErrorMSG : ''}</span>
                                                        </div>
                                                        <button disabled={sms === '' || !validateSMSCode(sms) || attemptingSignup} onClick={this.attemptSignup.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit">
                                                            {attemptingSignup ?
                                                                <div className="no-results-container sb-spinner">
                                                                    <span className="btn-preloader sb-preloader"></span>
                                                                </div>
                                                                : <Lang word='Submit'/>}
                                                        </button>
                                                    </div>
                                        }
                                        <div className="footer">
                                            <span><Lang word={"Already have an account"}/>? </span>
                                            <span className="as-link step-change" data-step="sign-in" data-side="left">
                                                <a onClick={() => { this.props.changeForm({ formType: 'login' }) }}><Lang word={"Sign In"}/></a>
                                            </span>
                                        </div>
                                    </div>
                                    {/* <input id="recaptchaValueInvisible" type="text" ref={(el) => { this.recaptchaValue = el }} onChange={(e) => { this.setRecaptchaValue(e) }} style={{ visibility: 'hidden', position: 'absolute' }} />
                                    <ReCAPTCHA
                                    ref={this.recaptchaRef}
                                    size="invisible"
                                    onChange={onSubmitInvisible}
                                    sitekey="6LcL_MAUAAAAACsmwoZ6vbEp3sEiOzgk_6kOKtD-"
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}