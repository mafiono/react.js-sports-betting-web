import React, { PureComponent } from 'react'
import { NavLink } from "react-router-dom";
import './header.css'
import logo from '../../images/logo.png'
import moment from 'moment'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, MODAL, LANG } from '../../actionReducers'
import {updateBrowserHistoryState, setCookie, dataStorage} from '../../common'
import {withRouter} from 'react-router-dom'
import API from '../../services/api'
import HeaderAds from './headerAds';
import Lang from '../../containers/Lang';
const $api = API.getInstance()
 class Header extends PureComponent {
    constructor(props) {
        super(props) 
        this.state={
            showRecaptcha:false,
            time: '',
            ads:[],
            showHeaderAds:true
        }
        this.openModal= this.openModal.bind(this)
        this.logOut= this.logOut.bind(this)
        this.openSearchedGame= this.openSearchedGame.bind(this)
        this.setOddType= this.setOddType.bind(this)
        this.changeTheme= this.changeTheme.bind(this)
        this.searchInput = null
        this.timeInterval = null
        this.recaptch_value = null
        this.supportedTZ = [
            'Africa/Accra'
        ]
        this.offsetTmz = []
        this.onError=this.onError.bind(this)
        this.bannersResult=this.bannersResult.bind(this)
        $api.getBanners({bid:2},this.bannersResult,this.onError)
    }
    componentDidMount() {
        // console.log(moment.tz.names())
        for (var i in this.supportedTZ) {
            this.offsetTmz.push(this.supportedTZ[i] + " (GMT " + moment.tz(this.supportedTZ[i]).format('Z') + ")");
        }
        this.setTime()
    }
    componentWillUnmount(){
        clearInterval(this.timeInterval)
        clearTimeout(this.animationTimeout)
    }
    onError(d){
        console.log(d)
      }
    bannersResult({data}){
        this.setState({ads:Array.isArray(data.data)?[...data.data]:[data.data[1]]})
    }
    logOut(){
      this.props.dispatchLogout()
    }
    setOddType(t){
        let oddType = this.props.oddType
        if (t !== oddType)
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ oddType: t }))
        dataStorage('odds_format',t)
    }
    changeTheme(theme){
        let appTheme = this.props.appTheme
        if (theme !== appTheme)
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ appTheme: theme }))
    }
    openModal(contentType=null, tab=1) {
        this.props.dispatch(allActionDucer(MODAL,{modalOpen:true,type:contentType,tabType:tab}))
      }
    openFormModal(contentType) {
        this.props.dispatch(allActionDucer(MODAL,{accVerifyOpen:true,formType:contentType,created:false}))
      }
    setTime(){
        this.timeInterval = setInterval(()=>{this.setState({time:moment.tz(this.supportedTZ[0]).format('H:mm:ss')})},1000)
    }
    setRecaptchaValue(e) {
        e.persist()
        this.recaptch_value = e.target.value
    }
    clearTicketResult() {
        if (this.searchTicketInput && this.recaptchaValue) {
          this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ checkResult: null, searchingTicket: false }))
        }
      }
    openSearchedGame(competition,region,sport,game){
        //  console.log(competition,region,sport,game)
        const activeView = this.props.activeView
        if(activeView === 'Live' || activeView === 'Prematch'){
            this.props.loadGames(competition,region,sport,game,)
            updateBrowserHistoryState({sport:sport.id,region:region.id,competition:competition.id,game:game.id},`/sports/${activeView.toLowerCase}/${sport.alias}/${region.name}/${competition.id}/${game.id}`)    
    }
    else
      this.props.history.replace(`/sports/prematch/${sport.alias}/${region.name}/${competition.id}/${game.id}`,{sport:sport.id,region:region.id,competition:competition.id,game:game.id})
    }
    validate() {
        if (this.searchTicketInput && this.recaptchaValue) {
          this.setState({ searchingTicket: true })
          var val = this.searchTicketInput.value, rval = this.recaptchaValue.value
          if (val !== '' && rval !== '') {
            this.props.validate(val, rval, this.showCheckResult.bind(this))
            this.searchTicketInput.value = ''
            this.recaptchaValue.value = ''
          }
        }
      }
    valChange(e){
        let val = e.target.value
        if(val !== '') this.setState({showRecaptcha:true})
        else this.setState({showRecaptcha:false})
    }
    setLang(langData){
        if(this.props.appState.lang !== langData.sysValue){
            this.props.dispatch(allActionDucer(LANG, { lang: langData.sysValue }))
            new Promise ((resolve,reject)=>{
                setCookie('think_var',langData.cookieValue,'/')
                resolve()
            }
            )  
            .then(()=>{
                window.location.reload()
            })   
        }
    }
    openBetslipSettings() {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetslipSettings: !this.props.sportsbook.showBetslipSettings, animation: true, showTicketBetSearch: false }))
        if (this.animationTimeout)
            clearTimeout(this.animationTimeout)
        this.animationTimeout = setTimeout(() => {
            this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { animation: false }))
        })
    }
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = ''
            this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { searchData: {}, searching: false }))
        }
    }
    showCheckResult(data) {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ checkResult: data.data.details ? data.data.details : { StateName: 'Ticket number not found' }, searchingTicket: false }))
        window.grecaptcha.reset()
        this.setState({showRecaptcha:false})
      }
    render() {
        const { appState, profile, searchDataC,searchData, appTheme, oddType } = this.props,{showHeaderAds,time,ads}= this.state
        let searchResult={game:[],competition:[]},hasGameResult = Object.keys(searchData).length > 0 && Object.keys(searchData.sport).length > 0,hasCompetionsResult=Object.keys(searchDataC).length > 0 && Object.keys(searchDataC.sport).length > 0

        if (hasGameResult) {
            searchResult.game=[]
            Object.keys(searchData.sport).forEach((sport) => {
                searchResult.game.push(searchData.sport[sport])
            })
        }
        if (hasCompetionsResult) {
            searchResult.competition=[]
            Object.keys(searchDataC.sport).forEach((sport) => {
                searchResult.competition.push(searchDataC.sport[sport])
            })
        }
        return (
            <div className={`header-container ${this.props.casinoMode.playMode && 'show-fix fullscreen'}`}>
                {ads.length>0&&showHeaderAds&&<div className="ads">
                    <HeaderAds ads={ads}/>
                    <div className="ads-close">
                        <div title="hide banner" onClick={()=>this.setState({showHeaderAds:false})}><span className="icon-icon-close-x"/></div>
                    </div>
                </div>}
                <div className="header-body bg-primary">
                    <div className="header-inner">
                      {/*  <div className="header-row main">
                            <div className="header-col col-sm-2">
                                <div className="brand">
                                    <div className="brand-name"></div> 
                                    <div className="brand-logo">
                                        <NavLink to="/">
                                            <img src={logo} alt=""/>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className="header-col col-sm-10">

                                <div className="nav-controls">
                                    <div className="top" style={{height:'30px'}}>
                                        <div className="current-tx-time">
                                            <span className="tz">Timezone: </span>
                                            <span className="time">{time}</span>
                                            <span className="tz-select">{this.offsetTmz[0]}</span>
                                        </div>
                                        <div className="lang">
                                            <div tabIndex="0" className="lang-custom-select custom-select">
                                                <div className="selected-lang custom-select-style">
                                                    <span className={`flag-icon ${appState.lang}-lang`}></span><span className="lang-text" data-lang={appState.lang === 'eng'? 'ENGLISH':appState.lang === 'fra'?'FRANÇAIS':appState.lang === 'zhh'?'中文':''}></span>
                                                    <i className="icon-icon-arrow-down"></i>
                                                </div>

                                                <ul className="custom-select-style custom-select-market-types">
                                                    <li className={`selected-lang ${appState.lang === 'eng' && 'current'}`} onClick={()=>this.setLang({cookieValue:'en-gb',sysValue:'eng'})}> <span className="flag-icon eng-lang"></span><span className="lang-text" data-lang="English"></span></li>
                                                    <li className={`selected-lang ${appState.lang === 'fra' && 'current'}`} onClick={()=>this.setLang({cookieValue:'fr-fr',sysValue:'fra'})}><span className="flag-icon fra-lang"></span><span className="lang-text" data-lang="Français"></span></li>
                                                    <li className={`selected-lang ${appState.lang === 'zhh' && 'current'}`} onClick={()=>this.setLang({cookieValue:'zh-cn',sysValue:'zhh'})}><span className="flag-icon zhh-lang"></span><span className="lang-text" data-lang="中文"></span></li>
                                                </ul>

                                            </div>
                                        </div>
                                        <div tabIndex="0" className="settings active">
                                            <div className="settings-icon-container icon" >
                                                <span className="icon-icon-settings"></span>
                                            </div>
                                            <div className="user-settings-menu">
                                                
                                                <ul>
                                                    <li style={{fontSize:'16px',backgroundColor:"#e0e0e8"}}><span>ODDS</span></li>
                                                    <li className={`${oddType ==='decimal' && 'active'}`} onClick={()=>this.setOddType('decimal')}>
                                                        <span>Decimal</span>
                                                    </li>
                                                    <li className={`${oddType ==='fractional' && 'active'}`} onClick={()=>this.setOddType('fractional')}>
                                                        <span>Fractional</span>
                                                    </li>
                                                    <li className={`${oddType ==='american' && 'active'}`} onClick={()=>this.setOddType('american')}>
                                                        <span>American</span>
                                                    </li>
                                                    <li className={`${oddType ==='hongkong' && 'active'}`} onClick={()=>this.setOddType('hongkong')}>
                                                        <span>HongKong</span>
                                                    </li>
                                                    <li className={`${oddType ==='malay' && 'active'}`} onClick={()=>this.setOddType('malay')}>
                                                        <span>Malay</span>
                                                    </li>
                                                    <li className={`${oddType ==='indo' && 'active'}`} onClick={()=>this.setOddType('indo')}>
                                                        <span>Indo</span>
                                                    </li>
                                                    
                                                </ul>
                                                 <ul>
                                                    <li style={{fontSize:'16px',backgroundColor:"#e0e0e8"}}><span>THEMES</span></li>
                                                    <li className={`${appTheme ==='light' && 'active'}`} onClick={()=>this.changeTheme('light')}>
                                                        <span>Light</span>
                                                    </li>
                                                    <li className={`${appTheme ==='dracula' && 'active'}`} onClick={()=>this.changeTheme('dracula')}>
                                                        <span>Dracula </span>
                                                    </li>
                                                   
                                                </ul>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <div className="sportsbook-search" style={{maxWidth: "20%",backgroundColor: 'unset'}}>
                                            <div className="sportsbook-search-input static">
                                                <input placeholder="Search Bet / Ticket" id="bet-checker" className="search-input ember-text-field ember-view" type="text" 
                                                onChange={(e)=>{this.valChange(e)}}ref={(el) => { this.searchTicketInput = el }} style={{ width: '100%', padding: '0 0 0 15px' }}
                                                />
                                                <input id="recaptchaValue" type="text" ref={(el) => { this.recaptchaValue = el }} onChange={(e) => { this.setRecaptchaValue(e) }} style={{ visibility: 'hidden', position: 'absolute' }} />
                                                <div className="g-recaptcha" style={{display:showRecaptcha && 'block'}}>
                                                    {
                                                    site_recaptch_key &&  <ReCAPTCHA
                                                    sitekey={site_recaptch_key}
                                                    onChange={onSubmit}
                                                    onExpired={expiredRecaptcha}
                                                    />
                                                    }
                                                </div>

                                                {
                                                    null === checkResult ?

                                                        <div className="clear" onClick={(e) => { this.validate(e) }} style={{ right: '8px !important' }} title={'search'}>
                                                            <span className="icon-icon-search" title={'search'}></span>
                                                        </div>
                                                        :
                                                        <div title={'clear'} className="clear" onClick={e => this.clearTicketResult()} style={{ right: '8px !important' }}>
                                                            <span className="uci-close" title={'clear'}></span>
                                                        </div>
                                                }

                                                <div className={`search-results ${searchingTicket || (!searchingTicket && checkResult) ? 'open' : ''} ${searchingTicket || null == checkResult ? 'no-results' : ''}`}>

                                                    <div className="search-results-arrow"></div>
                                                    <div className="search-results-inner">
                                                        <div className="search-results-inner-background">
                                                            <div className="search-results-container">{searchingTicket ?
                                                                <div className={`no-results-container sb-spinner`}>
                                                                    <span className="btn-preloader sb-preloader"></span>
                                                                </div> : null}

                                                                {
                                                            null !== checkResult && checkResult.Id ?
                                                                <div className="search-results-section">
                                                                    <div className="search-results-section-title">
                                                                        <span>Ticket/ Bet Result</span>
                                                                    </div>

                                                                    <div className="search-results-sport">
                                                                        <div className="search-results-sport-title">
                                                                            <div className="search-results-sport-title-text">{"ID: " + checkResult.Id}</div>
                                                                        </div>
                                                                        <ul>

                                                                            <li className="search-results-match" >
                                                                                <div className="search-results-match-title"><span className={`${checkResult.StateName.toLowerCase()}-result`}>{checkResult.StateName}</span></div>
                                                                                <div className="search-results-match-details">{"Type:" + checkResult.TypeName}</div>
                                                                            </li>

                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                : null !== checkResult ?
                                                                    <div className="no-results-container" style={{ display: 'block', padding: '15px 0 0 15px' }}>
                                                                        {checkResult.StateName}
                                                                    </div>

                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div> */}
                        <div className="header-row secondary">
                            <div className="header-col col-sm-3">
                            <div className="brand" style={{ width: '140px', paddingTop: '5px' }}>
                                        <div className="brand-name"></div> 
                                        <div className="brand-logo">
                                            <NavLink to="/">
                                                <img src={logo} alt=""/>
                                            </NavLink>
                                        </div>
                                    </div>
                            </div>
                            <div className="header-col col-sm-7">
                                <div className="nav-links">
                                    {/* <div className="brand">
                                        <div className="brand-logo" style={{ width: '130px', paddingTop: '5px' }}>
                                            <NavLink to="/">
                                                <img src={logo} />
                                            </NavLink>
                                        </div>
                                    </div> */}
                                    {/* <div className="link"><NavLink exact to=""><span>Home</span></NavLink></div> */}
                                    <div className="link"><NavLink  to="/sports/prematch"><span><Lang word={"Sports"}/></span></NavLink></div>
                                    <div className="link"><NavLink  to="/sports/live"><span><Lang word={"In-Play"}/></span></NavLink></div>
                                    <div className="link"><NavLink to="/sports/results"><span><Lang word={"Game Results"}/></span></NavLink></div>
                                    <div className="link"><NavLink to="/skypebetting"><span><Lang word={"Skype Betting"}/></span></NavLink></div>
                                    {/* <div className="link new"><NavLink to="/roulette"><span className="text-warning" style={{fontWeight:"900"}}>Roulette</span></NavLink></div>
                                    <div className="link"><NavLink to="/live-casino"><span>Live Casino</span></NavLink></div>
                                    <div className="link"><NavLink to="/slot-games"><span>Slot Games</span></NavLink></div> */}
                                    {/* <div className="link"><NavLink to="/news"><span>News</span></NavLink></div> */}
                                    {/* <div className="link"><NavLink to="/help"><span>Help</span></NavLink></div> */}
                                </div>
                            </div>
                            <div className="header-col col-sm-3 flex" style={{ justifyContent: 'flex-end',paddingRight:!appState.isLoggedIn ?'15px':'25px' }}>
                                {/* {appState.isLoggedIn && <div className="bonus-promo" onClick={()=>this.openModal(5)}><span className="icon-sb-bonuses"></span><i className="notice show-notice"></i></div>} */}
                                {/* <div className="sportsbook-search" style={{ padding: 'unset', paddingTop: 'unset',alignSelf: 'center', backgroundColor: 'unset' }}>
                                  
                                    <div className="sportsbook-search-input static">
                                        <i className="sport-icon icon-icon-search "></i>

                                        <div className="search">
                                            <span className="icon-icon-search"></span>
                                        </div>
                                        <input placeholder="Search Competition/Game" className="search-input ember-text-field ember-view" type="text" onChange={(e) => searchGame(e)} ref={(el) => { this.searchInput = el }} />
                                        {this.searchInput && this.searchInput.value.length > 0 ?
                                            <div className="clear" onClick={() => { this.clearSearch() }}>
                                                <span className="uci-close"></span>
                                            </div>
                                            : null}
                                        <Transition
                                        items={Object.keys(searchData).length > 0  || searching} 
                                        from={{ opacity:0}}
                                        enter={{opacity:1}}
                                        leave={{ opacity:0}}>
                                        { 
                                        showResult=>
                                        showResult &&( props=> 
                                        <div style={{...props}} className={`search-results open ${emptyResult || searching ? 'no-results' : ''}`}>

                                            {(hasGameResult || hasCompetionsResult) &&<div className="search-results-arrow"></div>}
                                            <div className="search-results-inner">
                                                <div className="search-results-inner-background">
                                                    <div className="search-results-container">
                                                        <Transition
                                                        items={searching} 
                                                        from={{ opacity:0}}
                                                        enter={{opacity:1}}
                                                        leave={{ opacity:0}}>
                                                        {
                                                            searching=>
                                                            searching &&
                                                           ( props=><div className="searching-container sb-spinner" style={{...props}}>
                                                            <span className="btn-preloader sb-preloader"></span>
                                                        </div>)}
                                                        </Transition>
                                                            <div className="search-results-section">
                                                        {
                                                            hasGameResult || hasCompetionsResult ?
                                                               <React.Fragment>
                                                                   {hasGameResult &&<div className="search-results-section-title">
                                                                        <span>Games</span>
                                                                    </div>}
                                                                    {searchResult.game.map((sport, regId) => {
                                                                        var region = []
                                                                        Object.keys(sport.region).forEach((reg) => {
                                                                            region.push(sport.region[reg])
                                                                        })
                                                                        return (
                                                                            <div className="search-results-sport" key={regId}>
                                                                                <div className="search-results-sport-title">
                                                                                    <div className="search-results-sport-title-text">{sport.name}</div>
                                                                                </div>
                                                                                <ul>
                                                                                    {
                                                                                        region.map((reg) => {
                                                                                            var competition = [], games = []
                                                                                            Object.keys(reg.competition).forEach((compete => {
                                                                                                competition.push(reg.competition[compete])
                                                                                            }))
                                                                                            return (
                                                                                                competition.map((c) => {
                                                                                                    var games = []
                                                                                                    Object.keys(c.game).forEach((g) => {
                                                                                                        games.push(c.game[g])
                                                                                                    })
                                                                                                    return (
                                                                                                        games.map((game, gameKey) => {
                                                                                                            return (
                                                                                                                <li className="search-results-match" key={gameKey} onClick={() => { this.openSearchedGame(c, reg, sport, game); this.clearSearch() }}>
                                                                                                                    <div className="search-results-match-title">{game.team1_name}{game.team2_name ? ' - ' + game.team2_name : ''}</div>
                                                                                                                    <div className="search-results-match-details">{c.name}</div>
                                                                                                                </li>
                                                                                                            )
                                                                                                        })
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {hasCompetionsResult&& <div className="search-results-section-title">
                                                                        <span>Competitions</span>
                                                                    </div>}
                                                                    {searchResult.competition.map((sport, regId) => {
                                                                        var region = []
                                                                        Object.keys(sport.region).forEach((reg) => {
                                                                            region.push(sport.region[reg])
                                                                        })
                                                                        return (
                                                                            <div className="search-results-sport" key={regId+'compettiions'}>
                                                                                <div className="search-results-sport-title">
                                                                                    <div className="search-results-sport-title-text">{sport.name}</div>
                                                                                </div>
                                                                                <ul>
                                                                                    {
                                                                                        region.map((reg) => {
                                                                                            var competition = [], games = []
                                                                                            Object.keys(reg.competition).forEach((compete => {
                                                                                                competition.push(reg.competition[compete])
                                                                                            }))
                                                                                            return (
                                                                                                competition.map((c) => {
                                                                                                    return (
                                                                                                    <li className="search-results-match" key={c.id} onClick={() => { this.openSearchedGame(c, reg, sport); this.clearSearch() }}>
                                                                                                        <div className="search-results-match-title">{reg.alias} - {c.name}</div>
                                                                                                    </li>
                                                                                                        
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                        )
                                                                    })}
                                                               </React.Fragment>     
                                                            : <div className="no-results-container">
                                                            No search results
                                                        </div>
                                                        }
                                                                </div>

                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                        }
                                    </Transition>
                                    </div>
                                </div> */}
                                <div className="nav-controls" style={{ padding: 0, alignItems: 'center' }}>
                                    {
                                        !appState.isLoggedIn ?
                                        <React.Fragment>
                                            <div className="login" onClick={()=>this.openFormModal('login')}>
                                                <button><Lang word={"sign in"}/></button>
                                            </div>
                                            <div className="register" onClick={()=>this.openFormModal('register')}>
                                                <button><Lang word={"Register"}/></button>
                                            </div>
                                        </React.Fragment>
                                        :
                                        <div className="user-account-buttons">
                                            <div className="balance" onClick={()=>this.openModal(1)}>{(parseFloat(profile.balance) +parseFloat(profile.bonus)).toFixed(3)} {profile.currency}</div>
                                            <div className="user-avatar" onClick={()=>this.openModal(1)}>
                                                
                                            </div>
                                            <div className="user-account-menu">
                                                <ul>
                                                    <li onClick={()=>this.openModal(1)}>
                                                        <span className="profile-icon icon-sb-edit-profile"></span>
                                                        <span><Lang word={"Profile"}/></span>
                                                    </li>
                                                    <li onClick={()=>this.openModal(2)}>
                                                        <span className="profile-icon icon-sb-my-bets"></span>
                                                        <span><Lang word={"Bets History"}/></span>
                                                    </li>
                                                    <li onClick={()=>this.openModal(3)}>
                                                        <span className="profile-icon icon-sb-deposit"></span>
                                                        <span><Lang word={"Deposit"}/></span>
                                                    </li>
                                                    <li onClick={()=>this.openModal(3,2)}>
                                                        <span className="profile-icon icon-sb-wallet"></span>
                                                        <span><Lang word={"Withdrawal"}/></span>
                                                    </li>
                                                    <li onClick={()=>this.openModal(4)}>
                                                        <span className="profile-icon icon-sb-my-bets"></span>
                                                        <span><Lang word={"Transactions"}/></span>
                                                    </li>
                                                    {/* <li onClick={()=>this.openModal(5)}>
                                                        <span className="profile-icon icon-sb-bonuses" style={{position:'relative'}}><i className="notice show-notice"></i></span>
                                                        <span>Bonuses</span>
                                                    </li> */}
                                                    {/* <li onClick={()=>this.openModal(6)}>
                                                        <span className="profile-icon icon-sb-messages"></span>
                                                        <span>Messages</span>
                                                    </li> */}
                                                    <li onClick={()=>this.openModal(1,2)}>
                                                        <span className="profile-icon icon-sb-edit-profile"></span>
                                                        <span><Lang word={"Change Password"}/></span>
                                                    </li>
                                                    <li onClick={this.logOut} className="logout">
                                                        <span className="profile-icon icon-sb-log-out"></span>
                                                        <span><Lang word={"Log out"}/></span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    }
                                    <div className="top" style={{height:'30px'}}>
                                        <div className="lang">
                                            <div tabIndex="0" className="lang-custom-select custom-select">
                                                <div className="selected-lang custom-select-style">
                                                    <span className={`flag-icon ${appState.lang}-lang`}></span><span className="lang-text" data-lang={appState.lang === 'eng'? 'ENGLISH':appState.lang === 'fra'?'FRANÇAIS':''}></span>
                                                    <i className="icon-icon-arrow-down"></i>
                                                </div>

                                                <ul className="custom-select-style custom-select-market-types">
                                                    <li className={`selected-lang ${appState.lang === 'eng' && 'current'}`} onClick={()=>this.setLang({cookieValue:'en-gb',sysValue:'eng'})}> <span className="flag-icon eng-lang"></span><span className="lang-text" data-lang="English"></span></li>
                                                    <li className={`selected-lang ${appState.lang === 'fra' && 'current'}`} onClick={()=>this.setLang({cookieValue:'fr-fr',sysValue:'fra'})}><span className="flag-icon fra-lang"></span><span className="lang-text" data-lang="Français"></span></li>
                                                    {/* <li className={`selected-lang ${appState.lang === 'zhh' && 'current'}`} onClick={()=>this.setLang({cookieValue:'zh-cn',sysValue:'zhh'})}><span className="flag-icon zhh-lang"></span><span className="lang-text" data-lang="中文"></span></li> */}
                                                </ul>

                                            </div>
                                        </div>
                                        <div tabIndex="0" className="settings active">
                                            <div className="settings-icon-container icon" >
                                                <span className="icon-icon-settings"></span>
                                            </div>
                                            <div className="user-settings-menu">
                                                
                                                <ul>
                                                    <li style={{fontSize:'16px',backgroundColor:"#e0e0e8"}}><span><Lang word={"ODDS"}/></span></li>
                                                    <li className={`${oddType ==='decimal' && 'active'}`} onClick={()=>this.setOddType('decimal')}>
                                                        <span><Lang word={"Decimal"}/></span>
                                                    </li>
                                                    <li className={`${oddType ==='fractional' && 'active'}`} onClick={()=>this.setOddType('fractional')}>
                                                        <span><Lang word={"Fractional"}/></span>
                                                    </li>
                                                    <li className={`${oddType ==='american' && 'active'}`} onClick={()=>this.setOddType('american')}>
                                                        <span><Lang word={"American"}/></span>
                                                    </li>
                                                    <li className={`${oddType ==='hongkong' && 'active'}`} onClick={()=>this.setOddType('hongkong')}>
                                                        <span><Lang word={"HongKong"}/></span>
                                                    </li>
                                                    <li className={`${oddType ==='malay' && 'active'}`} onClick={()=>this.setOddType('malay')}>
                                                        <span><Lang word={"Malay"}/></span>
                                                    </li>
                                                    <li className={`${oddType ==='indo' && 'active'}`} onClick={()=>this.setOddType('indo')}>
                                                        <span><Lang word={"Indo"}/></span>
                                                    </li>
                                                    
                                                </ul>
                                                 {/* <ul>
                                                    <li style={{fontSize:'16px',backgroundColor:"#e0e0e8"}}><span><Lang word={"THEMES"}/></span></li>
                                                    <li className={`${appTheme ==='light' && 'active'}`} onClick={()=>this.changeTheme('light')}>
                                                        <span><Lang word={"Light"}/></span>
                                                    </li>
                                                    <li className={`${appTheme ==='dracula' && 'active'}`} onClick={()=>this.changeTheme('dracula')}>
                                                        <span><Lang word={"Dracula"}/> </span>
                                                    </li>
                                                   
                                                </ul> */}
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
export default withRouter(Header)