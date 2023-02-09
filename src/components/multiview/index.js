import React, { PureComponent } from 'react'
import SportsComponent from '../../containers/sportsComponent'
import Controls from '../../containers/controls'
import MultiviewMarket from '../multiviewmarket'
import Droppable from  '../droppable'
import { SPORTSBOOK_ANY, RESET } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import { dataStorage } from '../../common'
export default class Multiview extends PureComponent{
    constructor(props) {
      super(props)
      this.state = {
        opened: false,
        activeNav: 0,
        activeSportView: 0,
        showPreview: true
      }
      this.sortByGroups = this.sortByGroups.bind(this)
      this.onDrop = this.onDrop.bind(this)
    }
    componentDidMount() {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{activeView: 'Multiview',loadSports:true,marketData:[],competitionData:[]}))
        if(undefined!==this.props.sportsbook.sessionData.sid && undefined ===this.props.sportsbook.data.sport && !this.state.loadingInitailData){
            this.setState({loadingInitailData:true})
            this.props.loadMultiviewLiveGames()
        } 
    }
    componentDidUpdate() {
        if(undefined!==this.props.sportsbook.sessionData.sid && undefined ===this.props.sportsbook.data.sport && !this.state.loadingInitailData){
          this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{loadSports:true,marketData:[],competitionData:[]}))
            this.setState({loadingInitailData:true})
            this.props.loadMultiviewLiveGames()
        } 
    }
    componentWillUnmount(){
      this.props.bulkUnsubscribe([],true)
      this.props.dispatch(allActionDucer(RESET,{}))
    }
    clearSearch() {
      if (this.searchInput) {
        this.searchInput.value = ''
        this.props.clearSearch()
      }
    }
    sortByGroups(groupID) {
      this.setState({ activeNav: groupID })
    }
    onDragOver(e) {
      e.preventDefault()
    }
    onDrop(e) {
      e.preventDefault()
      let id = JSON.parse(e.dataTransfer.getData("text"))
      this.addToMultiViewGames(id.id)
  
    }
    addToMultiViewGames(game) {
      let multiviewGames = [...this.props.sportsbook.multiviewGames]
      if (!multiviewGames.includes(game)) {
        multiviewGames.push(game)
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ multiviewGames: multiviewGames }))
        dataStorage('multiviewGames', multiviewGames)
      }
    }
    removeMultiViewGame(game, newGame = null, success = null){
      let multiviewGames = [...this.props.sportsbook.multiviewGames], gameIndex = multiviewGames.indexOf(game)
      if (gameIndex !== -1) {
        null !== newGame && undefined !== newGame ? multiviewGames[gameIndex] = newGame : multiviewGames.splice(multiviewGames.indexOf(game), 1)
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ multiviewGames: multiviewGames }))
        dataStorage('multiviewGames', multiviewGames)
        if (null !== newGame && undefined !== newGame) {
          success()
        }
      }
    }
    render() {
  
      const{ data, loadSports,
          multiviewGames, betSelections, activeGameSuspended, oddType 
      } = this.props.sportsbook,{addEventToSelection, loadMarkets, loadGames,unsubscribe,retrieve,validate,getBetslipFreebets,sendRequest,subscribeToSelection,handleBetResponse}=this.props
      const sport = data ? data.sport : {}
      let newdata = [], multiviewSelectedGames = {}
      for (let data in sport) {
        if (null !== sport[data])
          newdata.push(sport[data])
        let s = sport[data]
        if (null !== s) {
          Object.keys(s.region).forEach((r) => {
            let region = sport[data].region[r]
            if (region) {
              for (let c in region.competition) {
                let competition = region.competition[c]
                if (competition) {
                  for (const g in competition.game) {
                    let game = competition.game[g]
                    if (game && multiviewGames.includes(game.id)) {
                      multiviewSelectedGames[game.id] = { sport: { id: s.id, alias: s.alias, name: s.name }, region: { id: region.id, name: region.name }, competition: { id: competition.id, name: competition.name }, game: game }
                    }
                  }
                }
              }
            }
          })
        }
      }
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
        <div className={`event-view live col-sm-12`}>
        <SportsComponent multiview={true}  loadMarkets={loadMarkets} addEventToSelection={addEventToSelection} sendRequest={sendRequest} loadGames ={loadGames}/>
        <div className={`multiview-window col-sm-8`} onDragOver={(e) => this.onDragOver(e)}>
          {
            !loadSports ?
              multiviewGames.map((selectedGame, k) => {
                let marketDataArr = [], marketDataGrouping = [], marketData = multiviewSelectedGames[selectedGame] ? multiviewSelectedGames[selectedGame].game.market : {}
                for (let data in marketData) {
                  if (marketData[data]) {
                    let name = marketData[data].name

                    if (marketDataGrouping[name]) {
                      marketDataGrouping[name].push(marketData[data])
                    }
                    else
                      marketDataGrouping[name] = [marketData[data]]
                    // marketDataArr.push(marketData[data])
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
                return (
                  multiviewSelectedGames[selectedGame] !== undefined ?
                    <MultiviewMarket key={k} activeGameSuspended={activeGameSuspended} addEventToSelection={addEventToSelection} marketDataArr={marketDataArr} activeGame={multiviewSelectedGames[selectedGame].game}
                      betSelections={betSelections} activeSport={multiviewSelectedGames[selectedGame].sport} competition={multiviewSelectedGames[selectedGame].competition}
                      region={multiviewSelectedGames[selectedGame].region} loadMarkets={loadMarkets} removeMultiViewGame={this.removeMultiViewGame.bind(this)} oddType={oddType} />
                    : null)
              })
              : null
          }
          <Droppable onDragOver={this.onDragOver} onDrop={this.onDrop} />
          <Droppable onDragOver={this.onDragOver} onDrop={this.onDrop} />
          <Droppable onDragOver={this.onDragOver} onDrop={this.onDrop} />
        </div>
        <Controls unsubscribe={unsubscribe}
        subscribeToSelection={subscribeToSelection} handleBetResponse={handleBetResponse}
        retrieve={retrieve} validate={validate} sendRequest ={sendRequest } getBetslipFreebets={getBetslipFreebets}/>
      </div>
      )
    }
  }