import React, { PureComponent } from 'react'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import  moment from 'moment'
import {BetHistoryLoader} from '../../components/loader'
import {onSelect, getCookie, makeToast} from '../../common'
import API from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
import Lang from '../../containers/Lang'
import { translate } from '../Lang'
const $api = API.getInstance()
export default class Transactions extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        openedBet: null,
        reloadHistory:false,
        nomoredata:false,
        cashingOut: null,
        outcome: '-1',
        bet_type: 'ALL',
        bet_id: '',
        period: 24,
        periodType: 1,
        datepickerF: moment().startOf('month'),
        datepickerT: moment().endOf('month'),
        balanceHistory:[]
        ,currentPage:1,
        uid: getCookie('id'),
        AuthToken: getCookie('AuthToken'),
        phoneNumber: this.props.profile.mobilenumber
      }
      this.searchTransactionHistory = this.searchTransactionHistory.bind(this)
      this.getBetHistory = this.getBetHistory.bind(this)
      this.onDateChangeF = this.onDateChangeF.bind(this)
      this.onDateChangeT = this.onDateChangeT.bind(this)
      moment.locale(this.props.appState.lang.substr(0,2))
    }
    componentDidMount() {
      const {datepickerF,datepickerT} = this.state
      $("#datepickerFH").datepicker({ maxDate: '0', onSelect: function () { onSelect('datepickerFH') },changeMonth: true,
      changeYear: true });
      $("#datepickerTH").datepicker({ maxDate: '0', onSelect: function () { onSelect('datepickerTH') },changeMonth: true,
      changeYear: true });
      $("#datepickerFH").datepicker("option", "dateFormat", "yy/mm/dd");
      $("#datepickerTH").datepicker("option", "dateFormat", "yy/mm/dd");
      $("#datepickerFH").datepicker("setDate", new Date(datepickerF));
      $("#datepickerTH").datepicker("setDate", new Date(datepickerT));
      this.getBetHistory()
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
    reloadHistory() {
      this.setState({ reloadHistory: !0 ,loadingHistory:!0})
    }
    attemptCashout(bet = null) {
      this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
    }
    getBetHistory(where = {},more=false) {
      this.setState({ reloadHistory: !0 ,loadingHistory:!0 })
      const {phoneNumber,uid,AuthToken}= this.state,$time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash =calcMD5(`AuthToken${AuthToken}uid${uid}mobile${phoneNumber}time${$time}${this.props.appState.$publicKey}`)
      let p = {mobile:phoneNumber,uid:uid,AuthToken:AuthToken,uid:uid,time:$time,hash:$hash}
      p= {...p,...where}
      $api.getUserBalanceHistory(p,(data)=>this.onSuccess(data,more))
      
    }
    onSuccess({data},more){
      let state = {reloadHistory: !1 ,loadingHistory:!1,data}
      if(data && data.status===200){const b = this.state.balanceHistory.slice(0);state.balanceHistory=more ?[...b,...data.data]:data.data; more && data.data.length===0 && (state.nomoredata=!0)}
      else makeToast(data.msg,5000)
      this.setState(state)
      
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
    searchTransactionHistory(more=false) {
      const { datepickerF, datepickerT,currentPage, bet_id, bet_type, } = this.state;
      let p = { startDate:datepickerF===''?datepickerT!==''? moment(datepickerT).subtract(1, 'days').startOf('day').format('YYYY-MM-DD'):moment().startOf('month').format('YYYY-MM-DD'): moment(datepickerF).startOf('day').format('YYYY-MM-DD'), endDate: datepickerT===''?datepickerF!==''? moment(datepickerF).add(1, 'days').endOf('day').format('YYYY-MM-DD'):moment().endOf('month').format('YYYY-MM-DD'):moment(datepickerT).endOf('day').format('YYYY-MM-DD') };
      if (null !== bet_id && bet_id.length > 0) p.paycode = bet_id;
      if (bet_type !== '-1') p.type = bet_type;
      if (more) {p.page = currentPage+1;this.setState({currentPage:currentPage+1});}
      else this.setState({nomoredata:!1,currentPage:1})
      this.getBetHistory(p,more);
    }
    loadMore(){
      this.searchTransactionHistory(true)
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
      this.setState({datepickerF:null,datepickerT:null, periodType: 1, period: a })
    }
    clearDateRange(id){
      $("#"+id).datepicker('setDate', null);
        id = id.substr(0, id.length-1)
        var obj={periodType: 1} 
       obj[id]='' 
       this.setState(obj)
    }
    render() {
      const {loadingHistory, bet_type, bet_id, datepickerF,datepickerT,balanceHistory,nomoredata }= this.state,{ onClose}= this.props
      
      return (

          <div className="section-content col-sm-9">
             
            <div className="filter">
              <div className="header"><div className="title" style={{ padding: '15px' }}><Lang word={"My Transaction History"}/></div><div onClick={() => { onClose() }} className="close uci-close"></div></div>
              <div className="filter-input-container">
                <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                  <span><Lang word={"Transaction ID"}/></span>
                  <div className="sportsbook-input-value" style={{ padding: '0' }}>
                    <div className="sportsbook-search-input static">
                      <input autoComplete="off" placeholder="#" style={{ textAlign: 'unset', height: '36px' }} className="search-input ember-text-field ember-view" value={bet_id} onChange={(e) => { this.setBetID(e) }} ref={(el) => this.partialInput = el} />
                    </div>
                  </div>
                </div>
                <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                  <span><Lang word={"Transaction Type"}/></span>
                  <select name="betType" value={bet_type} onChange={(e) => { this.setBetType(e) }}>
                    <option value="ALL">{translate(this.props.appState.lang,"All")}</option>
                    <option value="0">{translate(this.props.appState.lang,"Deposit")}</option>
                    <option value="1">{translate(this.props.appState.lang,"Withdrawal")}</option>
                    <option value="2">{translate(this.props.appState.lang,"Winnings")}</option>
                    <option value="3">{translate(this.props.appState.lang,"Activity")}</option>
                    <option value="4">{translate(this.props.appState.lang,"Bets")}</option>
                    <option value="5">{translate(this.props.appState.lang,"Rolled Back Bets")}</option>
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
                  <button className="search" onClick={() => { this.searchTransactionHistory() }}><span><Lang word={"Search"}/></span></button>
                </div>
              </div>
  
            </div>
  
            <div className="data" style={{ marginTop: '0' }}>
              <div className="bet-details table-header">
                <div><Lang word={"Date"}/></div>
                <div><Lang word={"Trans. ID"}/></div>
                <div><Lang word={"Amount"}/></div>
                <div><Lang word={"Trans Type"}/></div>
                <div><Lang word={"Status"}/></div>
              </div>
              {
                loadingHistory ?
                  <BetHistoryLoader />
                  :
                  balanceHistory.length ?
                
                   balanceHistory.map((history, i) => {
                      return (
                        <div key={history.id}>
                          <div className="bet-details">
                            <div className="date">{moment(history.date).format('ddd, D MMM YYYY')}</div>
                            <div className="id">{history.type==='Withdraw' || history.type==='Deposit'?history.paycode:history.id}</div>
                            <div className="stake">{history.amount}  {this.props.profile.currency}</div>
                            <div className={`type cms-jcon-${history.type}`}><span style={{ paddingLeft: '5px' }}>{history.type}</span></div>
                            <div className={`state`}><span style={{ paddingLeft: '5px' }}>{Lang(history.status)}</span></div>
  
                          </div>
                        </div>
                      )
                    })
                   
                  :
                    <div className="empty-content"><span><Lang word={"There are no trasactions for the selected time period"}/>.</span></div>
              }
            </div>
            <div className="load-more" style={{display:(balanceHistory.length <10 || nomoredata)&& 'none',marginTop:10}}>
                <div style={{margin:' 0 auto'}} onClick={this.loadMore.bind(this)}><Lang word={"Show More"}/></div>
            </div>
          </div>

      )
    }
  }