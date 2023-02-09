import React, { PureComponent } from 'react'
import CompetitionEventGame from '../competitionEventGame'
import {withRouter} from 'react-router-dom'
class Competition extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isSelected: false,
      };
      this.selectCompetition = this.selectCompetition.bind(this)
      this.openGameToView = this.openGameToView.bind(this)
    }
  
    selectCompetition() {
      this.setState(prevState => ({ isSelected: !prevState.isSelected }))
    }
    openGameToView(competition,region,sport){
      //  const activeView=this.props.activeView,view =activeView === 'Home' || activeView === 'Live'
      this.props.history.replace(`/sports/prematch/${sport.alias}/${region.name}/${competition.id}`,{sport:sport.id,region:region.id,competition:competition.id})
    }
    render() {
      const{ multiview, competition, loadGames, gameSets, region, sport, currentCompetition, activeView, loadMarkets, addEventToSelection, betSelections, activeGame,
          addToMultiViewGames, multiviewGames, oddType ,allowMultiSelect
      } = this.props
      let dontshowCompetion = 0;
      multiviewGames.map((g) => {
        if (competition.game[g]) {
         dontshowCompetion += 1
        }
        return g
      })
      return (
        (activeView !== "Live" && activeView!=='Multiview')?
          <li className={`competition-block ${currentCompetition ? currentCompetition === competition.id ? 'active' : '' : ''}`} onClick={() => activeView !== 'Prematch' ?this.openGameToView(competition, region, sport):currentCompetition && currentCompetition === competition.id ? null : loadGames(competition, region, sport)}>
            <div className={`header match-league ${activeView==='Prematch' && allowMultiSelect &&'multiselect-icon'}`}>
              {activeView==='Prematch' && allowMultiSelect&&<input type="checkbox" />}
              <span className='match-league-title-text'> <span style={{margin:activeView==='Prematch' && allowMultiSelect &&'0 15px'}}>{competition.name}</span></span>
              </div>
              {activeView==='Prematch' && allowMultiSelect&&<div className="multiselect-menu">
                <div className="sub-menu-contain-multiselect">
                  <div>
                    
                  </div>
                </div>
              </div>}
          </li>
          :
          dontshowCompetion !== Object.keys(competition.game).length ?
            <li className={`competition-block live ${currentCompetition ? currentCompetition === competition.id ? 'select' : '' : ''}`}>
              {activeView!=="Live" && activeView!=='Multiview' &&<div className="header match-league"><span className='match-league-title-text'>{competition.name}</span></div>}
              <div className="events">
                <CompetitionEventGame multiview={multiview} activeGame={activeGame} games={competition.game} gameSets={gameSets} loadMarkets={loadMarkets} sport={sport} region={region} competition={competition}
                  addEventToSelection={addEventToSelection} betSelections={betSelections} addToMultiViewGames={addToMultiViewGames} multiviewGames={multiviewGames} oddType={oddType}activeView={activeView} />
              </div>
            </li>
            : null
      )
    }
  }
  export default withRouter(Competition)