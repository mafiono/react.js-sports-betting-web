import React, { PureComponent } from 'react'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import  moment from 'moment'
import 'moment/locale/fr'
import {BetHistoryLoader} from '../../components/loader'
import {getCookie, onSelect} from '../../common'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH } from '../../actionReducers'
import  CashoutDialog  from '../../components/cashoutdialog'
import API from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
import Lang from '../../containers/Lang';
import { translate } from '../Lang'

const $api = API.getInstance();
export default class BetHistory extends PureComponent{
    constructor(props) {
      super(props)
      this.state = {
        loadingInitialData:false,
        openedBet: null,
        showCashoutDailog:false,
        reloadHistory:false,
        openCashout: false,
        cashingOut: null,
        status: '-1',
        type: '-1',
        bet_id: '',
        period: 24,
        periodType: 1,
        datepickerF: '',
        datepickerT: ''
      }
      this.upcomingGamesPeriods = [1, 2, 3, 6, 12, 24, 48, 72]
      this.betState = { 0: "Unsettled",1:"Accepted", 3: "Lost", 2: "Returned", 4: "Won", 5: "Cashed out" }
      this.betType = { 1: "Single", 2: "Multiple", 3: "System", 4: "Chain" }
      this.openSelection = this.openSelection.bind(this)
      this.searchBetHistoryResult = this.searchBetHistoryResult.bind(this)
      this.getBetHistory = this.getBetHistory.bind(this)
      this.onDateChangeF = this.onDateChangeF.bind(this)
      this.onDateChangeT = this.onDateChangeT.bind(this)
      this.cancelAutoCashOutRule = this.cancelAutoCashOutRule.bind(this)
      this.doCashout = this.doCashout.bind(this)
      this.getBetAutoCashout = this.getBetAutoCashout.bind(this)
      this.createAutoCashOutRule = this.createAutoCashOutRule.bind(this)
       this.rids = this.props.sportsbook.rids
       moment.locale(this.props.appState.lang.substr(0,2))
    }
    componentDidMount() {
       const{sessionData}=this.props.sportsbook
      if (!this.state.loadingInitialData) {
      this.getBetHistory()
      this.setState({ loadingInitialData: true})  
    }
      $("#datepickerFH").datepicker({ maxDate: '0', onSelect: function () { onSelect('datepickerFH') }, changeMonth: true,
      changeYear: true});
      $("#datepickerTH").datepicker({ maxDate: '0', onSelect: function () { onSelect('datepickerTH') },changeMonth: true,
      changeYear: true });
      $("#datepickerFH").datepicker("option", "dateFormat", "yy/mm/dd");
      $("#datepickerTH").datepicker("option", "dateFormat", "yy/mm/dd");
      // $("#datepickerFH").datepicker("setDate", new Date(datepickerF));
      // $("#datepickerTH").datepicker("setDate", new Date(datepickerT));
    }
    componentDidUpdate() {
      const{sessionData,bets_history}=this.props.sportsbook
      if (undefined !== sessionData.sid && !this.state.loadingInitialData && void 0 ===bets_history.bets) {
        this.getBetHistory()
        this.setState({ loadingInitialData: true})  
      }      
       if(this.state.reloadHistory) {
        const { datepickerF, datepickerT, bet_id, status,type,period,periodType} = this.state;
        let p={ from_date: periodType?(moment().unix() - 3600 * period): moment(datepickerF).startOf('day').unix(), to_date: periodType?moment().unix():moment(datepickerT).endOf('day').unix()};
        if(null !==bet_id && bet_id.length>0 )p.bet_id =bet_id;
         if(status!=='-1')p.status=status;
          if(type!=='-1')p.type = type;
        this.getBetHistory(p);
       }
    }
    reloadHistory() {
      this.setState({ reloadHistory: !0 })
    }
    attemptCashout(bet = null) {
      this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
    }
    getBetHistory(where = null) {
      this.setState({ reloadHistory: !1 })
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ loadingHistory: true }))
    
      if (null !== where) {
        where = where
      }else  where= {
        range: -1,
        startDate: moment(moment().unix() - 3600 * 24).format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }
      const userId = getCookie('id'), authToken = getCookie('AuthToken'),email = getCookie('email'),$time = moment().format('YYYY-MM-DD H:mm:ss'),hash=
      calcMD5(`AuthToken${authToken}uid${userId}email${email}time${$time}${this.props.appState.$publicKey}`);
      where.email= email
      where.hash =hash
      where.uid= userId
      where.time =$time
      where.AuthToken =authToken
      $api.getUserBetHistory(where,this.betHistoryData.bind(this))
      // this.props.sendRequest(this.rids[14].request)
      
    }
    betHistoryData({data}) {
      void 0 !== data.data &&this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { bets_history: data.data, loadingHistory: false, reloadHistory: !1 }))
    }
    onDateChangeF(e) {
      e.persist()
      let id = e.target.id, val = e.target.value, mDate = moment(val), datepickerT = this.state.datepickerT?this.state.datepickerT:moment().format('YYYY-MM-DD')
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
  
      let id = e.target.id, val = e.target.value, mDate = moment(val), datepickerF = this.state.datepickerF?this.state.datepickerF:moment().format('YYYY-MM-DD')
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
    searchBetHistoryResult() {
      const { datepickerF, datepickerT, bet_id, status, type, period, periodType } = this.state;
      let p = { range:-1,startDate: periodType ? (moment().unix() - 3600 * period).format('YYYY-MM-DD'): moment(datepickerF).startOf('day').format('YYYY-MM-DD'), endDate: periodType ? moment().format('YYYY-MM-DD') : moment(datepickerT).endOf('day').format('YYYY-MM-DD') };
      if (null !== bet_id && bet_id.length > 0) p.bet_id = bet_id;
      if (status !== '-1') p.status = status;
      if (type !== '-1') p.type = type;
      this.getBetHistory(p);
    }
    openSelection(id) {
      if (this.state.openedBet !== id)
        this.setState({ openedBet: id })
      else
        this.setState({ openedBet: null })
    }
    showCashoutPanel(data) {
      data && this.setState({ openCashout: true, cashingOut: data })
    }
    setBetID(e) {
      e.persist()
      let a = e.target.value
      this.setState({ bet_id: a })
    }
    setBetType(e) {
      e.persist()
      let a = e.target.value
      this.setState({ type: a })
    }
    setstatus(e) {
  
      this.setState({ status: e })
    }
    setPeriod(e) {
      e.persist()
      let a = e.target.value,
      $dates = $("#datepickerFH,#datepickerTH").datepicker();
      $dates.datepicker('setDate', null);
      this.setState({datepickerF:null,datepickerT:null, periodType: 1, period: a })
    }
    clearDateRange(id){
      $("#"+id).datepicker('setDate', null);
        id = id.substr(0, id.length-1)
        var obj={periodType: 1} 
       obj[id]='' 
       this.setState(obj)
    }
    doCashout(data, callback) {
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d, this.reloadHistory.bind(this)) }, id: data.id, request: {
          command: "cashout",
          params: {
            bet_id: data.id,
            price: data.cash_out,
            mode: data.incaseAmountChange
          }, rid: ridStart
        }
      }
      "partial" === data.auto && (this.rids[ridStart].request.params.partial_price = data.partial_amount)
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    getBetAutoCashout(data, callback) {
  
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
          command: "get_bet_auto_cashout",
          params: {
            bet_id: data.id
          }, rid: ridStart
        }
      }
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    createAutoCashOutRule(data, callback) {
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
          command: "set_bet_auto_cashout",
          params: {
            bet_id: data.id,
            min_amount: data.valueReaches
          }, rid: ridStart
        }
      }
      "partial" === data.auto && (this.rids[ridStart].request.params.partial_amount = data.partial_amount);
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    cancelAutoCashOutRule(data, callback) {
      let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
      this.rids[ridStart] = {
        rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
          command: "cancel_bet_auto_cashout",
          params: {
            bet_id: data.id
          }, rid: ridStart
        }
      }
      let newRid = {}
      newRid[ridStart]=this.rids[ridStart]
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(this.rids[ridStart].request)
    }
    render() {
      const  {bets_history,loadingHistory, config} = this.props.sportsbook,{cashable_bet, status, type, bet_id, period,datepickerF,datepickerT,showCashoutDailog }= this.state,{ onClose,profile}= this.props
      let bets = [], historyStats = { totalAmount: 0, betEventCounts: { unsettled: 0, lost: 0, won: 0, cashout: 0, returned: 0, all: 0 } }
      // for (let m = 0; m < 5; m++) {
      //   var name = currentdate.clone(), mstart = currentdate.clone(), mend = currentdate.clone()
      //   dateRange.push({ name: name.format('MMMM YYYY'), end: mend.endOf('month').unix(), start: mstart.startOf('month').unix(), range: 'month' })
      //   for (let w = 0; w < 5; w++) {
      //     var date = currentdate.clone(), name = currentdate.clone(), nameend = currentdate.clone(), start = currentdate.clone(), end = currentdate.clone()
      //     if (moment(date.subtract(1, 'weeks').format('YYYY-MM-DD')).isSameOrAfter(mstart.startOf('month').format('YYYY-MM-DD'))) {
      //       dateRange.push({ name: name.subtract(1, 'weeks').format('DD MMM') + ' - ' + nameend.format('DD MMM'), start: start.subtract(1, 'weeks').unix(), end: end.unix(), range: 'week' })
      //       currentdate = currentdate.subtract(1, 'weeks')
      //     } else {
      //       dateRange.push({ name: mstart.startOf('month').format('DD MMM') + ' - ' + nameend.format('DD MMM'), start: start.subtract(1, 'weeks').unix(), end: end.unix(), range: 'week' })
      //       break
      //     }
      //   }
      //   currentdate = currentdate.endOf('month').subtract(1, 'month')
      // }
      if (bets_history.bets) {
        Object.keys(bets_history.bets).forEach((key) => {
          if (null === bet_id || bet_id === '') {
            switch (parseInt(bets_history.bets[key].status)) {
              case 0:
                historyStats.betEventCounts.unsettled++;
                break;
              case 1:
                historyStats.betEventCounts.lost++;
                break;
              case 2:
                historyStats.betEventCounts.returned++;
                break;
              case 3:
                historyStats.betEventCounts.won++;
                break;
              case 5:
                historyStats.betEventCounts.cashout++
                break
              default: break
            }
            historyStats.betEventCounts.all++;
  
          }
          if (status !== '-1' && type !== '-1') {
            if (bets_history.bets[key].status === status && bets_history.bets[key].type === type)
              bets.push(bets_history.bets[key])
          } else if (status !== '-1') {
            if (bets_history.bets[key].status === status)
              bets.push(bets_history.bets[key])
  
          } else if (type !== '-1') {
            if (bets_history.bets[key].type === type)
              bets.push(bets_history.bets[key])
          } else {
            bets.push(bets_history.bets[key])
          }
        })
      }
      return (

          <div className="section-content col-sm-9">
              {
                showCashoutDailog &&
                <CashoutDialog onCancelRule={this.cancelAutoCashOutRule}
                  onCashout={this.doCashout}
                  cashable_bet={cashable_bet}
                  profile= {this.props.profile}
                  onGetCashoutRule={this.getBetAutoCashout}
                  onAttemptCashout={this.attemptCashout.bind(this)}
                  onSetAutoCashout={this.createAutoCashOutRule}
                  onUserInteraction={this.closeBetHistory}
                  config={config} /> 
              }

            <div className="filter">
              <div className="header"><div className="title" style={{ padding: '15px' }}><Lang word={"My Bets History"}/></div><div onClick={() => { onClose() }} className="close uci-close"></div></div>
              <div className="sorter">
                <div className={status === '-1' ? 'active' : ''} onClick={() => { this.setstatus('-1') }}> <span><Lang word={"All"}/> {historyStats.betEventCounts.all > 0 ? <span>{historyStats.betEventCounts.all}</span> : null}</span>
                </div>
                <div className={status === '0' ? 'active' : ''} onClick={() => { this.setstatus("0") }}><span><Lang word={"Open"}/>{historyStats.betEventCounts.unsettled > 0 ? <span>{historyStats.betEventCounts.unsettled}</span> : null}</span>
                </div>
                {/* <div className={status === '5' ? 'active' : ''} onClick={() => { this.setstatus(5) }}><span>Cashed-out{historyStats.betEventCounts.cashout > 0 ? <span>{historyStats.betEventCounts.cashout}</span> : null}</span>
                </div> */}
                <div className={status === '3' ? 'active' : ''} onClick={() => { this.setstatus("3") }}><span><Lang word={"Won"}/>{historyStats.betEventCounts.won > 0 ? <span>{historyStats.betEventCounts.won}</span> : null}</span>
                </div>
                <div className={status === '1' ? 'active' : ''} onClick={() => { this.setstatus("1") }}> <span><Lang word={"lost"}/>{historyStats.betEventCounts.lost > 0 ? <span>{historyStats.betEventCounts.lost}</span> : null}</span>
                </div>
                <div className={status === '2' ? 'active' : ''} onClick={() => { this.setstatus("2") }}><span><Lang word={"Returned"}/>{historyStats.betEventCounts.returned > 0 ?
                  <span>{historyStats.betEventCounts.returned}</span> : null}</span></div>
              </div>
              <div className="filter-input-container">
                <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                  <span><Lang word={"Bet ID"}/></span>
                  <div className="sportsbook-input-value" style={{ padding: '0' }}>
                    <div className="sportsbook-search-input static">
                      <input autoComplete="off" placeholder="#" style={{ textAlign: 'unset', height: '36px' }} className="search-input ember-text-field ember-view" value={bet_id} onChange={(e) => { this.setBetID(e) }} ref={(el) => this.partialInput = el} />
                    </div>
                  </div>
                </div>
                <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                  <span><Lang word={"Bet Type"}/></span>
                  <select name="betType" value={type} onChange={(e) => { this.setBetType(e) }}>
                    <option value="-1">{translate(this.props.appState.lang,"All")}</option>
                    <option value="1">{translate(this.props.appState.lang,"Single")}</option>
                    <option value="2">{translate(this.props.appState.lang,"Multiple")}</option>
                    <option value="3">{translate(this.props.appState.lang,"System")}</option>
                    <option value="4">{translate(this.props.appState.lang,"Chain")}</option>
                  </select>
                  <i className="icon-icon-arrow-down"></i>
                </div>
                {/* <div className="input-group">
                  <span>status</span>
                  <select name="date" onClick={(e) => e.stopPropagation()} value={status} onChange={(e) => {this.setstatus(e) }}>
                    <option value={-1}>All</option>
                    <option value={0}>Unsettled</option>
                    <option value={1}>Lost</option>
                    <option value={2}>Returned</option>
                    <option value={3}>Won</option>
                    <option value={5}>Cashed out</option>
                  </select>
                  <i className="icon-icon-arrow-down"></i>
                </div> */}
                <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                  <span><Lang word={"Time Period"}/></span>
                  <select name="date" value={period} onChange={(e) => { this.setPeriod(e) }} >
                    {
                      this.upcomingGamesPeriods.map((range, ind) => {
                        return (
                          <option key={ind} value={range}>{range} {range > 1 ? 'Hours' : 'Hour'}</option>
                        )
                      })
                    }
                  </select>
                  <i className="icon-icon-arrow-down"></i>
                </div>
                <div className="input-group" style={{ margin: '0 0 5px 0'}}>
                  <span><Lang word={"Date Range"}/></span>
                  <div style={{display:"flex" }}>
                  <div className="datepicker-holder">
                    <input type="text" id="datepickerFH" onChange={(e) => { this.onDateChangeF(e) }} placeholder="From" autoComplete="off" />
                    {datepickerF !==''?<div className="clear" onClick={()=>this.clearDateRange("datepickerFH")}><span className="uci-close"></span></div>:null}
                  </div>
                  <div className="datepicker-holder">
                    <input type="text" id="datepickerTH" onChange={(e) => { this.onDateChangeT(e) }} placeholder="To" autoComplete="off" />
                    {datepickerT !==''?<div className="clear" onClick={()=>this.clearDateRange("datepickerTH")}><span className="uci-close"></span></div>:null}
                  </div>
                  </div>
                </div>
                <div className="input-group" style={{ margin: '0 0 5px 5px' }}>
                  <div style={{ height: '38px' }}></div>
                  <button className="search" onClick={() => { this.searchBetHistoryResult() }}><span><Lang word={"Show"}/></span></button>
                </div>
              </div>
  
            </div>
  
            <div className="data" style={{ marginTop: '0' }}>
              <div className="bet-details table-header">
                <div className="more"></div>
                <div><Lang word={"Date"}/></div>
                <div><Lang word={"Bet ID"}/></div>
                <div><Lang word={"Bet Type"}/></div>
                <div><Lang word={"Stake"}/></div>
                <div><Lang word={"Odds"}/></div>
                <div><Lang word={"Win"}/></div>
                <div><Lang word={"Status"}/></div>
              </div>
              {
                loadingHistory ?
                  <BetHistoryLoader />
                  :
                  bets.length ?
                    bets.map((bet, i) => {
                      var selections = [], b = { totalAmount: 0 }
                      b.totalAmount = (bet.bonus_bet_amount ? bet.bonus_bet_amount : "" + bet.amount ? bet.amount : "").toString()
                      Object.keys(bet.events).forEach((evt) => {
                        selections.push(bet.events[evt])
                      })
                      return (
                        <div key={bet.id}>
                          <div className="bet-details" onClick={() => { this.openSelection(bet.id) }}>
                            <div className="more" ><span className={`icon-more icon-icon-arrow-down icon ${this.state.openedBet === bet.id ? 'open icon-up' : 'close'}`}></span></div>
                            <div className="date">{moment(bet.date_time).format('ddd, D MMM YYYY')}</div>
                            <div className="id">{bet.id}</div>
                            <div className={`type cms-jcon-${this.betType[bet.type].toLowerCase()}`}><span style={{ paddingLeft: '5px' }}>{this.betType[bet.type]}</span></div>
                            <div className="stake">{bet.amount}  {profile.currency}</div>
                            <div className="odds">{bet.k}</div>
                            <div className="win">{bet.payout > 0 ? bet.payout : bet.status === 0 ? <span><span style={{ display: 'block', lineHeight: '2' }}><Lang word={"Possible Win"}/>: </span><span style={{ display: 'block', lineHeight: '1' }}>{bet.possible_win}  {profile.currency}</span></span> : null}</div>
                            <div className={`state ${bet.status === 4 || bet.status === 5 ? 'icon-sb-success' : bet.status === 3 ? 'icon-sb-error-pu' : bet.status === 1 ? 'icon-sb-unsettled' : bet.status === 0 ? 'icon-sb-unsettled' : bet.status === 2 ? 'icon-sb-returned' : ''}`}
                              style={{ lineHeight: bet.hasOwnProperty('cash_out') ? '2' : '' }}><span style={{ paddingLeft: '5px' }}>{Lang(this.betState[bet.status])}</span>{bet.hasOwnProperty('cash_out') ?
                                <span onClick={(e) => { e.stopPropagation(); this.attemptCashout(bet) }} className="cashout" style={{ display: 'block', paddingLeft: '5px', width: 'auto', lineHeight: '1', marginRight: '5px' }} title={'cashout ' + bet.cash_out}><span style={{ lineHeight: '0', paddingLeft: '5px' }}>{bet.cash_out} {profile.currency}</span> </span> : null}</div>
  
                          </div>
                          <div className={`bet-selection ${this.state.openedBet === bet.id ? 'open' : ''}`}>
                            <div className="table-header">
                              <div><Lang word={"Start Time"}/></div>
                              <div><Lang word={"Match"}/></div>
                              <div><Lang word={"Selection"}/></div>
                              <div><Lang word={"Odds"}/></div>
                              <div><Lang word={"status"}/></div>
  
                            </div>
                            {
                              selections.map((event, i) => {
                                return (
                                  <div className="bet" key={i}>
                                    <div className="date">{moment.unix(event.MatchStartDate).format('ddd, D MMM YYYY H:mm')}</div>
                                    <div className={`match sport-avatar ${event.SportName}`} title={event.SportName + ' ' + event.RegionName + ' ' + event.competitionName + ' ' + event.MatchName}>{event.MatchName}</div>
                                    <div className="market">{event.MarketName} - {event.SelectionName}</div>
                                    <div className="odds">{event.Price}</div>
                                    <div className={`status ${event.Status === 4 || event.Status === 5 ? 'icon-sb-checkmark2' : event.Status === 3 ? 'icon-sb-close_mark' : event.Status === 0 ? 'icon-sb-unsettled' : event.Status === 2 ? 'icon-sb-returned' : ''}`}>
                                      <span style={{ paddingLeft: '5px' }}>{this.betState[event.Status]}</span>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    }) :
                    <div className="empty-content"><span><Lang word={"There are no bets for the selected time period."}/></span></div>
              }
            </div>
          </div>

      )
    }
  }