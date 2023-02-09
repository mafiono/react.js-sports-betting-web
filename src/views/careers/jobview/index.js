import React, { PureComponent } from 'react'
import API from '../../../services/api'
import moment from 'moment'
import { validateEmail, validateFullname, validatePhone, validateUsername, validateNumber } from '../../../utils/index'
import { onFormInputFocus, onFormInputFocusLost, makeToast } from '../../../common'
const $api = API.getInstance()
export default class SingleJob extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            job: {},
            phoneNumber: '',
            firstname: '',
            lastname: '',
            email: '',
            qualification: '0',
            experience: '0',
            salaryExpectation: '',
            coverLetter: '',
            CV: null,
            phoneNumberEmpty: false,
            apllyHasError: false,
            applyErrorMSG: ''
        }
    }
    componentDidMount() {
        let locState = this.props.location.state ? this.props.location.state : { id: null }
        if (locState.id) {
            $api.getSingleJob({ id: locState.id })
                .then(({ data }) => {
                    data.status === 200 && this.setState({ job: data.data })
                })
        }
    }
    componentWillUnmount(){
        clearTimeout(this.historyTimeout)
    }
    onInputChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.value
        newState[$el.name + 'Empty'] = false
        this.setState(newState)
    }
    onFileSelected(e) {
        let $el = e.target, newState = {},fileType=e.target.files && e.target.files.length? e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf('.') + 1, e.target.files[0].name.length):''
        if (e.target.files && e.target.files.length &&(fileType=== 'docx' ||fileType=== 'doc'||fileType=== 'pdf')) {
        newState[$el.name] = $el.files[0]
        newState[$el.name + 'Empty'] = false
        if($el.files[0].size/1024/1024<=5) this.setState(newState)
        else{ 
            $el.value= ''
            makeToast('The selected file size greater than 5MB')
        }
        }
        else {
            $el.value= ''
            e.target.files.length && makeToast('The selected file is not supported')
            }
    }
    attemptApply() {
        this.setState(prevState=>({attemptingApply:!prevState.attemptingApply}))
        const {firstname, lastname, email, phoneNumber, qualification, experience, salaryExpectation, coverLetter,job,CV
            } = this.state
        if( CV!==null &&firstname!=='' && validateFullname(firstname) && lastname!=='' && validateFullname(lastname) && email!== '' && validateEmail(email) && phoneNumber!== '' && validatePhone(phoneNumber) && qualification!=='0' && experience!=='0' && coverLetter!=='' &&(salaryExpectation==='' ||(salaryExpectation!=='' && validateNumber(salaryExpectation))) )
            {
            const data = new FormData()
            data.append('cvfile',CV)
            data.append('jobid',job.id)
            data.append('firstname',firstname)
            data.append('lastname',lastname)
            data.append('phone',phoneNumber)
            data.append('email',email)
            data.append('message',coverLetter)
            $api.applyForJob(data)
            .then(({data})=>{
                this.setState({attemptingApply:false})
                makeToast(data.msg,6000)
                if(data.status===200){
                    this.historyTimeout = setTimeout(()=>this.props.history.goBack(),3000)
                }
            })
            }else{
                makeToast('Please ensure that you have filled all required fields',6000)
                this.setState(prevState=>({attemptingApply:!prevState.attemptingApply}))
            }
    }
    render() {
        const { job, attemptingApply, firstname, lastname, email, phoneNumber, phoneNumberEmpty, qualification, experience, salaryExpectation, coverLetter, apllyHasError
            , applyErrorMSG } = this.state
        return (
            <div className="jobs col-sm-12">
                <div className="job-listing-container col-sm-12" >
                    <div className="col-sm-9 alice-bg padding-top-70 padding-bottom-70" style={{ width: '100%', display: 'flex' }}>
                        <div className="filtered-job-listing-wrapper col-sm-7">
                            <div className="job-filter-result col-sm-12">
                                <div className="job-list">
                                    <div className="thumb">
                                        <a href="#">
                                            <img src="images/job/company-logo-10.png" className="img-fluid" alt="" />
                                        </a>
                                    </div>
                                    <div className="body">
                                        <div className="content">
                                            <h4>{job.jobname}</h4>
                                            <div className="info">
                                                <span className="office-location">Location:</span>
                                                <span className="job-type part-time">{job.location}</span>
                                            </div>
                                            <div className="info">
                                                <span className="office-location">Qualification:</span>
                                                <span className="job-type part-time">{job.educationrequirement}</span>
                                            </div>
                                            <div className="info">
                                                <span className="office-location">Experience Level:</span>
                                                <span className="job-type part-time">{job.experiencerequired}</span>
                                            </div>
                                        </div>
                                        <div className="more">
                                            <div className="buttons">
                                                {/* <a href="#" onClick={(e)=> this.openSingleJob(e,job)} className="button" data-toggle="modal" data-target="#apply-popup-id">Apply Now</a>
                                <a href="#" className="favourite"></a> */}
                                            </div>
                                            <p className="deadline">Posted: {moment.unix(job.addtime).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="job-apply-form col-sm-12">
                                <div className="job-list">
                                    <div className="body">
                                        <div className="content">
                                            <h4>Job Description</h4>
                                            <div className="info">
                                                <span className="office-location" dangerouslySetInnerHTML={{ __html: job.positiondescription }}>

                                                </span>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className="job-list">
                                    <div className="body">
                                        <div className="content">
                                            <h4>Key Responsibilities</h4>
                                            <div className="info">
                                                <span className="office-location" dangerouslySetInnerHTML={{ __html: job.positionrequirements }}>

                                                </span>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="job-list">
                                    <div className="body">
                                        <div className="content">
                                            <h4>Education/Experience</h4>
                                            <div className="info">
                                                <ul style={{ fontSize: "14px" }}>
                                                    <li>{job.educationrequirement}</li>
                                                    <li>{job.experiencerequired}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filtered-job-listing-wrapper col-sm-5">
                            <div className="sb-login-form-container login" style={{minWidth:'unset',maxHeight:'100%' }}>
                                <div style={{width:'unset'}}>
                                    <div className="liquid-container ember-view">
                                        <div className="liquid-child ember-view">
                                            <div data-step="login" className="sb-login-step active ember-view">
                                                <div className="title">
                                                    <span style={{fontWeight:700}}>Apply Here</span>
                                                </div>

                                                <div className="sb-login-form-wrapper" style={{maxHeight:'100%' }}>
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
                                                            <div className="ember-view col-sm-12">
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
                                                            <div className="ember-view col-sm-12"><div className="form-group required">
                                                                <div className="form-element empty">
                                                                    <div className="input-wrapper ">
                                                                        <select name="qualification" style={{ padding: '18px 10px 0' }} value={qualification} className={` ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                            <option value="0">Select...</option>
                                                                            <option value="32">Degree</option>
                                                                            <option value="33">Diploma</option>
                                                                            <option value="34">High School (S.S.C.E)</option>
                                                                            <option value="35">HND</option>
                                                                            <option value="36">MBA / MSc</option>
                                                                            <option value="37">MBBS</option>
                                                                            <option value="38">MPhil / PhD</option>
                                                                            <option value="39">N.C.E</option>
                                                                            <option value="40">OND</option>
                                                                            <option value="41">Others</option>
                                                                            <option value="42">Vocational</option>
                                                                        </select>
                                                                        <span className={`placeholder ${qualification === '' && 'placeholder-inactive'}`}>Minimum Qualification</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                            <div className="ember-view col-sm-12">
                                                                <div className="form-group required">
                                                                    <div className="form-element empty">
                                                                        <div className="input-wrapper ">
                                                                            <select name="experience" style={{ padding: '18px 10px 0' }} value={experience} className={` ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                                <option value="0">Select...</option>
                                                                                <option value="1">No Experience/Less than 1 year</option>
                                                                                <option value="2">1 year</option>
                                                                                <option value="3">2 years</option>
                                                                                <option value="4">3 years</option>
                                                                                <option value="5">4 years</option>
                                                                                <option value="6">5 years</option>
                                                                                <option value="7">6 years</option>
                                                                                <option value="8">7 years</option>
                                                                                <option value="9">8 years</option>
                                                                                <option value="10">9 years</option>
                                                                                <option value="11">10 years</option>
                                                                                <option value="12">11 years</option>
                                                                                <option value="13">12 years</option>
                                                                                <option value="14">13 years</option>
                                                                                <option value="15">14 years</option>
                                                                                <option value="16">15 years</option>
                                                                                <option value="17">16 years</option>
                                                                                <option value="18">17 years</option>
                                                                                <option value="19">18 years</option>
                                                                                <option value="20">19 years</option>
                                                                                <option value="21">20 years</option>
                                                                                <option value="22">More than 20 years</option>
                                                                            </select>
                                                                            <span className={`placeholder ${experience === '' && 'placeholder-inactive'}`}>Work Experience</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ember-view col-sm-12">
                                                                    <div className="form-group ">
                                                                        <div className="form-element empty">
                                                                            <div className="input-wrapper ">
                                                                                <input name="salaryExpectation" value={salaryExpectation} className={`${salaryExpectation !== '' && !validateNumber(salaryExpectation) ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                                <span className={`placeholder ${salaryExpectation === '' && 'placeholder-inactive'}`}>Salary Expectation (optional)</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ember-view col-sm-12">
                                                                    <div className="form-group required">
                                                                        <div className="form-element empty">
                                                                            <div className="input-wrapper ">
                                                                                <textarea row={8} col={12} name="coverLetter" value={coverLetter} className={`${coverLetter !== '' && !validateUsername(coverLetter) ? 'error animated pulse' : ''} ember-text-field ember-view coverletter`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                                </textarea>
                                                                                <span className={`placeholder ${coverLetter === '' && 'placeholder-inactive'}`}>Cover Letter</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-wrapper-column margin-top--20 col-sm-12">
                                                                <div className="parsley-realignment__file-upload-container">
                                                                <label htmlFor="resume_path" className="file-upload-label">Select File</label>
                                                                <input className="file-upload-input" id="resume_path"name="CV" type="file" onChange={this.onFileSelected.bind(this)}/>
                                                                </div>
                                                                <div className="flex-wrapper-column margin-top--20">
                                                                    <p className="font-size-14 display--block margin-bottom--0 text--center">
                                                                    Upload a file no larger than 5MB
                                                                </p>
                                                                <p className="font-size-14 display--block margin--none text--center">
                                                                    Supported file types .PDF .DOC .DOCX .RTF
                                                                </p>
                                                                </div>
                                                                </div>
                                                                <div className="error-box">
                                                                    <span>{apllyHasError ? applyErrorMSG : ''}</span>
                                                                </div>
                                                                <button disabled={attemptingApply} onClick={this.attemptApply.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit" style={{position:'relative'}}>
                                                                    {attemptingApply ?
                                                                        <div className="no-results-container sb-spinner">
                                                                            <span className="btn-preloader sb-preloader"></span>
                                                                        </div>
                                                                        : 'Apply Now'}
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
            </div>
        )
    }
}