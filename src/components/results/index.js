import React, { PureComponent } from 'react'
import {ResultsLoader} from '../loader'
import moment from 'moment'
import 'moment/locale/fr'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import {onSelect} from '../../common'
import {CheckBox} from '../stateless'
import ResultsGame from '../resultgame'
import { SPORTSBOOK_ANY, RIDS_PUSH, RESET } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
export default class Results extends PureComponent {
    constructor(props) {
  
      super(props)
      this.state = {
        showLive: false,
        datepickerF: moment().format('YYYY/MM/DD'),
        datepickerT: moment().format('YYYY/MM/DD'),
        activeSport: 1,
        c_id: null,
        r_id: null,
        loadingInitailData:false,
        resultsGame:[]
      }
      this.sports = [1, 2, 3, 4, 5, 6, 11, 29, 42, 54, 55, 56, 57, 118, 137, 150, 153, 190]
      this.sportsDetails = {
        1: 'Football', 2: 'Ice Hockey', 3: 'Basketball', 4: 'Tennis', 5: 'Volleyball', 6: 'American Football',
        11: 'Baseball', 29: 'Handball', 42: 'Water Polo', 54: 'Virtual Horse Racing', 55: 'Virtual Grayhound', 56: 'Virtual Tennis', 57: 'Virtual Football', 118: 'Virtual Car Racing',
        137: 'Greyhound Racing', 150: 'Virtual Bicycle', 153: 'Horse Racing', 190: '3X3 Basketball'
      }
      this.rids = {...this.props.sportsbook.rids}
      this.liveChecked = this.liveChecked.bind(this)
    }
    componentDidMount() {
      moment.locale(this.props.appState.lang.substr(0,2))
      const { datepickerF, datepickerT } = this.state
      $("#datepickerF").datepicker({ maxDate: '0', defaultDate: new Date(datepickerF), onSelect: function () { onSelect('datepickerF') },changeMonth: true, });
      $("#datepickerT").datepicker({ maxDate: '0', defaultDate: new Date(datepickerT), onSelect: function () { onSelect('datepickerT') },      changeYear: true });
      $("#datepickerF").datepicker("option", "dateFormat", "yy/mm/dd");
      $("#datepickerT").datepicker("option", "dateFormat", "yy/mm/dd");
      $("#datepickerF").datepicker("setDate", new Date(datepickerF));
      $("#datepickerT").datepicker("setDate", new Date(datepickerT));
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{activeView: 'Results',viewmode:4,loadSports:true}))
        if(undefined!==this.props.sportsbook.sessionData.sid && undefined ===this.props.sportsbook.data.sport && !this.state.loadingInitailData){
            this.setState({loadingInitailData:true})
            let date = { from: '', to: '' }
            date.from = moment().startOf('day').unix()
            date.to = moment().endOf('day').unix()
            this.get({
              // optional
              from_date: date.from,
              to_date: date.to
            }, "get_active_competitions")
            this.getResultGames(date)
        } 
  
    }
    componentDidUpdate() {
      if(undefined!==this.props.sportsbook.sessionData.sid && undefined ===this.props.sportsbook.data.sport && !this.state.loadingInitailData){
            this.setState({loadingInitailData:true})
            let date = { from: '', to: '' }
            date.from = moment().startOf('day').unix()
            date.to = moment().endOf('day').unix()
            this.get({
              // optional
              from_date: date.from,
              to_date: date.to
            }, "get_active_competitions")
            this.getResultGames(date)
        } 
    }
     componentWillUnmount(){
       this.props.bulkUnsubscribe([],true)
       this.props.dispatch(allActionDucer(RESET,{}))
     }
    get(params, command) {
      this.rids[11].request = {
        "command": command,
        "params": params
        , rid: 11
      }
      this.props.sendRequest(this.rids[11].request)
    }
    getResultGames(date, live = 0, sport = 1, competition = null, region = null) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ loadResultsGames: true }))
      let resJSON = {
        command: "get_result_games",
        params: {
          // optional
          from_date: date.from,
          to_date: date.to,
          sport_id: sport,
          live: live
        }, rid: 13
      }
      this.rids[13].request = resJSON
      if (null !== competition)
        resJSON.params["competition_id"] = competition
      //  if(null!==region)
      //  resJSON.params["region_id"] = region
  
      this.props.sendRequest(resJSON)
      // updateBrowserURL('view', 'results')
    }
    getGameResults(gameID) {
      if (this.props.sportsbook.resultsGame[gameID] === undefined) {
        let ridStart = gameID+'GR'
        this.rids[ridStart] = {
          rid: ridStart, callback: this.gameResultData.bind(this), id: gameID, request: {
            command: "get_results",
            params: {
              game_id: gameID
            }, rid: ridStart
          }
        }
        let newRid = {}
        newRid[ridStart]=this.rids[ridStart]
        this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ loadResultsGame: true, recentOpenedRSgame: gameID }))
        this.props.sendRequest(this.rids[ridStart].request)
      }
    }
    gameResultData(data) {
      let resultsGame = this.state.resultsGame
      resultsGame[this.rids[data.rid].id] = data.data.lines.line
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ resultsGame: resultsGame, loadResultsGame: false }))
      delete this.rids[data.rid]
      this.props.dispatch(allActionDucer(RIDS_PUSH,this.rids))
    }
    onDateChangeF(e) {
      e.persist()
      let id = e.target.id, val = e.target.value, mDate = moment(val), datepickerT = this.state.datepickerT
      if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(datepickerT).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerT), 'days') < 0 || mDate.diff(moment(datepickerT), 'days') > 2) {
        var incrDate = moment(val).add(2, 'days')
        if (moment(moment(incrDate).format('YYYY-MM-DD')).isAfter(moment(val).endOf('month').format('YYYY-MM-DD')))
          incrDate = moment(val).endOf('month')
        $("#datepickerT").datepicker("setDate", new Date(incrDate.format('YYYY/MM/DD')));
        datepickerT = incrDate
      }
      $("#datepickerF").val(moment(val).format('YYYY/MM/DD'));
      this.setState({ datepickerF: val, datepickerT: datepickerT })
    }
    onDateChangeT(e) {
      e.persist()
  
      let id = e.target.id, val = e.target.value, mDate = moment(val), datepickerF = this.state.datepickerF
      if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(val).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerF), 'days') > 2 || mDate.diff(moment(datepickerF), 'days') < 0) {
        var decrDate = moment(val).subtract(2, 'days')
        if (moment(moment(decrDate).format('YYYY-MM-DD')).isBefore(moment(datepickerF).startOf('month').format('YYYY-MM-DD')))
          decrDate = moment(datepickerF).startOf('month')
        $("#datepickerF").datepicker("setDate", new Date(decrDate.format('YYYY/MM/DD')));
        datepickerF = decrDate
      }
      $("#datepickerT").val(mDate.format('YYYY/MM/DD'));
      this.setState({ datepickerT: val, datepickerF: datepickerF })
    }
    liveChecked(e, id = null) {
      this.setState({ showLive: e.target.checked })
    }
    changeCompetition(id) {
      if (id !== this.state.activeSport)
        this.setState({ activeSport: parseInt(id) })
    }
    setCompetition(val) {
      if (val !== "All") {
        var params = JSON.parse(val)
        this.setState({ c_id: parseInt(params.c_id), r_id: parseInt(params.r_id) })
      } else {
        this.setState({ c_id: null, r_id: null })
  
      }
    }
    searchResult() {
      const live = this.state.showLive ? 1 : 0;
      const { datepickerF, datepickerT, c_id, r_id, activeSport } = this.state;
      this.getResultGames({ from: live ? moment().startOf('day').unix() : moment(datepickerF).startOf('day').unix(), to: live ? moment().endOf('day').unix() : moment(datepickerT).endOf('day').unix() }, live, activeSport, c_id, r_id)
    }
    render() {
      let { resultsGame, resultsGames, loadResultsGames, sportCompetitionList } = this.props.sportsbook;
      let { showLive, activeSport } = this.state,availableCompetitions = {}, competionOpt = [];
      if (sportCompetitionList.length > 0) {
        sportCompetitionList.sort((a, b) => {
          if (a.Id > b.Id) {
            return 1;
          }
          if (b.Id > a.Id) {
            return -1;
          }
          return 0;
        })
        sportCompetitionList.forEach(gameRS => {
          gameRS.Regions.forEach(regs => {
            regs.Competitions.forEach((c) => {
              if (!availableCompetitions[gameRS.Id]) {
                availableCompetitions[gameRS.Id] = [{ competition_id: c.Id, competition_name: c.Name, region_name: regs.Name, region_id: regs.Id }]
              } else {
                availableCompetitions[gameRS.Id].push({ competition_id: c.Id, competition_name: c.Name, region_name: regs.Name, region_id: regs.Id })
              }
            })
          })
  
        })
      }
      if (availableCompetitions[activeSport])
        Object.keys(availableCompetitions[activeSport]).forEach((rs) => {
          competionOpt.push(availableCompetitions[activeSport][rs])
        })
      return (
        <div className="results-container col-sm-12">
          <div className="filter-input-container">
            <div className="input-group">
              <span>Sport</span>
              <select onChange={(e) => { this.changeCompetition(e.target.value) }}>
                {
                  sportCompetitionList.map((sp, i) => {
                    return (
                      <option key={i} value={sp.Id}>{sp.Name}</option>
                    )
                  })
                }
              </select>
              <i className="icon-icon-arrow-down"></i>
            </div>
            <div className="input-group">
              <span>Competition</span>
              <select onChange={(e) => { this.setCompetition(e.target.value) }}>
                <option>All</option>
                {
                  competionOpt.map((r, i) => {
                    return <option key={i} value={JSON.stringify({ c_id: r.competition_id, r_id: r.region_id })}>{r.region_name + ' - ' + r.competition_name}</option>
                  })
                }
              </select>
              <i className="icon-icon-arrow-down"></i>
            </div>
            <div className="input-group">
              <span>Date</span>
              <div className="datepicker-holder">
                <input type="text" id="datepickerF" onChange={(e) => { this.onDateChangeF(e) }} placeholder="From" disabled={showLive} />
                <input type="text" id="datepickerT" onChange={(e) => { this.onDateChangeT(e) }} placeholder="To" disabled={showLive} />
              </div>
            </div>
            <div className="input-group">
              <div style={{ height: '25px' }}></div>
              <CheckBox onChange={this.liveChecked} checked={showLive} text={'Live'} id={0} />
            </div>
            <div className="input-group">
              <div style={{ height: '38px' }}></div>
              <button className="search" onClick={() => { this.searchResult() }}><span>Search</span></button>
            </div>
          </div>
          <div className="result-games">
            <div className="result-games-header">
              <div className="date col-sm-2">Date</div>
              <div className="competition col-sm-3">Competitions</div>
              <div className="event col-sm-5">Event</div>
              <div className="score col-sm-1">Scores</div>
              <div className="arrow col-sm-1"></div>
            </div>
            {
              !loadResultsGames && resultsGames.length > 0 ?
                resultsGames.map((game, k) => {
                  return (
                    <ResultsGame key={k} data={game} onOpen={this.getGameResults.bind(this)} resultsGame={resultsGame[game.game_id] ? resultsGame[game.game_id] : []} loadResultsGame={this.getGameResults.bind(this)} />
                  )
                })
                : !loadResultsGames && resultsGames.length < 1 ?
                  <div className="no-result"><span>No Games Found</span></div>
                  :
                  <ResultsLoader />
            }
          </div>
        </div>
      )
  
    }
  }