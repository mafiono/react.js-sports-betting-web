import React, { PureComponent } from 'react'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import moment from 'moment'
import 'moment/locale/fr'
import { BetHistoryLoader } from '../loader'
import { getCookie } from '../../common'
import API from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
import Lang from '../../containers/Lang'
const $api = API.getInstance()
export default class Bonuses extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      openedBet: null,
      attempttingBonusClaim: false,
      datepickerF: moment().startOf('month'),
      datepickerT: moment().endOf('month'),
      bonusHistory: [],
      bonusList: [],
      uid: getCookie('id'),
      AuthToken: getCookie('AuthToken'),
      currentPage: 1,
      formType: 4,
      opened:null,
      bonusStatement:{goalAmount:0,presentAmount:0},
      attempttingBonusWithdraw:false
    }
    this.getBetHistory = this.getBetHistory.bind(this)
    this.onDateChangeF = this.onDateChangeF.bind(this)
    this.onDateChangeT = this.onDateChangeT.bind(this)
    this.showBonusDetails = this.showBonusDetails.bind(this)
    this.claimBonus = this.claimBonus.bind(this)
  }
  componentDidMount() {
    // const {datepickerF,datepickerT} = this.state
    // $("#datepickerFH").datepicker({ maxDate: '0', onSelect: function () { onSelect('datepickerFH') } });
    // $("#datepickerTH").datepicker({ maxDate: '0', onSelect: function () { onSelect('datepickerTH') } });
    // $("#datepickerFH").datepicker("option", "dateFormat", "yy/mm/dd");
    // $("#datepickerTH").datepicker("option", "dateFormat", "yy/mm/dd");
    // $("#datepickerFH").datepicker("setDate", new Date(datepickerF));
    // $("#datepickerTH").datepicker("setDate", new Date(datepickerT));
    this.getBetHistory()
    this.getBonusesList()
    this.getBonusStatement()
  }
  componentDidUpdate() {
    //  if(this.state.reloadHistory) {
    //   const { datepickerF, datepickerT, bet_id, outcome,bet_type,period,periodType} = this.state;
    //   let p={ from_date: periodType?(moment().unix() - 3600 * period): moment(datepickerF).startOf('day').unix(), to_date: periodType?moment().unix():moment(datepickerT).endOf('day').unix()};
    //   if(null !==bet_id && bet_id.length>0 )p.bet_id =bet_id;
    //    if(outcome!=='-1')p.outcome=outcome;
    //     if(bet_type!=='-1')p.bet_type = bet_type;
    //   this.getBetHistory(p);
    //  }
  }
  showBonusDetails(id){
    this.setState(prevState=>({opened:prevState.opened ===id? null : id}))
  }
  reloadHistory() {
    this.setState({ reloadHistory: !0, loadingHistory: !0 })
  }
  attemptCashout(bet = null) {
    this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
  }
  getBetHistory(where = {}) {
    this.setState({ reloadHistory: !0, loadingHistory: !0 })
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
    $hash = calcMD5(`uid${uid}time${$time}${this.props.appState.$publicKey}`)
    let p = { uid: uid, time: $time, hash: $hash }
    p = { ...p, ...where }
    $api.getUserBonusHistory(p, this.onSuccess.bind(this))

  }
  getBonusesList() {
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
    $hash =calcMD5(`uid${uid}time${$time}${this.props.appState.$publicKey}`)
    let p = { time:$time,uid:uid,hash:$hash }
    $api.getBonusList(p, this.onListFetched.bind(this))
  }
  getBonusStatement() {
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
    $hash =calcMD5(`uid${uid}time${$time}${this.props.appState.$publicKey}`)
    let p = { time:$time,uid:uid,hash:$hash }
    $api.getBonusStatement(p, this.onStatementFetched.bind(this))
  }
  loadMore() {
    const { currentPage } = this.state
    this.setState({ currentPage: currentPage + 1 })
    this.getBetHistory({ page: currentPage + 1 })
  }
  onListFetched({ data }) {
    let state = {}
    if (data && data.status === 200 && data.data.length) state.bonusList = data.data
    this.setState(state)
  }
  onStatementFetched({ data }) {
    let state = {}
    if (data && data.status === 200 &&  typeof data.data!= 'string') state.bonusStatement = data.data
    this.setState(state)
  }
  onSuccess({ data }) {
    let state = { reloadHistory: !1, loadingHistory: !1, data }
    if (data && data.status === 200 && data.data.length) state.bonusHistory = data.data
    // else makeToast(data.msg,5000)
    this.setState(state)

  }
  onDateChangeF(e) {
    e.persist()
    let id = e.target.id, val = e.target.value, mDate = moment(val), datepickerT = this.state.datepickerT ? this.state.datepickerT : moment().format('YYYY-MM-DD')
    if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(datepickerT).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerT), 'days') < 0 || mDate.diff(moment(datepickerT), 'days') > 30) {
      var incrDate = moment(val).add(1, 'days')
      if (moment(moment(incrDate).format('YYYY-MM-DD')).isAfter(moment(val).endOf('month').format('YYYY-MM-DD')))
        incrDate = moment(val).endOf('month')
      $("#datepickerTH").datepicker("setDate", new Date(incrDate.format('YYYY/MM/DD')));
      datepickerT = incrDate
    }
    $("#datepickerFH").val(moment(val).format('YYYY/MM/DD'));
    this.setState({ periodType: 0, datepickerF: val, datepickerT: datepickerT })
  }
  onDateChangeT(e) {
    e.persist()

    let id = e.target.id, val = e.target.value, mDate = moment(val), datepickerF = this.state.datepickerF ? this.state.datepickerF : moment().format('YYYY-MM-DD')
    if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(val).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerF), 'days') > 30 || mDate.diff(moment(datepickerF), 'days') < 0) {
      var decrDate = moment(val).subtract(1, 'days')
      if (moment(moment(decrDate).format('YYYY-MM-DD')).isBefore(moment(datepickerF).startOf('month').format('YYYY-MM-DD')))
        decrDate = moment(datepickerF).startOf('month')
      $("#datepickerFH").datepicker("setDate", new Date(decrDate.format('YYYY/MM/DD')));
      datepickerF = decrDate
    }
    $("#datepickerTH").val(mDate.format('YYYY/MM/DD'));
    this.setState({ periodType: 0, datepickerT: val, datepickerF: datepickerF })
  }
  claimBonus(bonus) {
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
    $hash = calcMD5(`uid${uid}bid${bonus.Id}time${$time}${this.props.appState.$publicKey}`)
    let p = {type:1, bid: bonus.Id,isCash:bonus.isCash, uid: uid, time: $time, hash: $hash }
    this.props.showClaimDialog(p)

  }
  withdrawBonus(){
    const { uid } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash = calcMD5(`uid${uid}time${$time}${this.props.appState.$publicKey}`)
    let p = { uid: uid, time: $time, hash: $hash,type:2 }
    this.props.showClaimDialog(p)
  }
  setBetID(e) {
    e.persist()
    let a = e.target.value
    this.setState({ bet_id: a })
  }
  setBetType(e) {
    e.persist()
    let a = e.target.value
    this.setState({ bet_type: a })
  }
  setOutcome(e) {

    this.setState({ outcome: e })
  }
  setPeriod(e) {
    e.persist()
    let a = e.target.value,
      $dates = $("#datepickerFH,#datepickerTH").datepicker();
    $dates.datepicker('setDate', null);
    this.setState({ datepickerF: null, datepickerT: null, periodType: 1, period: a })
  }
  clearDateRange(id) {
    $("#" + id).datepicker('setDate', null);
    id = id.substr(0, id.length - 1)
    var obj = { periodType: 1 }
    obj[id] = ''
    this.setState(obj)
  }
  changeForm(type) {
    if (type !== this.props.formType) {
      this.setState({ amount: '' })
      this.props.changeForm(type)
    }
  }
  render() {
    const config = this.props.config, { loadingHistory, bonusHistory, bonusList,opened,bonusStatement} = this.state, { onClose, formType,attempttingBonusClaim ,attempttingBonusWithdraw,currency} = this.props

    return (
      <div className="section-content col-sm-9">

        <div className="filter">
          <div className="header"><div className="title" style={{ padding: '15px' }}>Bonuses 
           <div className="filter-input-container">

            <div className="input-group" style={{ margin: '0 0 5px 5px' }}>
              <div style={{ height: '38px' }}></div>

            </div>
          </div>
          </div>
          <div onClick={() => { onClose() }} className="close uci-close"></div>
          </div>
          <div className="bonus-wagering-statement" style={{display:'flex',flexDirection:'row',alignItems:'center',height:'40px',backgroundColor:'rgba(255, 150, 29, 0.47)',color:'#fff',borderRadius:'5px',padding:'0 10px',marginBottom:'5px'}}>
          <div style={{flex:'1 5%'}}><span className="profile-icon icon-sb-info" title="bonus wagering statement"></span></div>
          <div style={{height:'100%',flex:'1 65%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} className="statement-container">
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',height:'100%'}}><span style={{fontSize:'13px',fontWeight:700,marginRight:'10px'}}>Wagered:   </span><span style={{color:'#028947',fontSize:'15px',fontWeight:700}}>{bonusStatement.presentAmount}  {currency}</span></div>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',height:'100%'}}><span style={{fontSize:'13px',fontWeight:700,marginRight:'10px'}}>Remaining:   </span><span style={{color:'#028947',fontSize:'15px',fontWeight:700}}>{bonusStatement.goalAmount - bonusStatement.presentAmount}  {currency}</span></div>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',height:'100%'}}><span style={{fontSize:'13px',fontWeight:700,marginRight:'10px'}}>Target:   </span><span style={{color:'#028947',fontSize:'15px',fontWeight:700}}>{bonusStatement.goalAmount}  {currency}</span></div>
          </div>
          <button className="search" style={{marginLeft:'10px', width: '130px', position: 'relative',backgroundColor:'#11c9e3' }} onClick={this.withdrawBonus.bind(this)}>
                {attempttingBonusWithdraw ?
                  <div className="no-results-container sb-spinner">
                    <span className="btn-preloader sb-preloader"></span>
                  </div>
                  :
                  <span>Withdraw Bonus</span>}</button>
         </div>
          <div className="sorter">
            <div className={formType === 1 ? 'active' : ''} onClick={() => { this.changeForm(1) }}> <span>Bonus </span>
            </div>
            <div className={formType === 4 ? 'active' : ''} onClick={() => { this.changeForm(4) }}><span>Bonus History</span>
            </div>
          </div>
         

        </div>
       
        {
          formType === 1  ?
            <div style={{overflow:'auto'}}>
              <table className="" style={{marginBottom:10}}>
                <thead className="lt-head" style={{backgroundColor:"rgb(170, 175, 179)",color:'#fff'}}>
                  <tr>
                    <th rowSpan="2" colSpan="1" draggable="false"className="lt-column align-left is-hideable ember-view">Bonus Name</th>
                    <th rowSpan="2" colSpan="1" draggable="false" className="lt-column align-center is-hideable ember-view">Amount</th>
                    <th rowSpan="2" colSpan="1" draggable="false" className="lt-column align-center is-hideable ember-view">Game Type</th>
                  </tr>
                  <tr></tr>
                </thead>
              </table>
              {
                bonusList.map((bonus,ind)=>{
                  let bonusGames = bonus.Games.split(',').map((game)=>{return game === '1'? ' Sports Booking ' :game==='2' ? ' Slot Games ': game ==='3'? ' Roulette':''})
                  return(
                      <div key={ind} className="tse-scroll-content ember-view" style={{overflowY:'auto'}}>  
                      <div className="tse-content scrollable-content">
                        <div className="lt-inline lt-head"></div>

                        <table className="">
                          <tbody className="lt-body">
                            <tr colSpan="1" className={`lt-row is-expandable ember-view ${opened === bonus.Id && 'is-expanded'}`} onClick={()=>this.showBonusDetails(bonus.Id)}>
                              <td className="lt-cell align-left ember-view">{bonus.Name}</td>
                              <td className="lt-cell align-center ember-view">
                                <div className="ember-view"> --- </div>
                              </td>
                              <td className="lt-cell align-center ember-view">
                                <div className="bonus-status ember-view">{bonusGames.join(',')}</div>
                              </td>
                            </tr>

                            <tr className="lt-row lt-expanded-row" style={{display: opened !== bonus.Id && 'none'}}>
                              <td colSpan="3">
                                <div className="bonus-expanded-row ember-view">
                                  <div className="bonus-dates col-sm-3 col-xs-12">
                                    <table>      
                                      <tbody>
                                      <tr>
                                      <td>Starting Date:</td>
                                      <td>{bonus.StartDate}</td>
                                    </tr>
                                      <tr>
                                        <td>Ending Date:</td>
                                        <td>{bonus.EndDate}</td>
                                      </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="bonus-details col-sm-9">
                                    <div className="bonus-details-table">
  
                                      <table>
                                        <tbody>
                                        <tr>
                                          <th>Bonus Validity</th>
                                          <th>Wagering Req</th>
                                          <th>Min/Max deposit</th>
                                        </tr>
                                        <tr>
                                          <td>{bonus.BonusValidity} day(s)</td>
                                          <td>10x</td>
                                          <td className="bonus-currency"><span>{bonus.LimitMinAmount}</span> / <span>{bonus.LimitMaxAmount}</span></td>
                                        </tr>
                                        </tbody>
                                      </table>
                                      <div className="bonus-details bonus-details-border">
                                        <div className="bonus-description" dangerouslySetInnerHTML={{__html:bonus.Description}}></div>
                                      </div>
                                    </div>
                                    <div className="claim-bonus">
                                    <div className="input-group" style={{ margin: '0 0 5px 5px' }}>
                                        <div style={{ height: '38px' }}></div>
                                        <button className="search" style={{ width: '150px', position: 'relative' }} onClick={()=>this.claimBonus(bonus)}>
                                          {attempttingBonusClaim ?
                                            <div className="no-results-container sb-spinner">
                                              <span className="btn-preloader sb-preloader"></span>
                                            </div>
                                            :
                                            <span>CLAIM BONUS</span>}</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </td>
                            </tr>



                          </tbody>
                        </table>

                        <div className="lt-inline lt-foot"></div>


                      </div>
                      </div>
                  )
                })
              }
            </div>
            :
            formType === 4 ?
              <React.Fragment>
                <div className="data" style={{ marginTop: '0' }}>
                  <div className="bet-details table-header">
                    <div><Lang word={"Bonus Name"}/></div>
                    <div><Lang word={"Bonus Amount"}/></div>
                    <div><Lang word={"Real Amount"}/></div>
                    <div><Lang word={"Expiration Date"}/></div>
                    <div><Lang word={"Status"}/></div>
                  </div>
                  {
                    loadingHistory ?
                      <BetHistoryLoader />
                      :
                      bonusHistory.length ?
                        bonusHistory.map((history, i) => {
                          // var selections = [], b = { totalAmount: 0 }
                          // b.totalAmount = (bet.bonus_bet_amount ? bet.bonus_bet_amount : "" + bet.amount ? bet.amount : "").toString()
                          // Object.keys(bet.events).forEach((evt) => {
                          //   selections.push(bet.events[evt])
                          // })
                          return (
                            <div key={history.Id}>
                              <div className="bet-details">
                                <div className="id">{history.Bid}</div>
                                <div className="stake">{history.BonusAmount}  </div>
                                <div className={`type`}><span style={{ paddingLeft: '5px' }}>{history.RealAmount} {this.props.profile.currency}</span></div>
                                <div className="date">{moment(history.ExpirationDate).format('ddd, D MMM YYYY')}</div>
                                <div className={`state`}><span style={{ paddingLeft: '5px' }}>{Lang(history.Status)}</span></div>

                              </div>
                            </div>
                          )
                        }) :
                        <div className="empty-content"><span><Lang word={"There are no trasactions for the selected time period"}/>.</span></div>
                  }
                </div>
                <div className="load-more" style={{ display: !bonusHistory.length && 'none', margin: 10 }}>
                  <div style={{ margin: ' 0 auto' }} onClick={this.loadMore.bind(this)}><Lang word={"Show More"}/></div>
                </div>
              </React.Fragment>
              : null
        }
      </div>

    )
  }
}