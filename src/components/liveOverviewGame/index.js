import React, { PureComponent } from 'react'
import SelectableEventBtn from '../selectableEventBtn'
import moment from 'moment' ;
import {convertSetName,stringReplacer} from '../../common'
export  default class LiveOverviewGame extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        activeMarket: 0
      };
      this.priceBtn = null;
      this.timeoutId = null;
      this.eventData = { price: null, initialPrice: null }
    }
    moreMatches(game, sport, region, competition){
      this.props.routerHistory.push(`/sports/live/${sport.alias}/${region.name}/${competition.id}/${game.id}`,{sport:sport.id,region:region.id,competition:competition.id,game:game.id})
    //  if( this.props.activeGame && this.props.activeGame.id !== game.id) 
    //   this.props.loadMarkets(game, sport, region, competition, 0) 
    //   else this.props.loadMarkets(game, sport, region, competition, 0)
    }
    setActiveMarket(marketType){
      if(this.customSelect)
        this.customSelect.blur()
      this.setState({ activeMarket: marketType }) 
    }

    render() {
      const {
        props: {loadMarkets, game, sport, region, competition, betSelections, addEventToSelection, setActiveGame, oddType },
        state: { opened, activeMarket }
      } = this
      let currentSet = convertSetName()(game.info ? game.info.current_game_state : '', stringReplacer(sport.alias, [/\s/g], ['']));
      let events = [], marketDataGrouping = {}, marketGroups = [], marketDataArr = [], defaultActiveMarket = null, marketSize = game.markets_count, eventSize = 0, eventMarket = null;
      if (marketSize > 0) {
        var found = false
        for (let data in game.market) {
          if (game.market[data]) {
            var name = game.market[data].name_template, groupID = game.market[data].type
  
            for (let index = 0; index < marketGroups.length; index++) {
              if (marketGroups[index].name == name) {
                found = true
                break
              }
            }
            if (!found) {
              marketGroups.push({ id: game.market[data].type, name: game.market[data].name_template })
              marketDataGrouping[name] = game.market[data]
            }
          }
        }
        Object.keys(marketDataGrouping).forEach((name, key) => {
          if (!events.length) {
            if (activeMarket != 0) {
              if (activeMarket.name == name) {
                Object.keys(marketDataGrouping[name].event).forEach((id) => {
                  if (null !== marketDataGrouping[name].event[id] && undefined !== marketDataGrouping[name].event[id]) {
                    {
                      if (Object.keys(marketDataGrouping[name].event).length > 3 && events.length <= 3)
                        events.push(marketDataGrouping[name].event[id])
                      else if (Object.keys(marketDataGrouping[name].event).length < 4)
                        events.push(marketDataGrouping[name].event[id])
                    }
                  }
                })
                eventMarket = marketDataGrouping[name]
                defaultActiveMarket = { name: marketDataGrouping[name].name_template, id: marketDataGrouping[name].type }
              }
            } else {
              Object.keys(marketDataGrouping[Object.keys(marketDataGrouping)[0]].event).forEach((id) => {
                if (null !== marketDataGrouping[name].event[id] && undefined !== marketDataGrouping[name].event[id]) {
                  {
                    // if (Object.keys(marketDataGrouping[name].event).length > 3 && events.length > 2) {
                    //   events.push(marketDataGrouping[name].event[id])
                    // }
                    // else if (Object.keys(marketDataGrouping[name].event).length < 4) {
                    events.push(marketDataGrouping[name].event[id])
                    // }
                  }
  
                }
              })
              eventMarket = marketDataGrouping[name]
              defaultActiveMarket = { name: marketDataGrouping[name].name_template, id: marketDataGrouping[name].type }
            }
          }
        })
      }
      events.sort((a, b) => {
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })
      events = events.slice(0, 3) 
 var matchLive = null  
 if(sport.id == 1 || sport.id == 3 || sport.id == 4 ) matchLive = <span onClick={(e) => { e.stopPropagation();setActiveGame(game, sport) }} className="icon-icon-match-live"></span> 
      return (
  
        <div title={game.team1_name + " - " + game.team2_name} id="" className={`sb-accordion-item match open overview`} >
          <div onClick={() => { this.moreMatches(game, sport, region, competition)}} className={`sb-accordion-title match-title ${(marketSize == 0 && events.length == 0) ? 'border-bottom' : ''}`}>
            <div className="match-title-text">
              <span>{game.team1_name}</span>
              {matchLive}
            </div>
            <div className="match-title-text match-title-text-x2">
              <span>{game.team2_name}</span>
              {game.is_stat_available ? <span className="icon-icon-statistics sb-match-statistic"></span> : null}
            </div>
            <div className="hidden-icons">
              <div className="match-time">
                <div className="match-time-info">
                  <span>{game.info ? game.info.score1 : ''} : {game.info ? game.info.score2 : ''} </span> <span>{game.info ? currentSet !== 'notstarted' ? currentSet : moment.unix(game.start_ts).format('D MMMM YYYY H:mm') : null} {game.info ? game.info.current_game_time : null}</span>
                </div>
                {/* <div  className="goal-alert-msg">Goal!!!</div> */}
              </div>
              <span className="add-to-favorite" data-balloon="Add to Favourites" data-balloon-pos="up" data-ember-action="" data-ember-action-224929="224929">
                <i className="icon-icon-star"></i>
              </span>
  
              {/* <div className="sb-accordion-arrow sb-accordion-toggle" data-ember-action="" data-ember-action-224959="224959">
              <div className="sb-arrow-inner">
                {!game.is_blocked && (marketSize > 0 && eventSize > 0) ? <i className="icon-icon-arrow-up"></i> : null}
                {game.is_blocked ? <i className="icon-icon-locked-stream" ></i> : null}
              </div>
            </div> */}
            </div>
  
          </div>
          <div className="sb-accordion-content overview-item match-content sportlist-game-accordion">
            <div className=" sb-accordion-title sb-block-header hidden-icon-parent game-market-title event-list-breadcrumb ">
              <div ref={(e) => { this.customSelect = e }} tabIndex="0" className="custom-select ">
                <div className="custom-select-style custom-select-default" disabled={marketSize < 1 && events.length < 1}>
                  <span>{defaultActiveMarket ? defaultActiveMarket.name : 'Match Result'}</span>
                  <span className="icon-match-result"></span><span className="icon-icon-arrow-down"></span>
                </div>
  
                <ul className="custom-select-style custom-select-market-types">
                  {
                    marketGroups.map((marketType, mt) => {
                      return (
                        <li className={`${defaultActiveMarket && defaultActiveMarket.name == marketType.name ? 'active' : ''}`} key={mt} id={marketType.id} onClick={() => {this.setActiveMarket(marketType)}}><span>{marketType.name}</span></li>
                      )
                    })
                  }
                </ul>
              </div>
  
              <div className="sb-accordion-title-icons">
                <div className="sb-accordion-title-icons-left">
                  <div className="calendar-events-title-dropdown-container">
                  </div>
                </div>
  
                <div className="more-matches" onClick={() => {this.moreMatches(game, sport, region, competition)}}>
                  <span>+{game.markets_count}</span>
                </div>
              </div>
            </div>
            <div className="event-list">
  
              {
                (marketSize > 0 && events.length) ?
                  events.map((e, i) => {
                    delete e.event
                    return (
                      <div {...{ className: `event-item-col-${e.col_count}` }} key={i}>
                        <SelectableEventBtn key={i} data={e} sport={{id:sport.id,name:sport.name,alias:sport.alias}} region={{id:region.id,name:region.name,alias:region.alias}} competition={{id:competition.id, name:competition.name}} betSelections={betSelections} game={game} market={eventMarket} addEventToSelection={addEventToSelection} event_col={e.col_count} oddType={oddType} />
                      </div>
  
                    )
                  })
                  : <span style={{ width: '100%', height: '100%', textAlign: 'center', padding: '10px', alignSelf: 'center' }}>No events available</span>
              }
  
            </div>
          </div>
  
        </div>
      )
    }
  }