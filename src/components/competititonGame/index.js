import React, { PureComponent } from 'react'
import GameEventBtn from '../gameEventBtn'
import {CompetitionLoader} from '../loader'
import {getCookie, stringReplacer} from '../../common'
import moment from 'moment'
import 'moment/locale/fr'
export default class CompetitionGame extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        loadGames: false,
        games: [], 
        data: [],
        gamesArr: []
      };
      this.language_cookie = getCookie('think_var')
      if (this.language_cookie) {
        if (this.language_cookie === "fr-fr")
        { 
        moment.locale('fr'); // 'fr'
      }
        else if (this.language_cookie === "en-gb")
       { 
        moment.locale('en'); // 'en'
      }
       else if(this.language_cookie === "zh-cn"){
        moment.locale('zh'); // 'chinese'
       }
      }
    }
    sortDateByDayASC (a, b){
  
      if (moment(a.date).isAfter(b.date, 'day')) {
        return 1;
      }
      if (moment(a.date).isBefore(b.date, 'day')) {
        return -1;
      }
      return 0;
    }
    sortDateByTimeASC(a, b) {
      var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
      var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
      if (moment(anewDate).isAfter(bnewDate)) {
        return 1;
      }
      if (moment(anewDate).isBefore(bnewDate)) {
        return -1;
      }
      return 0;
    }
    sortDateDESC(a, b) {
      if (a.date > b.date) {
        return -1;
      }
      if (b.date > a.date) {
        return 1;
      }
      return 0;
    }
    render() {
      const {
        props: { competitionData,competition, competitionName, region, loadMarkets, loadCompetition, betSelections, addEventToSelection, activeGame, oddType,sport },
        state
      } = this;
      let data = [], games = []
      Object.keys(competitionData).forEach((game, ind) => {
        if (null !== competitionData[game]) {
          var date = moment.unix(competitionData[game].start_ts).format('YYYY-MM-DD');
          if (games[date]) {
            games[date].push(competitionData[game])
          }
          else
            games[date] = [competitionData[game]]
        }
      })
      Object.keys(games).forEach((dategame, key) => {
        if (null !== games[dategame])
          data.push({ date: dategame, data: games[dategame] })
      })
      data.sort(this.sortDateByDayASC)
      return (
        <div className="competition-container">
          <div {...{ className: `competition-name` }}>
            {!loadCompetition ?
              <React.Fragment>
                <span {...{ className: `region-icon ${region.alias ? 'flag-icon' : null} flag-${region.alias ? region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : null}` }}></span>
                <span className="competition-name">{competitionName}</span>
              </React.Fragment>
              : <div className="g-loading large gradient"></div>}</div>
          <div className={`competition-games ${loadCompetition ? 'loading-view' : ''}`}>
            {
              !loadCompetition ?
                Object.keys(competitionData).length ?
                  data.map(
                    (game, index) => {
                      game.data.sort(this.sortDateByTimeASC)
                      var eventsName = []
                      for (const eventD in game.data) {
                        if (game.data[eventD].market &&Object.keys(game.data[eventD].market).length > 0) {
                         if(game.data[eventD].market[Object.keys(game.data[eventD].market)[0]]!==null){
                          for (const ev in game.data[eventD].market[Object.keys(game.data[eventD].market)[0]].event) {
  
                            eventsName.push(game.data[eventD].market[Object.keys(game.data[eventD].market)[0]].event[ev])
                          }
  
                          break
                         }
                        }
                      }
                      eventsName.sort((a, b) => {
                        if (a.order > b.order)
                          return 1
                        if (b.order > a.order)
                          return -1
                        return 0
                      })
                      return (
  
                        <div className="competition-game" key={index}>
                          <div className="game-date">
                            <span className="date">
                              {moment(game.date).format('dddd, D MMMM YYYY')}
                            </span>
                            <span className="events">
                              {eventsName.map((en, enk) => {
                                return (
                                  <span key={enk} className={en.name.toLowerCase()}>{stringReplacer(en.type, [/P/g], [''])}</span>
                                )
                              })}
  
                            </span>
                            {/* <span className="spare">
                            </span> */}
                          </div>
                          {
                            game.data.map((eachgame, ind) => {
                              var market = [], game = { ...eachgame }, marketEvent = [], evtmarket;
                              delete game.market
                              // market.push(eachgame.market[0].event)
                              for (const mark in eachgame.market) {
                                var cmarket = eachgame.market[mark]
                                if (cmarket && cmarket.type == "P1XP2" && cmarket.event) {
                                  evtmarket = { ...cmarket }
                                  delete evtmarket.event
                                  Object.keys(cmarket.event).forEach((eventItem, ind) => {
                                    if (null !== cmarket.event[eventItem])
                                      marketEvent.push(cmarket.event[eventItem])
                                  })
                                  break;
                                } else if (cmarket && cmarket.type == "P1P2" && cmarket.event) {
                                  evtmarket = { ...cmarket }
                                  delete evtmarket.event
                                  Object.keys(cmarket.event).forEach((eventItem, ind) => {
                                    if (null !== cmarket.event[eventItem])
                                      marketEvent.push(cmarket.event[eventItem])
                                  })
                                  break;
                                }
                              }
                              marketEvent.sort((a, b) => {
                                if (a.order > b.order) {
                                  return 1;
                                }
                                if (b.order > a.order) {
                                  return -1;
                                }
                                return 0;
                              })
                              return (
                                <div key={eachgame.id} className={`game col-sm-12 ${activeGame && activeGame.id === eachgame.id ? 'active' : ''}`} onClick={() => activeGame && activeGame.id === eachgame.id ? null : loadMarkets(eachgame)}>
                                  <div className={`game-teams ${marketEvent.length > 0 || eventsName.length > 0?'col-sm-5':'col-sm-10'}`}>
                                    <span className="w1">{eachgame.team1_name}</span><span className="w2">{eachgame.team2_name}</span>
                                  </div>
                                  <div className={`game-time col-sm-2`} style={{ textAlign: eventsName.length == 0 ? 'right' : '', paddingRight: eventsName.length == 0 ? '10px' : '' }}>
                                    <span className="time">{moment.unix(eachgame.start_ts).format('H:mm')}</span>
                                    <span className="market-count">+ {eachgame.markets_count}</span>
                                  </div>
                                  {marketEvent.length > 0 ? <div className="game-market col-sm-5">
                                    {
                                      marketEvent.map((evnt, k) => {
                                        return (
                                          <GameEventBtn sport={sport} region={region} competition={competition} key={k} game={game} evtmarket={evtmarket} evnt={evnt} addEventToSelection={addEventToSelection} betSelections={betSelections} oddType={oddType} />
                                        )
                                      })
                                    }
                                  </div>
                                    :
                                    eventsName.length > 0 ?
                                      <div className="game-market col-sm-5">
                                        {eventsName.map((en, enk) => {
                                          return (
                                            <div key={enk}><span className={`price`} data-event={null}>---</span></div>
                                          )
                                        })}
                                      </div> : null
                                  }
                                  {/* <div className="arrow-icon-back"></div> */}
                                </div>
                              )
                            })
  
                          }
  
                        </div>)
                    }
                  )
                  :
                  <div className="game-date no-data" style={{ paddingTop: '20px' }}>
                    <span className="date">No data to display </span>
                  </div>
                :
                <CompetitionLoader />
            }</div>
        </div>
      )
    }
  }