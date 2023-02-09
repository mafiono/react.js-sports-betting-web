import React, { PureComponent } from 'react'
import EventView from '../../containers/eventview'
// import LiveOverview from '../../containers/liveoverview'
// import Multiview from '../../containers/multiview'
// import Calendar from '../../containers/calender'
import Results from '../../containers/results'
import {stringReplacer} from '../../common'
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { RESET } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import Helmet from 'react-helmet'
// import ReactGA from 'react-ga';
export default class SportsBook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      activeNav: 0,
      activeSportView: 0
    }

    this.resultMap = {
      Won: "won",
      Lost: "lose",
      Accepted: "wait",
      CashOut: "won",
      Returned: "lose",
      Ticketnumbernotfound: "Ticket number not found"
    }
  }
  
  componentDidMount() {
    // ReactGA.pageview('/sportsbook');
  }
  componentWillUnmount() {
    this.props.dispatch(allActionDucer(RESET,{}))
  }
  componentDidUpdate() {

  }
  render() {
    const {loadSports,activeSport, activeCompetition,
      activeRegion, viewmode,appTheme} = this.props.sportsbook,
      { removeMultiViewGame, loadCalenderGames,loadLiveGames,loadPrematchGames,loadPrematchGamesByPeriod,loadMultiviewLiveGames,loadLiveOverviewGames,
        retrieve,unsubscribe,sendRequest,subscribeToSelection,
getBetslipFreebets,bulkUnsubscribe,validate,addEventToSelection,loadMarkets,loadGames,handleBetResponse}= this.props
 ,sportAlias = stringReplacer(activeSport.alias, [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase()
    return (
      <div className={`sportsbook-container ${appTheme+'-theme'}`}>
        <Helmet>
        <title>Sports Book- Corisbet Gambling</title>
        </Helmet>
        <div className="sportsbook-inner">
          {/* <div className="sportsbook-mode">
            <div>
              <NavLink to={`${this.props.match.url}`}><div className="links"  style={{ color: viewmode === 0? '#ff7b00' : '' }}>Event View</div></NavLink>
              <NavLink to={`${this.props.match.url}/overview`}><div className="links"  style={{ color: viewmode === 1 ? '#ff7b00' : '' }}>Live Overview</div></NavLink>
              <NavLink to={`${this.props.match.url}/multiview`}><div className="links" style={{ color: viewmode === 2 ? '#ff7b00' : '' }}>Live Multiview</div></NavLink>
              <NavLink to={`${this.props.match.url}/calendar`}><div className="links"  style={{ color: viewmode === 3 ? '#ff7b00' : '' }}>Calendar</div></NavLink>
              <NavLink to={`${this.props.match.url}/results`}><div className="links" style={{ color: viewmode === 4 ? '#ff7b00' : '' }}>Results</div></NavLink>
              {isLoggedIn ? <div className="links" style={{ color: showBetHistory ? '#feae11' : '' }} onClick={() => { this.openBetHistory() }}>Bet History</div> : null} 
            </div>
          </div> */}
          <div className="sportsbook-view">
          <div className="sportsbook-content">
          <Switch>
            <Route exact path={this.props.match.path}>
              <Redirect to={`${this.props.match.url}/prematch`}/>
            </Route>
            <Route path={`${this.props.match.path}/results`}>
              <Results  sendRequest={sendRequest} bulkUnsubscribe={bulkUnsubscribe}/>
                      
            </Route>
            <Route path={`${this.props.match.path}/:view/:sport?/:region?/:competition?/:game?`}>
             <EventView connect={this.connect} liveEvent={this.liveEvent} loadMarkets={loadMarkets} loadGames={loadGames} handleBetResponse={handleBetResponse}
                addEventToSelection={addEventToSelection}
                sportAlias={sportAlias}loadLiveGames={loadLiveGames} validate={validate} sendRequest={sendRequest} subscribeToSelection={subscribeToSelection}
                loadPrematchGames={loadPrematchGames} loadPrematchGamesByPeriod={loadPrematchGamesByPeriod} bulkUnsubscribe={bulkUnsubscribe} retrieve={retrieve} unsubscribe={unsubscribe} getBetslipFreebets={getBetslipFreebets} 
              />
            </Route>
          </Switch>
        </div>
          </div>
        </div>
      </div>
    )
  }
}