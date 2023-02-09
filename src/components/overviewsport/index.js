import React, { PureComponent } from 'react'
import RegionCompetition from '../regionCompetitions'
import {stringReplacer} from '../../common'
export default class OverviewSport extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        hover: false,
        ignoreActiveSport: false
      };
      this.toggleHover = this.toggleHover.bind(this)
      this.openSport = this.openSport.bind(this)
    }
  
    toggleHover() {
      this.setState({ hover: !this.state.hover })
    }
    openSport() {
      if (this.state.ignoreActiveSport === false)
        this.setState(prevState => ({ opened: !prevState.opened, ignoreActiveSport: true }))
      else
        this.setState(prevState => ({ opened: !prevState.opened }))
    }
    getTotalGames (region){
      var size = 0;
      for (let reg in region) {
        if (null !== region[reg]) {
  
          var competition = region[reg].competition;
          for (let compete in competition) {
            // console.log(competition[compete].game)
            if (null !== competition[compete]) {
              if (null !== competition[compete].game)
                size += Object.keys(competition[compete].game).length;
            }
          }
        }
      }
      return size;
    }
    componentDidMount() {
     if( this.props.activeSport.name === this.props.sport.name) this.setState(prevState => ({ opened: true, ignoreActiveSport: true }))
    }
    render() {
      const {
        props: { addEventToSelection, sport, loadGames, competitionData, activeSport, competition, competitionRegion, activeView, loadMarkets,
          betSelections, gameSets, activeGame, setActiveGame, oddType,routerHistory }
        ,
        state: { opened, hover, ignoreActiveSport }
      } = this;
      var region = [], sportAlias = stringReplacer(sport.alias, [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase(),
        totalgames = this.getTotalGames(sport.region)
      for (let regionid in sport.region) {
        if (null !== sport.region[regionid])
          region.push(sport.region[regionid])
      }
      region.sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        }
        if (b.order > a.order) {
          return -1;
        }
        return 0;
      })
      return (
        totalgames > 0 ?
          <div className="sports-container">
            <div {...{ className: `sport-header ${sportAlias} ${(!ignoreActiveSport && activeSport.name === sport.name) || (ignoreActiveSport && opened) ? 'select' : ''} ${hover ? 'hover' : ''}`, onClick: () => this.openSport() }} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
              <div {...{ className: `sport-avatar col-sm-2 ${stringReplacer(sport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}` }}></div>
              <div className="sport-title col-sm-8">{sport.name}</div>
              <div className="sport-accord col-sm-3"><span {...{ className: `text text-show` ,style:{width:'50%'}}}>{totalgames}</span><span {...{style:{width:'50%'}, className: `icon-icon-arrow-down icon icon-show ${(!ignoreActiveSport && activeSport.name == sport.name) ? "icon-up" : (ignoreActiveSport && opened) ? 'icon-up' : ""}` }}>
              </span></div>
            </div>
            {/* <Transition
             items={(!ignoreActiveSport && activeSport.name == sport.name) || (ignoreActiveSport && opened) }
             from={{height:0}}
             enter={{height:'auto'}}
             leave={{height:0}}
            > */}
              {
  (!ignoreActiveSport && activeSport.name === sport.name) || (ignoreActiveSport && opened) &&
  <div {...{ className: 'region-block-open' }} style={{ display:  'block',height:'auto'}}>
    <ul className="sports-region-list">
      {

        region.map((currentRegion, regId) => {
          return (
          <RegionCompetition routerHistory={routerHistory} addEventToSelection={addEventToSelection} sport={sport} competitionData={competitionData} activeView={activeView} loadMarkets={loadMarkets} region={currentRegion} key={regId}
            oddType={oddType} loadGames={loadGames} setActiveGame={setActiveGame} currentCompetition={competition} competitionRegion={competitionRegion} betSelections={betSelections} gameSets={gameSets} activeGame={activeGame} />
            )
        })
      }
    </ul>
  </div>
  // )
}
            {/* </Transition> */}
          </div>
          : null
      )
    }
  }