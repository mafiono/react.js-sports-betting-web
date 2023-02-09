import React, { PureComponent }  from 'react'
import LiveOverviewGame from '../liveOverviewGame' 
import moment from 'moment'
export default class OverviewCompetitionEventGame extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        loadGames: false,
        games: [], data: [],
        gamesArr: [],
        activeMarket: 0
      };
  
    }
  
    sortDateByDayASC(a, b) {
  
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
    sortDateDESC(a, b){
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
        props: { games, gameSets, region,routerHistory, sport, loadMarkets, betSelections, addEventToSelection, activeGame, competition, setActiveGame, oddType,activeView },
        state: { activeMarket }
      } = this;
      let data = []
      if (null !== games && undefined !== games)
        Object.keys(games).forEach((game, ind) => {
          if (null !== games[game]) {
            data.push(games[game])
          }
        })
  
      data.sort(this.sortDateByDayASC)
      return (
        <div className="sportlist-competition-accordion">
          <div className="sb-accordion-container">
            {
              data.map((game, index) => {
                if (null !== game && (null !== game.market)) {
  
                  return (
                    <LiveOverviewGame routerHistory={routerHistory} key={game.id} activeGame={activeGame} loadMarkets={loadMarkets} game={game}
                      addEventToSelection={addEventToSelection} gameSets={gameSets} region={region} sport={sport}
                      competition={competition} betSelections={betSelections} setActiveGame={setActiveGame} oddType={oddType} activeView={activeView}/>
                  )
                }
              })
            }
          </div>
        </div>
      )
    }
  }
  