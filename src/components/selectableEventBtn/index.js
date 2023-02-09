import React, { PureComponent } from 'react'
import {oddConvert,stringReplacer} from '../../common'
export default class SelectableEventBtn extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false
    }
    this.priceBtn = null;
    this.timeoutId = null
    this.eventData = { price: null, initialPrice: null } 
    this.addEvent =this.addEvent.bind(this)
    this.eventClasses= {1:'col-sm-4',2:'col-sm-6',3:'col-sm-4'}
  }

  componentDidUpdate() {
    if (this.eventData.price !== this.props.data.price &&
      this.eventData.initialPrice !== this.props.data.initialPrice) {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(function () {
        if (undefined !== this.priceBtn && null !== this.priceBtn) {
          this.priceBtn.classList.remove('coeficiente-change-up');
          this.priceBtn.classList.remove('coeficiente-change-down');
        }
      }.bind(this), 10000);
      this.eventData.price = this.props.data.price
      this.eventData.initialPrice = this.props.data.initialPrice
    }
  }
componentWillUnmount(){
  clearTimeout(this.timeoutId)
}
 addEvent(sport,region,competition,e,game,market,data){
  e.stopPropagation()
  if(!game.is_blocked) this.props.addEventToSelection(sport,region,competition,game, market, data)
 }
  render() {
    const {
      props: { sport,region,competition,data, eventLen,showType,
        event_col, market, game, betSelections, oddType }
    } = this
    return (
      <div ref={(el) => { this.priceBtn = el }}
        title={`${stringReplacer(data.name === 'Nul'? data.type: data.name, [/Team 1/gi, /Team 2/gi, /W1/gi, /W2/gi,/P1/gi,/P2/gi], [game.team1_name, game.team2_name, game.team1_name, game.team2_name])} ${data.hasOwnProperty('base') ? `(${data.base})` : ''}`}
        onClick={(e) => this.addEvent(sport,region,competition,e,game,market,data)} {...{ className: `${data&& eventLen>2 && data.name?data.name.toLowerCase():''} ${betSelections[market.id] && betSelections[market.id].eventId == data.id ? 'selected-event' : ''} single-event ${data.initialPrice ? (data.initialPrice > data.price) ? 'coeficiente-change-down' : (data.initialPrice < data.price) ? 'coeficiente-change-up' : '' : ''} ${game.is_blocked && 'blocked'} ${event_col !== void 0 &&eventLen > event_col ?'col-sm-6':event_col !== void 0 ? this.eventClasses[event_col] :showType==='home'? data.type==='X'?'col-sm-2': 'col-sm-5':'col-sm-12'}` }}>
        <span className="event-name col-sm-9" data-title={`${stringReplacer(data.name === 'Nul'? data.type: data.name, [/Team 1/gi, /Team 2/gi, /W1/gi, /W2/gi,/Draw/gi,,/P1/gi,/P2/gi], [game.team1_name, game.team2_name, game.team1_name, game.team2_name,'X', game.team1_name, game.team2_name])} ${data.hasOwnProperty('base') ? `(${data.base})` : ''}`}></span>
        <span className={`event-price col-sm-3`} style={{display:'flex',position:'relative',justifyContent:'flex-end'}}>{oddConvert({
          main: {
            decimalFormatRemove3Digit: 0,
            notLockedOddMinValue: null,
            roundDecimalCoefficients: 3,
            showCustomNameForFractionalFormat: null,
            specialOddFormat: null,
            useLadderForFractionalFormat: 0
          }, env: { oddFormat: null }
        }, { mathCuttingFunction: () => { } })(data.price, oddType)} <i className="blocked-icon" style={{ display: game.is_blocked ? 'block' : 'none' }}></i></span>
        
      </div>
    )
  }
}