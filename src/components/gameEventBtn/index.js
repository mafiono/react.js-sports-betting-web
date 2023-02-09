import React, { PureComponent } from 'react'
import {oddConvert} from '../../common'
export default class GameEventBtn extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
  
      }
      this.timeoutId = null
      this.priceBtn = null
      this.eventData = { price: null, initialPrice: null }
    }
    componentDidMount() {
      if (this.eventData.price !== this.props.evnt.price &&
        this.eventData.initialPrice !== this.props.evnt.initialPrice) {
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(function () {
          if (undefined !== this.priceBtn && null !== this.priceBtn) {
            this.priceBtn.classList.remove('coeficiente-change-up');
            this.priceBtn.classList.remove('coeficiente-change-down');
          }
        }.bind(this), 10000);
        this.eventData.price = this.props.evnt.price
        this.eventData.initialPrice = this.props.evnt.initialPrice
      }
    }
    selectEvent(is_blocked,sport,region,competition,game, evtmarket, evnt){
      console.log(sport,region)
      if(!is_blocked)
      this.props.addEventToSelection(sport,region,competition,game, evtmarket, evnt)
    }
    componentDidUpdate() {
      if (this.eventData.price !== this.props.evnt.price &&
        this.eventData.initialPrice !== this.props.evnt.initialPrice) {
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(function () {
          if (undefined !== this.priceBtn && null !== this.priceBtn) {
            this.priceBtn.classList.remove('coeficiente-change-up');
            this.priceBtn.classList.remove('coeficiente-change-down');
          }
        }.bind(this), 10000);
        this.eventData.price = this.props.evnt.price
        this.eventData.initialPrice = this.props.evnt.initialPrice
      }
    }
    componentWillUnmount(){
      clearTimeout(this.timeoutId)
     }
    render() {
      const {
        props: {sport,region,competition, evnt, game, evtmarket, betSelections, oddType ,size}
      } = this
      return (
        <div ref={(el) => { this.priceBtn = el }} onClick={(e) =>  {e.stopPropagation();this.selectEvent(game.is_blocked,{id:sport.id,alias:sport.alias},{id:region.id,name:region.name,alias:region.alias},competition,game, evtmarket, evnt)}  } className={`${size? size:''} ${evnt.name.toLowerCase()} ${betSelections[evtmarket.id] && betSelections[evtmarket.id].eventId == evnt.id ? 'selected-event' : ''} ${evnt.initialPrice ? (evnt.initialPrice > evnt.price) ? 'coeficiente-change-down' : (evnt.initialPrice < evnt.price) ? 'coeficiente-change-up' : '' : ''}`}>
          <span className={`price`} data-event={evnt.id}>{oddConvert({
            main: {
              decimalFormatRemove3Digit: 0,
              notLockedOddMinValue: null,
              roundDecimalCoefficients: 3,
              showCustomNameForFractionalFormat: null,
              specialOddFormat: null,
              useLadderForFractionalFormat: 0
            }, env: { oddFormat: null }
          }, { mathCuttingFunction: () => { } })(evnt.price, oddType)}</span>
          <i className="blocked-icon" style={{ display: game.is_blocked ? 'unset' : 'none' }}></i>
        </div>
      )
    }
  }