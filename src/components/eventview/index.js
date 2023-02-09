import React, { PureComponent } from 'react'
import Controls from '../../containers/controls'
import CompetitionGame from '../competititonGame'
import { withRouter } from 'react-router-dom'
import { MarketLoader } from '../loader'
import { getCookie, stringReplacer } from '../../common'
import moment from 'moment'
import 'moment/locale/fr'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY } from '../../actionReducers'
import SportsComponent from '../../containers/sportsComponent'
import MarketComponent from '../gameMarket'
import BetSlip from '../../containers/betslip'
// import TagManager from 'react-gtm-module'

class EventView extends PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      activeNav: 0,
      activeSportView: 0,
      showPreview: true,
      enableEventSeletionBonus: true,
      selectionBonusPercentage: 0,
      decimalFormatRemove3Digit: false,
      loadingInitialData: false,
      view: null,
      sport: undefined,
      competition: undefined,
      region: undefined,
      game: undefined
    }
    this.sortByGroups = this.sortByGroups.bind(this)
    this.setTimePeriod = this.setTimePeriod.bind(this)
    this.loadMultiSelectData = this.loadMultiSelectData.bind(this)
  }
  componentDidMount() {
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
    let { view, sport, region, competition, game } = this.props.match.params, { sessionData } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition
    if (game)
      newState.game = locState.game
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadSports: true, ...newState }))
    if (undefined !== sessionData.sid && !this.state.loadingInitialData) {
      view === 'live' ?
        this.props.loadLiveGames()
        :
        this.props.loadPrematchGames()
      this.setState({ loadingInitialData: true, view: view, ...newState })
    }

  }
  componentDidUpdate() {
    let { view, sport, region, competition, game } = this.props.match.params, { sessionData, data } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition
    if (game)
      newState.game = locState.game
    if (undefined !== sessionData.sid && this.state.view === view && (this.state.sport !== locState.sport || this.state.region !== locState.region || this.state.competition !== locState.competition || this.state.game !== locState.game) && this.state.loadingInitialData && data.sport) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { marketData: [], competitionData: [], ...newState }))
      this.setState({ loadingInitialData: false, ...newState })
    }
    else if (this.state.view !== view && data.sport) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: view.charAt(0).toUpperCase() + view.slice(1), data: [], loadSports: true, marketData: [], competitionData: [], game: null, sport: null, region: null, competition: null }))
      view === 'live' ?
        this.props.loadLiveGames()
        :
        this.props.loadPrematchGames()
      this.setState({ loadingInitialData: true, view: view, ...newState })
    } else {
      if (undefined !== sessionData.sid && !this.state.loadingInitialData && !data.sport) {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: view.charAt(0).toUpperCase() + view.slice(1), ...newState, loadSports: true, marketData: [], competitionData: [] }))
        view === 'live' ?
          this.props.loadLiveGames()
          :
          this.props.loadPrematchGames()
        this.setState({ loadingInitialData: true, view: view, ...newState })
      }
    }
  }
  componentWillUnmount() {
    this.props.bulkUnsubscribe([], true)
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { data: [],activeView:'', populargamesData: {}, activeGame: {}, activeCompetition: {}, sport: null, region: null, game: null, competition: null }))
  }
  sortByGroups(groupID) {
    this.setState({ activeNav: groupID })
  }
  setTimePeriod(e) {
    e.persist()
    let a = e.target.value
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {prematchPeriod:a,loadSports: true}))
    this.props.loadPrematchGamesByPeriod(a)
  }
  loadMultiSelectData(){
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadSports: true}))
    this.props.loadPrematchGames() 
  }
  render() {
    const { data, loadCompetition, loadMarket, activeGame, activeSport, competitionData, activeView, competitionName,
      activeRegion, competitionRegion, marketData, betSelections, clearUpdate,
      activeGameSuspended,  activeCompetition,oddType } = this.props.sportsbook,
      { activeNav } = this.state,
      { loadMarkets, addEventToSelection, retrieve,
        unsubscribe,
        getBetslipFreebets, subscribeToSelection,validate, sendRequest, loadGames, sportAlias,handleBetResponse } = this.props
    const sport = data ? data.sport : {}
    let newdata = [], marketDataArr = [], marketDataGrouping = [], marketGroups = []

    for (let data in sport) {
      if (null !== sport[data])
        newdata.push(sport[data])
    }
    for (let data in marketData) {
      if (marketData[data]) {
        var name = marketData[data].name, groupID = marketData[data].group_id
        if (!marketGroups[groupID]) {
          marketGroups[groupID] = { id: marketData[data].group_id, name: marketData[data].group_name }
        }
        if (activeNav !== 0) {
          if (activeNav === groupID) {
            if (marketDataGrouping[name]) {
              marketDataGrouping[name].push(marketData[data])
            }
            else
              marketDataGrouping[name] = [marketData[data]]
          }
        } else {
          if (marketDataGrouping[name]) {
            marketDataGrouping[name].push(marketData[data])
          }
          else
            name !== void 0 && (marketDataGrouping[name] = [marketData[data]])
          // marketDataArr.push(marketData[data])
        }
      }
    }
    Object.keys(marketDataGrouping).forEach((name, key) => {
      name !== void 0 && marketDataArr.push({ name: name, data: marketDataGrouping[name] })
    })
    marketDataArr.sort((a, b) => {
      if (a.data[0].order > b.data[0].order)
        return 1;

      if (b.data[0].order > a.data[0].order)
        return -1;

      return 0;
    })
    newdata.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      if (b.order > a.order) {
        return -1;
      }
      return 0;
    })
    return (
      <>
      <div className={`event-view col-sm-12 ${activeView.toLowerCase()}`}>
        <SportsComponent multiview={false} loadMultiSelectData={this.loadMultiSelectData} setTimePeriod={this.setTimePeriod} loadMarkets={loadMarkets} addEventToSelection={addEventToSelection} sendRequest={sendRequest} loadGames={loadGames} />
        {activeView !== "Live" ?
          <div className={`competition col-sm-5`}>
            <CompetitionGame sport={activeSport} competition={{name:activeCompetition.name,id:activeCompetition.id,}} addEventToSelection={addEventToSelection} region={competitionRegion} competitionName={competitionName} competitionData={competitionData}
              loadMarkets={loadMarkets} loadCompetition={loadCompetition} betSelections={betSelections} activeGame={activeGame} oddType={oddType} />
          </div>
          :
          null
        }
        <div className={`market ${activeView === 'Live' ? 'col-sm-7' : 'col-sm-5'} ${activeView.toLowerCase()}`}>
          <div className={`market-container ${loadMarket || !activeGame ? 'market-loading' : ''}`}>
            {
              loadMarket || !activeGame ?
                <MarketLoader activeView={activeView} /> :
                <>

                   <>
                      <div id="" className={`game-markets-header sport-header fill ${sportAlias} ember-view`}>
                        <div className="game-markets-header-text sb-sport-header-title">
                        <span>
                          <span className="game-markets-header-county">{"In-Play >"} {sportAlias} </span>
                          <span className="game-markets-header-county">{">"} {activeRegion.name} </span>
                          <span className="game-markets-header-league"> ({competitionName}) </span>
                        </span>
                        <span>
                          <span className="game-markets-header-teams ipe-EventHeader_Fixture"><span className="teams"><span className="w1">{activeGame ? activeGame.team1_name : null}</span> <span className="vs">{activeGame ? activeGame.team2_name ? "vs" : '' : null}</span><span className="w2"> {activeGame ? activeGame.team2_name : null}</span></span></span>
                        </span>
                        {activeView !== "Live" &&<><span className="date">{activeGame &&activeGame.start_ts? moment.unix(activeGame.start_ts).format('dddd, D MMMM YYYY') : null}</span>
                        <span className="time">  {activeGame &&activeGame.start_ts ? moment.unix(activeGame.start_ts).format('H:mm') : null}</span></>}
                      </div>

                        <div className="info-icons">
                          <div className="lineups-opener ">

                          </div>
                          <span className="icon-icon-statistics statistics"></span>
                        </div>
                      </div>
                      {
                        activeView == "Live" && activeSport.id === 1 && <div className="gameinfo-container">
                        <div className="ember-view"><div className="time-line-container show desktop">
                          <div className="time-line normal">
                            <div className="cur-time" style={{ right: activeGame ? activeGame.info ? activeGame.info.current_game_state === 'Half Time' ? '50%' : (100 - (activeGame.info.current_game_time / parseInt(activeGame.match_length) * 100)) + '%' : 0 : 0 }}></div>

                            <span className={`${activeGame && activeGame.info && (activeGame.info.current_game_time > 0 || activeGame.info.current_game_state === 'Half Time') && 'active'}`}>
                              <span>0</span>
                            </span>
                            <span className="active">	</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && (activeGame.info.current_game_time >= 15 || activeGame.info.current_game_state === 'Half Time') && 'active'}`}>	<span>15</span>		</span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && (activeGame.info.current_game_time >= 30 || activeGame.info.current_game_state === 'Half Time') && 'active'}`}>	<span>30</span>		</span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className="active half-time ">
                              <span className="">HT</span>
                            </span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && activeGame.info.current_game_time && activeGame.info.current_game_time >= 60 && 'active'}`}>	<span>60</span>		</span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && activeGame.info.current_game_time && activeGame.info.current_game_time >= 75 && 'active'}`}>	<span>75</span>		</span>
                            <span className="active">			</span>
                            <span className="active full-time">			</span>
                            <span className={`${activeGame && activeGame.info && activeGame.info.current_game_time && activeGame.info.current_game_time >= parseInt(activeGame.match_length) && 'active'}`}>
                              <span>FT</span>
                            </span>
                          </div>
                        </div></div>
                      </div>
                      }
                    </>
                  
                  <MarketComponent sport={activeSport} region={activeRegion} competition={activeCompetition} activeNav={activeNav} sortByGroups={this.sortByGroups.bind(this)}  activeSport={activeSport} activeView={activeView} activeGame={activeGame} marketGroups={marketGroups} activeGameSuspended={activeGameSuspended} addEventToSelection={addEventToSelection} loadMarket={loadMarket} betSelections={betSelections} clearUpdate={clearUpdate} oddType={oddType} marketDataArr={marketDataArr}/>
                </>
            }
          </div>
        </div>
       { activeView === "Live" && <Controls />}
      </div>
      <BetSlip unsubscribe={unsubscribe}
          subscribeToSelection={subscribeToSelection}
          retrieve={retrieve} validate={validate} sendRequest={sendRequest} getBetslipFreebets={getBetslipFreebets} handleBetResponse={handleBetResponse}/>
      </>
    )
  }
}
export default withRouter(EventView)