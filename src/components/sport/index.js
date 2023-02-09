import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Region from '../region'
import {stringReplacer} from '../../common'
import { Spring} from 'react-spring/renderprops'
export default class Sport extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        hover: false,
        ignoreActiveSport: false
      };
      this.toggleHover = this.toggleHover.bind(this)
      this.openSport = this.openSport.bind(this)
      this.competitionRef= null
    }
  
    toggleHover() {
      this.setState({ hover: !this.state.hover })
    }
    openSport() {
      if (this.state.ignoreActiveSport === false)
        this.setState(prevState => ({ opened: !prevState.opened, ignoreActiveSport: true }))
      else
        this.setState(prevState => ({ opened: !prevState.opened }))
      if (!this.state.opened && this.competitionRef !==null) {
        //  console.log(this.competitionRef)
         let el = ReactDOM.findDOMNode(this.competitionRef)
        el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
      }
    }
    getTotalGames(region) {
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
      const{activeSport} = this.props.sportsbook
     if( activeSport.name === this.props.sport.name) this.setState(prevState => ({ opened: true, ignoreActiveSport: true })) 
    }
    render() {
      const {opened, hover, ignoreActiveSport } = this.state,{ competitionData, activeSport, competition, competitionRegion, activeView, betSelections,
        gameSets, activeGame, multiviewGames, oddType,allowMultiSelect } = this.props.sportsbook,
        {multiview,addEventToSelection,loadMarkets,sport,loadGames,addToMultiViewGames} = this.props

      var region = [], sportAlias = stringReplacer(sport? sport.alias:'', [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase(),
        totalgames = sport?this.getTotalGames(sport.region):0
      if(sport){
        for (let regionid in sport.region) {
          if (null !== sport.region[regionid])
            region.push(sport.region[regionid])
        }
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
      // console.log(sport);
      return (
        totalgames > 0 ?
          <div className="sports-container">
            <div {...{ className: `sport-header ${sportAlias} ${(!ignoreActiveSport && activeSport.name === sport.name) || (ignoreActiveSport && opened) ? 'select' : ''} ${hover ? 'hover' : ''}`, onClick: () => this.openSport() }} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
              <div {...{ className: `sport-avatar col-sm-2 ${stringReplacer(sport.alias, [/\s/g, /'/g, /-/g, /\d.+?\d/g, /\(.+?\)/g, /\)/g], ['', '', '', '', '', ''])}` }}></div>
              <div className="sport-title col-sm-7"><span>{sport.name}</span></div>
              <div className="sport-accord col-sm-3"><span {...{ className: `text text-show`,style:{width:'50%'}}}>{totalgames}</span><span {...{style:{width:'50%'}, className: `icon-icon-arrow-down icon icon-show col-sm-6 ${(!ignoreActiveSport && activeSport.name === sport.name) ? "icon-up" : (ignoreActiveSport && opened) ? 'icon-up' : ""}` }}>
              </span></div>
            </div>
  
                
                {
                  (!ignoreActiveSport && activeSport.name === sport.name)|| (ignoreActiveSport && opened) &&
                  <div {...{ className: 'region-block-open' }} style={{display:'block',height:'auto'}} >
                    <Spring 
                    from={{minHieght: 0,height:0}}
                    to={{minHieght: 10,height:'auto'}}
                  > 
                  {props=> ( <ul className="sports-region-list"  style={props}>
                    {
    
                      region.map((currentRegion, regId) => {
                        return (
                        <Region ref={(e) => { this.competitionRef = e}} multiview={multiview} addEventToSelection={addEventToSelection} sport={sport} competitionData={competitionData} activeView={activeView} loadMarkets={loadMarkets}
                          region={currentRegion} key={currentRegion.id}
                          loadGames={loadGames} currentCompetition={competition} competitionRegion={competitionRegion} betSelections={betSelections} gameSets={gameSets} activeGame={activeGame}
                          multiviewGames={multiviewGames}
                          addToMultiViewGames={addToMultiViewGames} oddType={oddType} allowMultiSelect={allowMultiSelect}/>
                          )
                      })
                    }
                  </ul>
                
              )}
            </Spring>
              </div>
            }
          </div>
          : null
      )
    }
  }