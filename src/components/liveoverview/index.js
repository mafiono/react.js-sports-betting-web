import React,{PureComponent} from 'react'
import OverviewSport from '../overviewsport'
import {OverviewLoader} from '../loader'
import {withRouter} from 'react-router-dom'
import { SPORTSBOOK_ANY, RESET } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import Controls from '../../containers/controls'
 class LiveOverview extends PureComponent {
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
        loadingInitailData:false
      }
    }
    componentDidMount() {
      const {sessionData,data} = this.props.sportsbook
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{data:[],activeView: 'LiveOverview',loadSports:true,marketData:[],competitionData:[]}))
      if(undefined!==sessionData.sid && !this.state.loadingInitailData){
         this.setState({loadingInitailData:true})
         this.props.loadLiveOverviewGames()
     } 
    }
    componentDidUpdate() {
      const {sessionData,data} = this.props.sportsbook
      if(undefined!==sessionData.sid && !this.state.loadingInitailData){
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{activeView: 'LiveOverview',loadSports:true,marketData:[],competitionData:[]}))
        this.setState({loadingInitailData:true})
        this.props.loadLiveOverviewGames()
      } 
    }
   componentWillUnmount(){
     this.props.bulkUnsubscribe([],true)
     this.props.dispatch(allActionDucer(RESET,{}))
   }
   setActiveGame(game,sport){
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{activeGame:game,activeSport: sport}))
  }
    render() {
      const { data, loadSports , activeGame, activeSport, loadGames, competitionData, activeView,
          activeCompetition, activeRegion,  marketData, setActiveSport, betSelections,
              oddType }= this.props.sportsbook,
       { activeNav}= this.state,{subscribeToSelection,unsubscribe,
        retrieve,
        validate,
        sendRequest,loadMarkets,selectRegion,
        getBetslipFreebets,addEventToSelection,history,handleBetResponse}=this.props
        const sport = data.sport
      let newdata = [], marketDataArr = [], marketDataGrouping = [], marketGroups = [], searchResult = []
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
              marketDataGrouping[name] = [marketData[data]]
            // marketDataArr.push(marketData[data])
          }
        }
      }
      Object.keys(marketDataGrouping).forEach((name, key) => {
        marketDataArr.push({ name: name, data: marketDataGrouping[name] })
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
        <React.Fragment>
        <div className="live-overview col-sm-9">
          <div className="sports">
            <div className={`sports-list ${loadSports ? 'loading-view' : ''}`}>
              {
                !loadSports ?
                  newdata.map((sport, key) => {
  
                    return (
                      <OverviewSport routerHistory={history} key={sport.id} sport={sport} activeView={activeView} competition={activeCompetition} loadGames={loadGames} competitionData={competitionData} activeSport={activeSport} setActiveSport={setActiveSport} loadSports={loadSports}
                        oddType={oddType} setActiveGame={this.setActiveGame.bind(this)} betSelections={betSelections} competitionRegion={activeRegion} selectRegion={selectRegion} loadMarkets={loadMarkets} addEventToSelection={addEventToSelection} activeGame={activeGame} />
                    )
                  })
                  :
                  <OverviewLoader />
              }
            </div>
          </div>
        </div>
        <Controls unsubscribe={unsubscribe}
        subscribeToSelection={subscribeToSelection} handleBetResponse={handleBetResponse}
        retrieve={retrieve} validate={validate} sendRequest ={sendRequest } getBetslipFreebets={getBetslipFreebets}/>
        </React.Fragment>
      )
    }
  }
  export default  withRouter(LiveOverview)