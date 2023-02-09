import React, { PureComponent } from 'react'
import GameEventBtn from '../gameEventBtn'
import {CalenderLoader} from '../loader'
import {
  stringReplacer,

} from '../../common'
import {CheckBox} from '../stateless'
import Controls from '../../containers/controls'
import moment from 'moment' ;
import 'moment/locale/fr'
import { SPORTSBOOK_ANY } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
export default class Calendar extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        defaultActiveSport: null,
        showSports: [],
        selectedDate: 0,
        currentDate: moment().add(0, 'days'),
        excludeSelect: []
      }
      this.sports = [1, 2, 3, 4, 5, 6, 11, 29, 42, 190]
      this.sportsList = [1, 2, 3, 4, 5, 6, 11, 29, 42, 185, 190]
      this.sportsDetails = {
        1: 'Football', 2: 'Ice Hockey', 3: 'Basketball', 4: 'Tennis', 5: 'Volleyball', 6: 'American Football',
        11: 'Baseball', 29: 'Handball', 42: 'Water Polo', 190: '3X3 Basketball'
      }
      this.calenderDays = [0, 1, 2, 3, 4, 5, 6]
      this.addToExcluded = this.addToExcluded.bind(this)
      this.rids= {...this.props.sportsbook.rids}
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
    componentWillUnmount(){
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{data: [],competitionData:[],marketData:[],multiviewGames:[],populargamesData:{},activeGame:{},activeCompetition:{},sport:null,region:null,game:null,competition:null}))
      this.props.bulkUnsubscribe([],true)
    }
    load(data){
      this.props.history.replace(`/sports/${this.props.is_live?'live':'prematch'}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport.id,region:data.region.id,competition:data.competition.id,game:data.game.id})
    }
    changeDate(day, date) {
      let sp = [...this.sports], excluded = [...this.state.excludeSelect], newSp = []
      for (let index = 0; index < sp.length; index++) {
        const element = sp[index];
        if (!excluded.includes(element)) {
          newSp.push(element)
        }
      }
      this.loadCalenderGames(date, newSp)
      this.setState({ selectedDate: day, currentDate: date })
    }
    addToExcluded(e, id = 0) {
      let sp = [...this.sports], excluded = [...this.state.excludeSelect], newSp = []
      if (e.target.checked) {
        if (excluded.indexOf(id) !== -1) {
          excluded.splice(excluded.indexOf(id), 1)
        }
      } else {
        if (!excluded.includes(id)) {
          excluded.push(id)
        }
      }
      for (let index = 0; index < sp.length; index++) {
        const element = sp[index];
        if (!excluded.includes(element)) {
          newSp.push(element)
        }
      }
      this.setState({ excludeSelect: excluded })
      this.loadCalenderGames(this.state.currentDate, newSp)
    }
    addToExcludedAll(e) {
      let sp = [...this.sports], excluded = [], newSp = [], type = e.target.checked
      if (!type) {
        excluded = sp.slice(1, sp.length)
      }
      for (let index = 0; index < sp.length; index++) {
        const element = sp[index];
        if (!excluded.includes(element)) {
          newSp.push(element)
        }
      }
      this.setState({ excludeSelect: excluded })
      this.loadCalenderGames(this.state.currentDate, newSp)
    }
    componentDidMount() {
  this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{activeView: 'Calender',loadSports:true}))
        if(undefined!==this.props.sportsbook.sessionData.sid && undefined ===this.props.sportsbook.data.sport && !this.state.loadingInitailData){
            this.setState({loadingInitailData:true})
            this.loadCalenderGames()
        } 
    }
    componentDidUpdate() {
   if(undefined!==this.props.sportsbook.sessionData.sid && undefined ===this.props.sportsbook.data.sport && !this.state.loadingInitailData){
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{loadSports:true}))
            this.setState({loadingInitailData:true})
            this.loadCalenderGames()
        } 
    }
    loadCalenderGames(date = null, splist = null) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ viewmode: 3, loadSports: date ? true : false }))
      let dateCopy = null
      if (date) {
        dateCopy = date.clone()
      }
      this.rids[7].request = {
        command: "get",
        params: {
          source: "betting",
          what: { sport: [], region: [], competition: [], game: [[]], market: [], event: [] },
          where: {
            market: { display_key: "WINNER", display_sub_key: "MATCH" }, "sport": { "id": { "@in": splist || this.sportsList } }, "game": {
              type: { "@in": [2] }, "is_started": 0,
              start_ts: { "@gte": date ? moment(dateCopy.format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD')) ? date.startOf('day').unix() : moment().unix() : moment().unix(), "@lt": date ? date.endOf('day').unix() : moment().endOf('day').unix() }
            }
          },
          "subscribe": true
        }, rid: 7
      }
      this.props.sendRequest(this.rids[7].request)
      // updateBrowserURL('view', 'calender')
    }
    render() {
      const { data, loadSports,
          betSelections , oddType } = this.props.sportsbook
        ,{ selectedDate, showSports, excludeSelect } = this.state,{addEventToSelection,validate,unsubscribe,sendRequest,getBetslipFreebets,retrieve,subscribeToSelection,handleBetResponse}=this.props
      
      const sport = data ? data.sport : {}
      let  sportDataArr = [], sportGroups = []
      for (let data in sport) {
        var sId = sport[data].id
        if (null !== sport[data])
          for (const r in sport[data].region) {
            const reg = sport[data].region[r];
            if (reg) {
              for (const c in reg.competition) {
                const competition = reg.competition[c];
                if (competition) {
                  for (const g in competition.game) {
                    let game = competition.game[g], marketEvents = { W1: null, W2: null, Draw: null, market: null };
                    if (game) {
                      for (const m in game.market) {
                        const market = { ...game.market[m] };
                        if (market) {
                          if (market.type === 'P1XP2') {
                            for (const e in market.event) {
                              const event = market.event[e];
                              if (event) {
                                marketEvents[event.name] = event
                              }
                            }
                            marketEvents['market'] = market
                            break
                          }
                          else if (market.type === 'P1P2') {
                            for (const e in market.event) {
                              const event = market.event[e];
                              if (event) {
  
                                marketEvents[event.name] = event
  
                              }
                            }
                            marketEvents['market'] = market
                            break
                          }
                          // delete market.event
                          // marketEvents['market'] = market
                        }
                      }
                      // delete game.market
                      if (showSports.length > 0) {
                        if (showSports.includes(sId)) {
                          sportDataArr.push({
                            sport_id: sId, sport_alias: sport[data].alias, sport_name: sport[data].name,
                            region_id: reg.id, region_name: reg.name, competition_id: competition.id, competition_name: competition.name,
                            game_id: game.id, game_name: game.team1_name + ' - ' + game.team2_name, markets_count: game.markets_count, is_feed_available: game.is_feed_available,
                            is_stat_available: game.is_stat_available, events: marketEvents, start_ts: game.start_ts, game: game, sport: sport[data], region: reg, competition: competition
                          })
                        }
                      } else {
                        sportDataArr.push({
                          sport_id: sId, sport_alias: sport[data].alias, sport_name: sport[data].name,
                          region_id: reg.id, region_alias: reg.alias, region_name: reg.name, competition_id: competition.id, competition_name: competition.name,
                          game_id: game.id, game_name: game.team1_name + ' - ' + game.team2_name, markets_count: game.markets_count, is_feed_available: game.is_feed_available,
                          is_stat_available: game.is_stat_available, events: marketEvents, start_ts: game.start_ts, game: game, sport: sport[data], region: reg, competition: competition
                        })
                      }
                    }
                  }
                }
              }
            }
  
          }
        if (!sportGroups[sId]) {
          sportGroups[sId] = { id: sId, name: sport[data].name }
        }
  
      }
  
      sportDataArr.sort((a, b) => {
        var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
        var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
        if (moment(anewDate).isAfter(bnewDate)) {
          return 1;
        }
        if (moment(anewDate).isBefore(bnewDate)) {
          return -1;
        }
        return 0;
      })
      return (
        <div className={`event-view live col-sm-12`}>
        <div className="calender-view col-sm-9">
          <div className="calender-game-date">
            {
              this.calenderDays.map((day, i) => {
                var DM = moment().add(day, 'days')
                return (
                  <div key={i} className={`game-date ${selectedDate === day ? 'selected' : ''}`} onClick={() =>{this.changeDate(day, DM)}}>
                    <span>{moment().add(day, 'days').format('DD.MM')}</span>
                    <span>{moment().add(day, 'days').format('dddd')}</span>
                  </div>
                )
              })
            }
  
          </div>
          <div className="calender-heading">
            <div className="sport col-sm-2">
              <div ref={(e) => { this.sportSelect = e }} tabIndex="0" className="custom-select ">
                <div className="custom-select-style custom-select-default">
                  <span style={{ marginRight: '15px' }}>Sport</span>
                  <span className="icon-match-result"></span><span className="icon-icon-arrow-down"></span>
                </div>
  
                <ul className="custom-select-style custom-select-market-types">
                  <li>
                    <label className="container">All
                  <input type="checkbox" checked={excludeSelect.length > 0 ? false : true} onChange={(e) => { this.addToExcludedAll(e) }} />
                      <span className="checkmark"></span>
                    </label>
                  </li>
                  {
                    this.sports.map((sportG, mt) => {
                      return (
                        <li key={mt}>
                          <CheckBox text={this.sportsDetails[sportG]} id={sportG} checked={excludeSelect.includes(sportG) ? false : true} onChange={this.addToExcluded} />
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
            <div className="time col-sm-1"><span>Time</span></div>
            <div className="league col-sm-2"><span>League</span></div>
            <div className="event col-sm-3"><span>Event</span></div>
            <div className="w1-head col-sm-1"><span>1</span></div>
            <div className="draw-head col-sm-1"><span>x</span></div>
            <div className="w2-head col-sm-1"><span>2</span></div>
            <div className="stats col-sm-1"></div>
          </div>
          <div className={`calender-events-container`}>
            {!loadSports ?
              sportDataArr.map((eventItem, k) => {
                return (
                  <div key={k} className="calender-event-item col-sm-12" onClick={() => { this.load({game:eventItem.game, sport:eventItem.sport, region:eventItem.region, competition:eventItem.competition}) }}>
                    <div className={`col-sm-2 sport sport-avatar ${stringReplacer(eventItem.sport_alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])} ${stringReplacer(eventItem.sport_alias, [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase()}`}><span>{eventItem.sport_name}</span></div>
                    <div className="time col-sm-1"><span>{moment.unix(eventItem.start_ts).format('H:mm')}</span></div>
                    <div className="league col-sm-2"><span {...{ className: `region-icon flag-icon flag-${eventItem.region_alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase()}` }} style={{height:'22px'}}></span><span>{eventItem.region_name} - {eventItem.competition_name}</span></div>
                    <div className="event col-sm-3"><span>{eventItem.game_name}</span></div>
                    {eventItem.events.W1 ? <GameEventBtn size='col-sm-1' sport={eventItem.sport} region={eventItem.region} competition={eventItem.competition} game={eventItem.game} evtmarket={eventItem.events.market} evnt={eventItem.events.W1} addEventToSelection={addEventToSelection} betSelections={betSelections} oddType={oddType} /> : <div className="col-sm-1 w1-empty"><span></span></div>}
                    {eventItem.events.Draw ? <GameEventBtn size='col-sm-1' sport={eventItem.sport} region={eventItem.region} competition={eventItem.competition} game={eventItem.game} evtmarket={eventItem.events.market} evnt={eventItem.events.Draw} addEventToSelection={addEventToSelection} betSelections={betSelections} oddType={oddType} /> : <div className="col-sm-1 draw-empty"><span></span></div>}
                    {eventItem.events.W2 ? <GameEventBtn size='col-sm-1' sport={eventItem.sport} region={eventItem.region} competition={eventItem.competition} game={eventItem.game} evtmarket={eventItem.events.market} evnt={eventItem.events.W2} addEventToSelection={addEventToSelection} betSelections={betSelections} oddType={oddType} /> : <div className="col-sm-1 w2-empty"><span></span></div>}
                    <div className="stats col-sm-1"><span style={{ textAlign: 'right', paddingRight: '10px' }}>{eventItem.markets_count > 0 ? "+" + eventItem.markets_count : null}</span></div>
                  </div>
                )
              }) :
              <CalenderLoader />
            }
          </div>
  
        </div>
         <Controls unsubscribe={unsubscribe} handleBetResponse={handleBetResponse}
         subscribeToSelection={subscribeToSelection}
         retrieve={retrieve} validate={validate} sendRequest ={sendRequest } getBetslipFreebets={getBetslipFreebets}/>
     </div>
         )
    }
  }