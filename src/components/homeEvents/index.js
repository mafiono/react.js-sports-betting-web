import React, { PureComponent } from 'react'
import moment from 'moment'
import { stringReplacer, convertSetName } from '../../common'
import SelectableEventBtn from '../../components/selectableEventBtn'
import {SportItem} from '../../components/stateless'
export default class HomepageEvents extends PureComponent{
    constructor(props) {
      super(props)
      this.state = {
        activeID:null,
        hover:false
      }
      this.setSelectedSport = this.setSelectedSport.bind(this)
    }
    componentDidMount() {
  
    }
    componentDidUpdate() {
  
    }
    load(data){
      this.props.history.replace(`/sports/${this.props.is_live?'live':'prematch'}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport.id,region:data.region.id,competition:data.competition.id,game:data.game.id})
    }
    setSelectedSport(id){
     if(id!== this.state.activeID)this.setState({activeID:id})
   }
    render() {
      const{props:{data,betSelections,oddType,addEventToSelection,is_live },state:{activeID,hover}}=this
      let initialData = {},spItems = [],rendableData=[];
      if(data.sport){
        var sport = data.sport
        Object.keys(sport).forEach((sp)=>{
          if(void 0 !== sport[sp] && null !== sport[sp])
          spItems.push({id:sport[sp].id,name:sport[sp].name,alias:sport[sp].alias})
        })
        if(activeID !==null){
          initialData = data.sport[activeID]
        }else{
          initialData = data.sport[Object.keys(data.sport)[0]]
        }
        if(void 0 !==initialData && null !== initialData){
          let reg = initialData.region? initialData.region :null
           if(reg)
           {
            Object.keys(reg).forEach((c)=>{
              let r= reg[c], comp = r &&r.competition?r.competition:null
              if(comp){
                Object.keys(comp).forEach((g)=>{
                  let game =comp[g] ?comp[g].game:null
                  if(game){
                    // if(activeID!==null) console.log(comp[g])
                    Object.keys(game).forEach((m)=>{
                      let market = game[m]?game[m].market:null
                      if(market){
                        for(let mar in market){
                          let marketEvents = {}
                          if (market[mar] && market[mar].type === 'P1XP2') {
                            for (const e in market[mar].event) {
                              const event = {...market[mar].event[e]};
                              if (event) {
                                marketEvents[event.name] = event
                              }
                              
                            }
                            
                            rendableData.push({sport:{id:initialData.id,name:initialData.name,alias:initialData.alias},region:{id:r.id,name:r.name,alias:r.alias},competition:{id:comp[g].id,name:comp[g].name},
                              game:{id:game[m].id,match_length:game[m].match_length,is_live:game[m].is_live,team1_name:game[m].team1_name,team2_name:game[m].team2_name,score1:game[m].info.score1,score2:game[m].info.score2,time:game[m].info.current_game_time,set:convertSetName()(game[m].info.current_game_state, stringReplacer(initialData.alias, [/\s/g], [''])),start_ts:game[m].start_ts},market:{...market[mar],event:null},event:marketEvents,count:game[m].markets_count,col_count:market[mar].col_count})
                            break
                          }
                          else if (market[mar]&&market[mar].type === 'P1P2') {
                            for (const e in market[mar].event) {
                              const event = {...market[mar].event[e]};
                              if (event) {
      
                                marketEvents[event.name] = event
      
                              }
                            }
                            
                            rendableData.push({sport:{id:initialData.id,name:initialData.name,alias:initialData.alias},region:{id:r.id,name:r.name,alias:r.alias},competition:{id:comp[g].id,name:comp[g].name},
                              game:{id:game[m].id,is_blocked:game[m].is_blocked ,match_length:game[m].match_length,is_live:game[m].is_live,team1_name:game[m].team1_name,team2_name:game[m].team2_name,score1:game[m].info.score1,score2:game[m].info.score2,time:game[m].info.current_game_time,set:convertSetName()(game[m].info.current_game_state, stringReplacer(initialData.alias, [/\s/g], [''])),start_ts:game[m].start_ts},market:{...market[mar],event:null},event:marketEvents,count:game[m].markets_count,col_count:market[mar].col_count})
                            break
                          }
                        }
                      }
                       
                     })
                  }
                })
              }
             })
           }
          
        }
      }
      return(
        <React.Fragment>
          <div className="sport-item">
            {
              spItems.map((s,i)=>{
                return(
                 <SportItem s={s} i={i} activeID={activeID} key={i} onClick={this.setSelectedSport}/>
                )
              })
            }
          </div>
          <div className={`events-list-container ${is_live?'live':''}`}>
          {
            rendableData.map((d,i)=>{
              let eventsArr = []
              Object.keys(d.event).forEach((singleEvent, id) => {
                if (null !== d.event[singleEvent]) eventsArr.push(d.event[singleEvent])
              })
              eventsArr.sort((a, b) => {
                if (a.order > b.order) {
                  return 1;
                }
                if (b.order > a.order) {
                  return -1;
                }
                return 0;
              })
              return(
                <div className="event-block inline" key={i} onClick={()=>this.load(d)}>
                  <div className="event-details"style={{flexDirection:is_live?'row':'column'}}>
                      {
                        is_live?
                        <div className="live-event-details">
                        <span>{d.game.set} {d.game.time}</span>
                        <span>
                                {d.game.score1} - {d.game.score2}
                        </span>
                    </div>:
                    <span className="time">{moment.unix(d.game.start_ts).fromNow()}</span>
                      }
                      <span className="competition" title={d.region.name + ' - ' +d.competition.name}>{d.region.name} - {d.competition.name}</span>
                  </div>
                  <div className="event-odds inline">
                    {
                      eventsArr.map((e,index)=>{ 
                        return (
                          <SelectableEventBtn sport={{id:d.sport.id,name:d.sport.name,alias:d.sport.alias}} region={{id:d.region.id,name:d.region.name,alias:d.region.alias}} competition={{id:d.competition.id, name:d.competition.name}} showType={'home'} key={e.id} betSelections={betSelections} game={d.game} market={d.market} data={e} eventLen={eventsArr.length} event_col={d.col_count} addEventToSelection={addEventToSelection}
                            oddType={oddType} />
                        )
                      })
                    }
                  </div>
                  <div className="event-info live  livestream-disabled">
                      <span className="markets-count">+{d.count}</span>
                  </div>
                </div>
              )
            })
          }
          </div>
        </React.Fragment>
      )
    }
  }