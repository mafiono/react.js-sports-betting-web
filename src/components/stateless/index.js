import React,{PureComponent} from 'react'
import {stringReplacer} from '../../common'
import Lang from '../../containers/Lang'
export const CheckBox = (props) => {
    return (
      <label className="container">{props.text}
        <input type="checkbox" checked={props.checked} onChange={(e) => { props.onChange(e, props.id) }} />
        <span className="checkmark"></span>
      </label>
    )
  }
export class PagingDotsCustom extends PureComponent{

  getIndexes(count, inc) {
    const arr = [];
    for (let i = 0; i < count; i += inc) {
      arr.push(i);
    }
    return arr;
  }
  render(){

    const styles = {
      listStyles: {
        position: 'relative',
        margin: 0,
        top: -10,
        display: "inline-block",
        padding: "5px",
        backgroundColor: "rgba(0,0,0,.2)",
        borderRadius:"10px",
        WebkitTransitionDuration: ".3s",
        transitionDuration: ".3s",
      },
      listItemStyles: {
        display: "inline-block",
        width: "10px",
        height: "10px",
        margin: "0 3px",
        fontSize: "14px",
        backgroundColor: "#e2e2e2",
        borderRadius: "50%",
        cursor: "pointer",
        WebkitTransitionDuration: ".3s",
        transitionDuration: ".3s"
      }
    },{props}=this,custom={listStyles:{},listItemStyles:{}}
    if(props.style){
      Object.keys(props.style).forEach((key)=>{
        custom[key] = props.style[key]
      })
    }
    return(
  <ul style={{...styles.listStyles,...custom.listStyles}}>
    {this.getIndexes(props.slideCount, props.slidesToScroll).map(index => {
      return (
        <li style={{...styles.listItemStyles,...custom.listItemStyles,backgroundColor:props.currentSlide === index ? "#fff" : "rgba(255,255,255,.5)"}} key={index} onClick={props.goToSlide.bind(null, index)}>
        </li>
      );
    })}
  </ul>
    )
  }
}
export  class PreviousSlide extends PureComponent{
  render(){
    return(
      <button className="carousel-arrow left icon-icon-left" onClick={this.props.previousSlide}></button>
    )
  }
}
export class NextSlide extends PureComponent{
  render(){
    return(
      <button className="carousel-arrow right icon-icon-right" onClick={this.props.nextSlide} ></button>
    )
  }
}
export const BetSlipNotification = (props) => {
  return (
    <div className={`betslip-notification-message-container ${props.canNotify? 'notify-show':'notify-hide'}`} style={{...props.style}}>
      <div className={`betslip-notification-message ${props.type}`}>
        <div className="icon">
          <i className={`left-icon icon-sb-${props.type}`}></i>
        </div>
        <div className="message-wrapper">
        </div>
        <div className="open" onClick={() => { props.onOpen()}}>
          <i className="uci-open"></i>
        </div>
      </div>
    </div>
  )
}
export const SportItem = (props)=>{
  const [hover,setHover] = React.useState(false)
  return(
    <div onClick={()=>props.onClick(props.s.id)} className={`sport ${stringReplacer(props.s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()} ${props.activeID === props.s.id || hover || (null === props.activeID && props.i === 0) ? 'active' : ''}`} onMouseEnter={() => setHover(!hover)} onMouseLeave={() => setHover(!hover)}>
      <div className="sport-background top"></div>
      <div className={`sport-avatar ${stringReplacer(props.s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}`}></div>
      {props.activeID === props.s.id || hover || (null === props.activeID && props.i === 0) ? <span className="sport-name">{props.s.name}</span> : null}
    </div>
  )
}
export const OddsSettings = (props) => {
  return (
    <div className="odd-settings">
      <div className="odd-settings-title">
        {props.title}
      </div>

      <div className="sb-radio-group">
        {props.custom ?
          <label>
            <input name="odds" checked={props.value === 2} type="radio" value="2" onChange={(e) => { props.onChange(e) }} />
            <i className="radio-on icon-icon-radio-button"></i>
            <i className="radio-off icon-icon-radio-button-empty"></i>
            <span>Accept odd change </span>
          </label>
          :
          props.customInput? 
          props.customInput.map((input,id)=>{
            return(
              <label key={id}>
                <input name="odds" checked={props.value.id === input.id} type="radio" value={id} onChange={(e) => { props.onChange(e) }} />
                <i className="radio-on icon-icon-radio-button"></i>
                <i className="radio-off icon-icon-radio-button-empty"></i>
                <span>{input.amount}</span>
              </label>
            )
          })
        :
          <React.Fragment>
            <label>
              <input name="odds" checked={props.value === 1} type="radio" value="1" onChange={(e) => { props.onChange(e) }} />
              <i className="radio-on icon-icon-radio-button"></i>
              <i className="radio-off icon-icon-radio-button-empty"></i>
              <span>Accept higher odds</span>
            </label>
            <label>
              <input name="odds" checked={props.value === 2} type="radio" value="2" onChange={(e) => { props.onChange(e) }} />
              <i className="radio-on icon-icon-radio-button"></i>
              <i className="radio-off icon-icon-radio-button-empty"></i>
              <span>Accept any odds </span>
            </label>
            <label>
              <input name="odds" checked={props.value === 0} type="radio" value="0" onChange={(e) => { props.onChange(e) }} />
              <i className="radio-on icon-icon-radio-button"></i>
              <i className="radio-off icon-icon-radio-button-empty"></i>
              <span>Always ask</span>
            </label>
          </React.Fragment>
        }
      </div>
    </div>
  )
}
export const OddsType = (props) => {
  return (
    <div className="odd-types">
      <div className="ember-view">
        <div className="ember-view">
          <select className="odds-type-changer" onChange={(e) => { props.onChange(e) }} value={props.value}>
            <option value="decimal">
              Decimal
    </option>
            <option value="fractional">
              Fractional
    </option>
            <option value="american">
              American
    </option>
            <option value="hongkong">
              Hongkong
    </option>
            <option value="malay">
              Malay
    </option>
            <option value="indo">
              Indo
    </option>
          </select>
        </div>
      </div>
    </div>
  )
}