import React, { PureComponent } from 'react'
import Competition from '../competition'
import { CompetitionLive } from '../competitionLive';
import {Spring } from 'react-spring/renderprops';
export default class Region extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        ignoreActiveRegion: false,
        hover: false
      };
      this.showCompetition = this.showCompetition.bind(this)
      this.toggleHover = this.toggleHover.bind(this)
    }
    showCompetition() {
  
      this.setState(prevState => ({ opened: !prevState.opened, ignoreActiveRegion: true }))
    }
    toggleHover() {
      this.setState({ hover: !this.state.hover })
  
    }
    componentDidUpdate() {
      if(this.props.competitionRegion.id === this.props.region.id && (!this.state.ignoreActiveRegion && !this.state.opened) )
      this.setState(prevState => ({ opened: !prevState.opened }))
    }
  
    render() {
      const {
        props: { multiview, region, loadGames, gameSets, currentCompetition, competitionRegion, sport, activeView, loadMarkets, competitionData, addEventToSelection, betSelections,
          activeGame, addToMultiViewGames, multiviewGames, oddType,allowMultiSelect }
        ,
        state: { opened, hover, ignoreActiveRegion }
      } = this
  
      var competition = region.competition, regionTotalGames = 0, competitionArr = [];
      for (let compete in competition) {
        if (null !== competition[compete]) {
          regionTotalGames += Object.keys(competition[compete].game).length
          competitionArr.push(competition[compete])
        }
      }
      competitionArr.sort((a, b) => {
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })
    //  console.log(JSON.stringify(region));
      return (
  
        regionTotalGames > 0 ?
          activeView !== 'Live' && activeView!=='Multiview'?
          <li>
            <div {...{ className: `region-header ${((!ignoreActiveRegion && competitionRegion.id === region.id) || (ignoreActiveRegion && opened)) && 'select'}`, onClick: () => { this.showCompetition() } }} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
              <span {...{ className: `region-icon flag-icon flag-${region.alias ? region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }} style={{height: window.screen.width>1366 && '19px'}}></span><span className="region-name">{region.name} </span><span {...{ className: `total-games text` }}> <span {...{ className: `text ${(competitionRegion.id === region.id) || hover || opened ? "text-hide" : "text-show"}` }}>{regionTotalGames}</span>
                <span {...{ className: `icon-icon-arrow-down icon ${(!ignoreActiveRegion && competitionRegion.id === region.id) || hover ? "icon-show" : (ignoreActiveRegion && opened) || hover ? 'icon-show' : "icon-hide"} ${(!ignoreActiveRegion && competitionRegion.id === region.id) ? "icon-up" : (ignoreActiveRegion && opened) ? 'icon-up' : ""}` }}>
                </span></span>
  
            </div>
           {((!ignoreActiveRegion && competitionRegion.id === region.id) ||(ignoreActiveRegion && opened)) &&
              <div className={`region-competition`}>
                <Spring
                from={{minHeight:0,height:0}}
                to={{minHeight:10,height:'auto'}}
                
            > 
            {
             props => ( <ul className="competition-list" style={props}>
                  {
                    competitionArr.map((competition) => {
                      return (
                        <Competition key={competition.id} multiview={multiview} allowMultiSelect={allowMultiSelect} loadMarkets={loadMarkets} region={{ id: region.id, name: region.name, alias: region.alias }} sport={{ id: sport.id, name: sport.name, alias: sport.alias }} activeView={activeView}
                          currentCompetition={currentCompetition} activeGame={activeGame} gameSets={gameSets} competitionData={competitionData} competition={competition}  loadGames={loadGames}
                          addEventToSelection={addEventToSelection} betSelections={betSelections} addToMultiViewGames={addToMultiViewGames} multiviewGames={multiviewGames} oddType={oddType}/>
                      )
                    })
                  }
                </ul>
              )
            }
          </Spring>
              </div>
          }
          </li>
          :
          competitionArr.map((competition, competeID) => {
            return (
              <CompetitionLive key={competeID}  region={region} competitionRegion={competitionRegion} cProps={{ multiview:multiview, loadMarkets:loadMarkets, region:{ id: region.id, name: region.name, alias: region.alias }, sport:{ id: sport.id, name: sport.name, alias: sport.alias } ,activeView:activeView,
              currentCompetition:currentCompetition, activeGame:activeGame, gameSets:gameSets, competitionData:competitionData, competition:competition ,loadGames:loadGames,
              addEventToSelection:addEventToSelection, betSelections:betSelections,addToMultiViewGames:addToMultiViewGames, multiviewGames:multiviewGames , oddType:oddType}}/>
            )
          })
          : null
  
      )
  
    }
  }