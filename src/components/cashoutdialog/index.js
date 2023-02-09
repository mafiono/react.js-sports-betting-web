import React, { PureComponent } from 'react'
import {Loader} from '../../components/loader'
import moment from 'moment'
import 'moment/locale/fr'
export default class CashoutDialog extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        isFullCashout: true,
        isPartialCashout: false,
        cashoutMode: 1,
        balanceFractionSize: 2,
        sliderVal: 0,
        inputValue: '',
        cashoutInProgress: false,
        cashOutRuleLoading: false,
        valueError: false,
        ErrorMSG: '',
        cashOutRule: { valueReaches: '', partial_amount: null },
        dialogSettings: { type: 'cashout', cashoutDialogType: 'manual', auto: 'full', new_price: null, partial_amount: 0, valueReaches: '', incaseAmountChange: 0 }
      }
      this.minLCashoutValue = parseFloat(this.props.config.min_bet_stakes && this.props.config.min_bet_stakes[this.props.config.currency]) || 0.1
      this.k = [1, 0.1, 0.01]
      this.onCashoutModeChange = this.onCashoutModeChange.bind(this)
      this.onCashoutdDialogTypeChange = this.onCashoutdDialogTypeChange.bind(this)
      this.onCashoutTypeChange = this.onCashoutTypeChange.bind(this)
      this.attemptCashOutRule = this.attemptCashOutRule.bind(this)
      this.getCashOutRule = this.getCashOutRule.bind(this)
      this.attemptCashOut = this.attemptCashOut.bind(this)
      this.cancelCashOutRule = this.cancelCashOutRule.bind(this)
      this.cashoutRuleCallback = this.cashoutRuleCallback.bind(this)
      this.cancelCashoutRuleCallback = this.cancelCashoutRuleCallback.bind(this)
      this.getCashoutRuleCallback = this.getCashoutRuleCallback.bind(this)
      this.doCashoutCallback = this.doCashoutCallback.bind(this)
      this.setValueReaches = this.setValueReaches.bind(this)
      this.setPartialVal = this.setPartialVal.bind(this)
    }
    componentDidMount() {
      this.getCashOutRule()
    }
    componentDidUpdate() {
  
    }
    onCashoutModeChange(e) {
      e.persist()
      this.setState(prevState => ({ dialogSettings: { ...prevState.dialogSettings, incaseAmountChange: parseInt(e.target.value, 10) } }))
      this.props.onUserInteraction()
    }
    onCashoutdDialogTypeChange(e) {
      // e.value==='auto' && this.getCashOutRule();
      this.setState(prevState => ({inputValue:'', dialogSettings: { ...prevState.dialogSettings, cashoutDialogType: e.value, auto: 'full', partial_amount: '', valueReaches: '' } }))
    }
    onCashoutTypeChange(e) {
      e.persist()
      this.setState(prevState => ({ dialogSettings: { ...prevState.dialogSettings, auto: e.target.value } }))
    }
    onClose() {
  
    }
    setValueReaches(e) {
      e.persist()
      const {dialogSettings}= this.state, {cashable_bet} = this.props
      let states = {}, a = parseFloat(parseFloat(e.target.value).toPrecision(12)), min = dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out, max = (parseFloat(parseFloat(cashable_bet.possible_win).toPrecision(12)) - parseFloat(parseFloat(this.k[2]).toPrecision(12))).toFixed(2);
  
      if(a > max || a < parseFloat(parseFloat(min).toPrecision(12)) ){ 
        states.valueError = !0; states.ErrorMSG = 'The specified amount is out of the acceptable range.'} else{ states.valueError = !1; states.ErrorMSG = ''}
        this.setState(prevState => ({ ...states, dialogSettings: { ...prevState.dialogSettings, valueReaches: a } }))
    }
    cashoutRuleCallback(c) {
      c = c.data;
      let g = { cashoutRule: {} };
     if( 0 === c.result ){g.cashoutRule.created = !0; g.cashoutRule.canceled = !1; g.cashoutRule.error = !1; g.cashoutRule.cashoutSuccess = !0} 
     else 
     {
       g.cashoutRule.error = !0; 
       g.cashoutRule.created = !1; 
       g.cashoutRule.canceled = !0; 
       g.cashoutRule.cashoutSuccess = !1; 
       g.cashoutRule.message = c.details
      }
      this.setState(prevState => ({ cashoutInProgress: !1, cashOutRule: { ...prevState.cashOutRule, ...g.cashoutRule }, dialogSettings: { ...prevState.dialogSettings, type: "confirm" } }))
    }
    cancelCashoutRuleCallback(c) {
      c = c.data;
      let g = { cashoutDialog: {}, cashoutRule: {} };
      g.cashoutDialog.type = "confirm";
      if(0 === c.result)  
      {
        g.cashoutRule.canceled = !0; g.cashoutRule.error = !1; g.cashoutRule.created = !1; g.cashoutRule.cashoutSuccess = !0
      } 
      else {
        g.cashoutRule.error = !0; g.cashoutRule.created = !1; g.cashoutRule.canceled = !1; g.cashoutRule.cashoutSuccess = !1; g.cashoutRule.message = c.details}
      g.cashoutInProgress = !1
      this.setState(prevState => ({ cashoutInProgress: g.cashoutInProgress, dialogSettings: { ...prevState.dialogSettings, ...g.cashoutDialog }, cashOutRule: { ...prevState.cashOutRule, ...g.cashoutRule } }))
    }
    getCashoutRuleCallback(a) {
      a = a.data
      this.setState({ cashOutRuleLoading: false })
      let g = { cashOutRule: {} }
      if(0 === a.result) {
        g.cashOutRule.valueReaches = a.details.MinAmount; g.cashOutRule.partial_amount = a.details.PartialAmount; this.setState(g)
      }
  
    }
    doCashoutCallback(k, callback) {
      k = k.data
      let g = { cashoutDialog: {}, cashOutRule: {} }
      if ("Ok" === k.result) {
        if (typeof (callback) === 'function') {
          // callback()
        }
        g.cashoutDialog.type = "confirm";
        g.cashOutRule.cashoutSuccess = !0;
      } else 
      {
        if("Fail" === k.result && k.details && k.details.new_price) {
          g.cashoutDialog.type = "cashout"; g.cashoutDialog = k.details; g.cashoutDialog.priceChanged = !0} 
          else{ 
          if("NotAvailable" === k.result || "Fail" === k.result) {
            g.cashoutDialog.type = "confirm"; g.cashOutRule.cashoutSuccess = !1; g.cashOutRule.manualError = !0
          }
          else
             {
               g.cashoutDialog.type = "confirm"; g.cashOutRule.cashoutSuccess = !1; g.cashOutRule.manualError = !0; g.cashOutRule.unknownError = !0
              }}
            }
      this.setState(prevState => ({ cashoutInProgress: !1, cashOutRule: { ...prevState.cashOutRule, ...g.cashOutRule }, dialogSettings: { ...prevState.dialogSettings, ...g.cashoutDialog } }))
      callback()
    }
    attemptCashOutRule() {
      this.setState({ cashoutInProgress: !0 })
      this.props.onSetAutoCashout({ ...this.state.dialogSettings, id: this.props.cashable_bet.id }, this.cashoutRuleCallback)
    }
    getCashOutRule() {
      this.setState({ cashOutRuleLoading: !0 })
      this.props.onGetCashoutRule({ ...this.state.dialogSettings, id: this.props.cashable_bet.id }, this.getCashoutRuleCallback)
    }
    attemptCashOut() {
      this.setState({ cashoutInProgress: !0 })
      this.props.onCashout({ ...this.state.dialogSettings, id: this.props.cashable_bet.id, cash_out: this.state.dialogSettings.priceChanged ? this.state.dialogSettings.new_price : this.props.cashable_bet.cash_out }, this.doCashoutCallback)
    }
    cancelCashOutRule() {
      this.setState({ cashoutInProgress: !0 })
      this.props.onCancelRule({ ...this.state.dialogSettings, id: this.props.cashable_bet.id }, this.cancelCashoutRuleCallback)
    }
    cancelValues() {
      this.setState({ inputValue: null, sliderVal: 0, dialogSettings: { cashoutDialogType: 'manual', auto: 'full', partial_amount: '', valueReaches: 0 } })
    }
    setPartialVal(e) {
      e.persist()
      var a = e.target.value, c = this.state.dialogSettings.priceChanged ? this.state.dialogSettings.new_price : this.props.cashable_bet.cash_out, d = 0.01 * c * a;
      if (c) {
        d = 100 <= c || 0 === this.state.balanceFractionSize ? Math.round(d) : 10 <= c ? Math.round(10 * d) / 10 : Math.round(100 * d) / 100;
        d = 0 === this.state.balanceFractionSize && 1 > d ? 1 : d;
        // parseFloat(this.props.config.min_bet_stakes &&this.props.config.min_bet_stakes[this.props.config.currency]) || 0.1 > c - d && (g.newCashoutData.price = c);
        // g.cashoutPopup.inputValue = d;
        // g.newCashoutData.partial_price = d
        // (dialogSettings.partial_amount/5*100)<=100?dialogSettings.partial_amount/5*100 :100
        // this.partialInput.value = d
        let states = {};
        if(d > c) {
          states.valueError = !0; states.ErrorMSG = 'Please enter a valid Cash-out amount.' }else{ states.valueError = !1; states.ErrorMSG = ''}
        this.setState(prevState => ({ ...states, sliderVal: (d / c) * 100, inputValue: d, dialogSettings: { ...prevState.dialogSettings, partial_amount: d } }))
      }
    }
    render() {
      const { props: {
        config,
        cashable_bet,
        onAttemptCashout},
        state: { dialogSettings, sliderVal, inputValue, cashOutRule, cashoutInProgress,
          cashOutRuleLoading,
          valueError,
          ErrorMSG }
      } = this
      return (
        <div className="cahout-dialog-backdrop" style={{opacity:'1',pointerEvents:'all'}}>
          <div className="cashout-dialog-content">
            <div className="header">
              <div className="title">Cash-Out <div className="popup-info-tooltip" style={{ marginLeft: '20px' }}><i className="icon-icon-info"></i>
                <div className="popup-info-tooltip-content"><ul className="cashout-id-wrapper"><li><p>{cashable_bet.id}</p></li><li><span>{moment.unix(cashable_bet.date_time).format('ddd, D MMM YYYY')}</span></li></ul></div>
              </div></div>
              <div className="exit"><div onClick={() => { onAttemptCashout() }} className="close uci-close"></div></div>
            </div>
            <div className={`content-body ${cashoutInProgress ? 'cashingout' : ''}`}>
              {
                dialogSettings.type === 'cashout' && !cashoutInProgress ?
                  !cashOutRule.valueReaches ?
                    <React.Fragment>
                      <div className="mode-tabs">
                        <div className={`${dialogSettings.cashoutDialogType == 'manual' ? 'active' : ''}`} onClick={() => dialogSettings.cashoutDialogType !== 'manual' ? this.onCashoutdDialogTypeChange({ value: 'manual' }) : null }>Manual</div>
                        <div className={`${dialogSettings.cashoutDialogType == 'auto' ? 'active' : ''}`} onClick={() =>  dialogSettings.cashoutDialogType !== 'auto' ? this.onCashoutdDialogTypeChange({ value: 'auto' }) : null }> <div className="settings-icon-container icon" >
                          <span className="icon-icon-settings"></span>
                        </div> <span>Auto</span></div>
                      </div>
                      <div className="mode-content">
                        <div className="question">If Cash-out {dialogSettings.cashoutDialogType === "manual" ? ' amount changes !' : ' value reaches !'}</div>
                        {dialogSettings.cashoutDialogType === "manual" ?
                          <div className="odd-types" style={{ position: 'relative' }}>
                            <div className="ember-view">
                              <div className="ember-view">
                                <div className="settings-icon-container icon" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                  <span className="icon-icon-settings"></span>
                                </div>
                                <select style={{ paddingLeft: '30px' }} className="odds-type-changer" onChange={this.onCashoutModeChange} value={dialogSettings.incaseAmountChange}>
                                  <option value="0">
                                    Always Ask
                                </option>
                                  <option value="1">
                                    Accept Higher Amount
                                </option>
                                  <option value="2">
                                    Accept any amount changes
                                </option>
                                </select>
                              </div>
                            </div>
                          </div> :
                          <div className="value-reaches">
                            <div className="sportsbook-input-value">
                              <div className="sportsbook-search-input static">
                                <input placeholder="" className="search-input ember-text-field ember-view" type="number" value={dialogSettings.valueReaches} onChange={this.setValueReaches} ref={(el) => this.reachesInput = el} />
                              </div>
                            </div>
                            <div className="limits">
                              <span>{dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out}</span>
                              <span>{(cashable_bet.possible_win - this.k[2]).toFixed(2)}</span>
                            </div>
                          </div>
                        }
                        <div className="odd-settings">
                          <div className="sb-radio-group">
                            <div className="group">
                              <label>
                                <input name="odds" checked={dialogSettings.auto == 'full'} type="radio" value="full" onChange={this.onCashoutTypeChange} />
                                <i className="radio-on icon-icon-radio-button" style={{ fontSize: '20px' }}></i>
                                <i className="radio-off icon-icon-radio-button-empty" style={{ fontSize: '20px' }}></i>
                                <span style={{ fontSize: '13px', fontWeight: '600' }}>Full Cahsout</span>
  
                              </label>
                              {dialogSettings.cashoutDialogType === "manual" ?
                                <label style={{ paddingBottom: '5px', paddingLeft: '20px', fontWeight: '700', fontSize: '15px' }}>{dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out}  {this.props.profile.currency}</label>
                                : null}
                            </div>
                            <div className="group">
                              <label>
                                <input name="odds" checked={dialogSettings.auto == 'partial'} type="radio" value="partial" onChange={this.onCashoutTypeChange} />
                                <i className="radio-on icon-icon-radio-button" style={{ fontSize: '20px' }}></i>
                                <i className="radio-off icon-icon-radio-button-empty" style={{ fontSize: '20px' }}></i>
                                <span style={{ fontSize: '13px', fontWeight: '600' }}>Partial Cashout</span>
                              </label>
                              <div className="sportsbook-input-value">
                                <label style={{ paddingBottom: '5px' }}>Cash-out Amount</label>
                                <div className="sportsbook-search-input static">
                                  <input disabled={dialogSettings.auto !== 'partial'} placeholder="" className="search-input ember-text-field ember-view" type="text" value={inputValue} onChange={this.setPartialVal} ref={(el) => this.partialInput = el} />
                                </div>
                              </div>
                              {dialogSettings.cashoutDialogType === "manual" ?
                                <div className="limits" style={{ lineHeight: '1' }}>
                                  <span>0</span>
                                  <span>{dialogSettings.priceChanged ? dialogSettings.new_price : cashable_bet.cash_out}</span>
                                </div> : null}
                              {dialogSettings.cashoutDialogType === "manual" ?
                                <div className="cashout-range-input-wrapper">
                                  <small className="small" style={{ width: `${sliderVal}%` }}></small>
                                  <input className="slider" disabled={dialogSettings.auto !== 'partial'} type="range" min="0" max={100} step="0.01" value={inputValue} onChange={this.setPartialVal} ref={(el) => this.sliderInputRef = el} />
                                </div>
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="warning">
                        {dialogSettings.priceChanged || valueError ? <span>{dialogSettings.priceChanged ? 'Cash-out amount has changed' : ErrorMSG}</span> : null}
                      </div>
                      <div className="mode-actions">
                        <button disabled={valueError || (dialogSettings.cashoutDialogType == 'manual' && (dialogSettings.partial_amount == 0 || dialogSettings.partial_amount == null) && dialogSettings.auto == 'partial') || (dialogSettings.cashoutDialogType == 'auto' && dialogSettings.valueReaches == 0 && (dialogSettings.partial_amount == 0 || dialogSettings.partial_amount == null) && dialogSettings.auto == 'partial') || dialogSettings.cashoutDialogType == 'auto' && dialogSettings.valueReaches == 0 && dialogSettings.auto == 'full'} className="action"
                          onClick={() => { dialogSettings.cashoutDialogType === "manual" ? this.attemptCashOut() : this.attemptCashOutRule() }}>{dialogSettings.cashoutDialogType === "manual" ? 'cash-out' : 'Create Rule'}</button>
                        <button className="action" onClick={() => { this.cancelValues() }}>Cancel</button>
                      </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <div className="auto-cashout-rule">
                        {cashOutRuleLoading ?
                          <Loader />
                          :
                          <React.Fragment>
                            <h4 trans="">Rule active</h4>
                            <p>If the value reaches <span>{cashOutRule.valueReaches}</span> <b>{this.props.profile.currency}</b></p>
                            <p>Cash-out </p>
                          </React.Fragment>
                        }
                      </div>
                      <div className="mode-actions" style={{ display: 'block', padding: '10px 40px' }}>
                        <button className="action" onClick={() => { this.cancelCashOutRule() }} disabled={cashOutRuleLoading}>Cancel Rule</button>
                      </div>
                    </React.Fragment>
                  : dialogSettings.type === 'confirm' && !cashoutInProgress ?
                    <React.Fragment>
                      <div className={`pu-confirm icon-sb-${cashOutRule.cashoutSuccess ? 'success' : 'error'}-pu`}>
                        {
                          cashOutRule.unknownError ?
                            <p trans="">Error occurred.</p>
                            : null
                        }
                        <p trans="">{
                          cashOutRule.created && cashOutRule.cashoutSuccess ? 'Auto Cash-Out rule has been created.' :
                            cashOutRule.canceled && !cashOutRule.error && cashOutRule.cashoutSuccess ? 'Auto Cash-Out rule has been canceled.' :
                              (cashOutRule.canceled && cashOutRule.error) || (!cashOutRule.canceled && cashOutRule.error) ? cashOutRule.message :
                                cashOutRule.cashoutSuccess && !cashOutRule.cancled && !cashOutRule.created ? 'Cash-out completed.' :
                                  cashOutRule.manualError && !cashOutRule.cashoutSuccess ? 'Cash-out for selected bet is not available.' : ''}</p>
                      </div>
                      <div className="mode-actions" style={{ display: 'block', padding: '10px 40px' }}>
                        <button style={{ borderRadius: 'unset' }} className="action" onClick={() => { onAttemptCashout() }} disabled={cashOutRuleLoading}>OKAY</button>
                      </div>
                    </React.Fragment>
                    : cashoutInProgress ?
                      <Loader /> : null
              }
            </div>
          </div>
        </div>
      )
  
    }
  }