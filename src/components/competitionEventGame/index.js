import React, { PureComponent } from 'react' 
import LiveBtn from '../liveBtn'
import moment from 'moment'
import 'moment/locale/fr'
 import {
  stringReplacer,
  convertSetName,
  updateBrowserHistoryState,
  getCookie
} from '../../common'
import {withRouter} from 'react-router-dom'
class CompetitionEventGame extends PureComponent{
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        loadGames: false,
        games:  [], data: [],
        gamesArr: [],
        draggedGame: null
      };
      this.gamebody = null
      this.timeout = null
      this.onDragStart = this.onDragStart.bind(this)
      this.onDragEnd = this.onDragEnd.bind(this)
      this.addClass = this.addClass.bind(this)
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
    loadMarkets(game,sport,region,competition){
       const activeView = this.props.activeView
      if(activeView === 'Live' || activeView === 'Prematch'){
      this.props.loadMarkets(game, sport, region, competition)
      updateBrowserHistoryState({sport:sport.id,region:region.id,competition:competition.id,game:game.id},`/sports/${activeView.toLowerCase()}/${sport.alias}/${region.name}/${competition.id}/${game.id}`)
    }
      else{
          const view =activeView === 'Home' ? 'live':'prematch'
      this.props.history.replace(`/sports/${view}/${sport.alias}/${region.name}/${competition.id}/${game.id}`,{sport:sport.id,region:region.id,competition:competition.id,game:game.id})
      }
    }
    sortDateByDayASC(a, b){
  
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
    onDragStart(e, g, c) {
      e.dataTransfer.setData('text', JSON.stringify(g))
      // e.dataTransfer.effectAllowed = "move";
      this.addClass(g.id + '' + c)
    }
    gameClicked(g) {
      this.setState({ draggedGame: g.id })
      this.props.addToMultiViewGames(g.id)
    }
    onDragEnd(e, g) {
      this.setState({ draggedGame: null })
      document.getElementById(g).classList.remove('dragging')
    }
    addClass(g) {
      this.timeout = setTimeout(() => {
        document.getElementById(g).classList.add('dragging')
      });
    }
    componentWillUnmount(){
      clearTimeout(this.timeout)
    }
    render() {
      const {
        props: { multiview, games, region, sport, betSelections, addEventToSelection, activeGame, competition, multiviewGames, oddType },
        state: { draggedGame }
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
        <div ref={(e) => { this.gamebody = e }} className={`sportlist-competition-accordion`} >
          <div className="sb-accordion-container">
            {
              data.map((game, index) => {
                if (null !== game && (null !== game.market)) {
                  let currentSet = game !== null && game.info && game.info.current_game_state ? convertSetName()(game.info.current_game_state, stringReplacer(sport.alias, [/\s/g], [''])) : '';
                  let events = [], marketSize = game.market ? Object.keys(game.market).length : 0, eventSize = game.market ? game.market[Object.keys(game.market)[0]] && game.market[Object.keys(game.market)[0]].event ? Object.keys(game.market[Object.keys(game.market)[0]].event).length : 0 : 0, eventMarket = game.market ? game.market[Object.keys(game.market)[0]] : null;
                  if (marketSize > 0 && eventSize > 0)
                    for (const mark in game.market) {
                      var cmarket = game.market[mark]
                      if (cmarket && cmarket.type == "P1XP2") {
                        Object.keys(cmarket.event).forEach((eventItem, ind) => {
                          if (null !== cmarket.event[eventItem])
                            events.push(cmarket.event[eventItem])
                        })
                        break;
                      } else if (cmarket && cmarket.type == "P1P2") {
                        Object.keys(cmarket.event).forEach((eventItem, ind) => {
                          if (null !== cmarket.event[eventItem])
                            events.push(cmarket.event[eventItem])
                        })
                        break;
                      }
                    }
                  events.sort((a, b) => {
                    if (a.order > b.order)
                      return 1
                    if (b.order > a.order)
                      return -1
                    return 0
                  })
                  return (
                    !multiviewGames.includes(game.id) ?
                      <div key={index} title={game.team1_name + " - " + game.team2_name} id={game.id + '' + competition.id} className={`sb-accordion-item match open ember-view ${multiview ? 'draggable' : ''}`} draggable={multiview ? true : false}
                        onDragStart={(e) => { this.onDragStart(e, game, competition.id) }} onDragEnd={(e) => { this.onDragEnd(e, game.id + '' + competition.id) }}>
                        <div onClick={()=>activeGame && activeGame.id !== game.id && !multiview? this.loadMarkets(game, sport, region, competition) : multiview ? this.gameClicked(game) : this.loadMarkets(game, sport, region, competition)} className={`sb-accordion-title match-title ${(marketSize == 0 && eventSize == 0) ? 'border-bottom' : ''} ${activeGame && activeGame.id == game.id ? 'select' : ''}`}>
                          <div className="match-title-text">
                            <span>{game.team1_name}</span>
                            <span>{game.info ? game.info.score1 : ''}</span>
                          </div>
                          <div className="match-title-text match-title-text-x2">
                            <span>{game.team2_name}</span>
                            <span>{game.info ? game.info.score2 : ''}</span>
                          </div>
                          <div className="hidden-icons">
                            <div className="match-time">
                              <div className="match-time-info">
                                {game.info ? currentSet !== 'notstarted' ? currentSet : moment.unix(game.start_ts).format('D MMMM YYYY H:mm') : null} {game.info ? game.info.current_game_time : null}
                              </div>
                              {/* <div  className="goal-alert-msg">Goal!!!</div> */}
                            </div>
                            <span className="add-to-favorite" data-balloon="Add to Favourites" data-balloon-pos="up" data-ember-action="" data-ember-action-224929="224929">
                              <i className="icon-icon-star"></i>
                            </span>
  
                            <div className="sb-accordion-arrow sb-accordion-toggle" data-ember-action="" data-ember-action-224959="224959">
                              <div className="sb-arrow-inner">
                                {!game.is_blocked && (marketSize > 0 && eventSize > 0) ? <i className="icon-icon-arrow-up"></i> : null}
                                {game.is_blocked ? <i className="icon-icon-locked-stream" ></i> : null}
                              </div>
                            </div>
                          </div>
  
                        </div>
                        {(marketSize > 0 && eventSize > 0) ?
                          <div className="sb-accordion-content match-content sportlist-game-accordion" style={{ display: (marketSize > 0 || eventSize > 0) && !game.is_blocked ? 'block' : 'none' }}>
                            <div>
                              <div className="sb-game-bet-block-wrapper">
                                <div className="sb-game-bet-block">
                                  {
                                    events.map((e, i) => {
                                      return (
  
                                        <LiveBtn key={i} sport={sport} competition={competition} region={region} e={e} betSelections={betSelections} game={game} eventMarket={eventMarket} addEventToSelection={addEventToSelection} oddType={oddType} />
                                      )
                                    })
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          : null
                        }
                      </div>
                      : null
                  )
                }
              })
            }
          </div>
        </div>
      )
    }
  }
  export default  withRouter(CompetitionEventGame)