import React,{PureComponent} from 'react'
import SelectableEventBtn from '../selectableEventBtn'
export default class Market extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        hideEvents: this.props.marketIndex <5 ?false:true
      }
      this.eventDescription = {
        "To Qualify": "",
        "Match Result": "",
        "Double Chance": "",
        "Draw No Bet": "",
        "Total Goals": "",
        "Team 1 Total Goals": "",
        "Team 2 Total Goals": "",
        "Both Teams To Score": "",
        "Goals Handicap": "",
        "Goals Asian Handicap": "",
        "Goals Handicap 3 Way": "",
        "Total Goals Asian": "",
        "Total Goals Odd/Even": "",
        "Team 1 To Score": "",
        "Team 2 To Score": "",
        "Team 1 To Score and Match Result": "",
        "Team 2 To Score and Match Result": "",
        "Winner in Extra Time": "",
        "Winner by Penalties": "",
        "Anytime Goalscorer": "",
        "First Goalscorer": "",
        "Last Goalscorer": "",
        "Player To Score 2 Or More": "",
        "Player To Score 3 Or More": "",
        "Team 1 First Goalscorer": "",
        "Team 2 First Goalscorer": "",
        "Team 1 Last Goalscorer": "",
        "Team 2 Last Goalscorer": "",
        "Team 1 No Bet": "",
        "Team 2 No Bet": "",
        "Outcome And Both To Score": "",
        "Double Chance And Both To Score": "",
        "Outcome And Total Goals 1.5": "",
        "Outcome And Total Goals 2.5": "",
        "Outcome And Total Goals 3.5": "",
        "Outcome And Total Goals 4.5": "",
        "Outcome or Total Goals ": "",
        "Outcome And Total Goals (Exact)": "",
        "Outcome or Correct Score": "",
        "Team 1 Total Goals (Exact)": "",
        "Team 2 Total Goals (Exact)": "",
        "Total Goals (Bands)": "",
        "Team 1 Win By Exact  Goal": "",
        "Team 2 Win By Exact  Goal": "",
        "Team 1 Will Win and Score Exact  Goal": "",
        "Team 2 Will Win and Score Exact  Goal": "",
        "First Goal Method": "",
        "1st Half Result": "",
        "1st Half Double Chance": "",
        "1st Half Goals Handicap": "",
        "1st Half Goals Asian Handicap": "",
        "1st Half Goals Handicap 3 Way": "",
        "1st Half Total Goals": "",
        "1st Half Total Goals Asian": "",
        "1st Half Team 1 Total Goals": "",
        "1st Half Team 2 Total Goals": "",
        "1st Half Both Teams To Score": "",
        "1st Half Total Goals (Bands)": "",
        "1st Half Team 1 Total Goals (Bands)": "",
        "1st Half Team 2 Total Goals (Bands)": "",
        "1st Half Total Goals (Exact)": "",
        "1st Half Team 1 Total Goals (Exact)": "",
        "1st Half Team 2 Total Goals (Exact)": "",
        "1st Half Team 1 Win By Exact  Goal": "",
        "1st Half Team 2 Win By Exact  Goal": "",
        "1st Half Team 1 To Win To Nil": "",
        "1st Half Team 2 To Win To Nil": "",
        "1st Half First Team to Score": "",
        "1st Half Last Team to Score": "",
        "1st Half Correct Score": "",
        "1st Half Total Goals Odd/Even": "",
        "2nd Half Result": "",
        "2nd Half Double Chance": "",
        "2nd Half Goals Handicap": "",
        "2nd Half Goals Handicap 3 Way": "",
        "2nd Half Total Goals": "",
        "2nd Half Team 1 Total Goals": "",
        "2nd Half Team 2 Total Goals": "",
        "2nd Half Both Teams To Score": "",
        "2nd Half Total Goals (Bands)": "",
        "2nd Half Team 1 Total Goals (Bands)": "",
        "2nd Half Team 2 Total Goals (Bands)": "",
        "2nd Half Total Goals (Exact)": "",
        "2nd Half Team 1 Total Goals (Exact)": "",
        "2nd Half Team 2 Total Goals (Exact)": "",
        "2nd Half Team 1 Win By Exact  Goal": "",
        "2nd Half Team 2 Win By Exact  Goal": "",
        "2nd Half Team 1 To Win To Nil": "",
        "2nd Half Team 2 To Win To Nil": "",
        "2nd Half First Team to Score": "",
        "2nd Half Last Team to Score": "",
        "2nd Half Correct Score": "",
        "2nd Half Total Goals Odd/Even": "",
        "1st Half/2nd Half Both To Score": "",
        "First Team to Score": "",
        "Last Team to Score": "",
        "Half Time/Full-time": "",
        "Correct Score": "",
        "Half With Most Goals": "",
        "Corners: Result": "",
        "Corners: Double Chance": "",
        "Corners: Handicap": "",
        "Corners: Total": "",
        "Corners: Team 1 Total": "",
        "Corners: Team 2 Total": "",
        "Corners: Odd/Even": "",
        "Corners: Race To ": "",
        "Corners: 1st Half Result": "",
        "Corners: 1st Half Asian Handicap": "",
        "Corners: 1st Half Total": "",
        "Corners: 1st Half Team 1 Total": "",
        "Corners: 1st Half Team 2 Total": "",
        "Corners: 2nd Half Result": "",
        "Corners: 2nd Half Total": "",
        "Corners: 2nd Half Team 1 Total": "",
        "Corners: 2nd Half Team 2 Total": "",
        "Corners: First Corner": "",
        "Corners: Last Corner": "",
        "Half With The Most Corners": "",
        "Yellow Cards: Result": "",
        "Yellow Cards: Double Chance": "",
        "Yellow Cards: Handicap": "",
        "Yellow Cards: Total": "",
        "***": "",
        "Yellow Cards: Team 1 Total": "",
        "Yellow Cards: Team 2 Total": "",
        "Yellow Cards: 1st Half Handicap": "",
        "Yellow Cards: First Yellow Card": "",
        "Yellow Cards: Last Yellow Card": "",
        "Player Gets Card": "",
        "Penalty": "",
        "Red Card": "",
        "Own goal": "",
        "Goals In Both Halves": "",
        "Team 1 Score in Both Halves": "",
        "Team 2 Score in Both Halves": "",
        "Team 1 Win Both Halves": "",
        "Team 2 Win Both Halves": "",
        "Team 1 Score in First Half": "",
        "Team 2 Score in First Half": "",
        "Team 1 Score in Second Half": "",
        "Team 2 Score in Second Half": "",
        "Goal in First Half": "",
        "Goal in Second Half": "",
        "Both Half Less Than 1.5 Goal": "",
        "Team 1 To Win To Nil": "",
        "Team 2 To Win To Nil": "",
        "Team 1 Win By Two or Three Goals": "",
        "Team 2 Win By Two or Three Goals": "",
        "Team 1 Win By One Goal or Draw": "",
        "Team 2 Win By One Goal or Draw": "",
        "Team 1 Will Win at Least in One of The Halves": "",
        "Team 2 Will Win at Least in One of The Halves": "",
        "Team 1 Will Win 1st Half and Won't Win The Match": "",
        "Team 2 Will Win 1st Half and Won't Win The Match": "",
        "Team 1 To Score First Half /Second Half": "",
        "Team 2 To Score First Half /Second Half": "",
        "Both Halves Will Win Different Teams": "",
        "1st Half Or Match Result": "",
        "Match Score Draw": "",
        "Exact Number Of Goals": "",
        "Exactly 1 Goal in The Match": "",
        "Exactly 2 Goal in The Match": "",
        "Exactly 3 Goal in The Match": "",
        "Exactly 4 Goal in The Match": "",
        "Team 1 Winning Margin": "",
        "Team 2 Winning Margin": "",
        "Score Combinations": "",
        "1-15 Min. Winner": "",
        "1-15 Min. Goals Handicap": "",
        "1-15 Min. Total Goals": "",
        "1-15 Min. Team 1 Total Goals": "",
        "1-15 Min. Team 2 Total Goals": "",
        "1-30 Min. Winner": "",
        "1-30 Min. Goals Handicap": "",
        "1-30 Min. Total Goals": "",
        "1-30 Min. Team 1 Total Goals": "",
        "1-30 Min. Team 2 Total Goals": "",
        "1-60 Min. Winner": "",
        "1-60 MIn. Goals Handicap": "",
        "1-60 Min. Total Goals": "",
        "1-60 Min. Team 1 Total Goals": "",
        "1-60 Min. Team 2 Total Goals": "",
        "1-75 Min. Winner": "",
        "1-75 Min. Goals Handicap": "",
        "1-75 Min. Total Goals": "",
        "1-75 Min. Team 1 Total Goals": "",
        "1-75 Min. Team 2 Total Goals": "",
        "Chance Mix": "",
        "Double Chance Combo": "",
        "Both Teams To Score And Total Goals 2.5": "",
        "Both Teams To Score And Total Goals 3.5": "",
        "First Team To Score And Match Result": ""
      };
    }
    render() {
      const {
        props: {sport,region,competition, market, activeGame, addEventToSelection, betSelections, activeGameSuspended, oddType },
        state: { hideEvents }
      } = this
      let marketDataArr = [], cashout = 0,  groupId, expressId
      Object.keys(market.data).forEach((event, key) => {
        marketDataArr.push(market.data[event])
        cashout = market.data[event].cashout
        
        expressId = market.data[event].express_id
        groupId = market.data[event].type
      })
      return (
        !activeGameSuspended ?
          <div className="event">
            <div className={`event-header ${hideEvents ? 'closed' : ''}`} data-title={activeGame ? market.name.replace(/Team 1/gi, activeGame.team1_name).replace(/Team 2/gi, activeGame.team2_name) : ''} onClick={() => { this.setState(prevState => ({ hideEvents: !prevState.hideEvents })) }}>
            <i className="icon-icon-info"></i>
              {
                activeGame ?
                  <ul className="market-icons">
                    {void 0 !==expressId && <li className="link-icon-market" title="Events from different groups can be combined in combined bets">{expressId}</li>}
                    {cashout===1 && <li className="cashout-icon-market" title="Cash-out available" ></li> }
                  </ul>
                  : null
              }
            </div>
            <div className={`event-data`} style={{ display: hideEvents ? 'none' : 'block' }}>
              {
                marketDataArr.map((event, key) => {
                  var eventArr = []
                  if (null !== event && event.hasOwnProperty('event')) {
                    Object.keys(event.event).forEach((singleEvent, id) => {
                      if (null !== event.event[singleEvent]) eventArr.push(event.event[singleEvent])
                    })
                  } 
                  eventArr.sort((a, b) => {
  
                    if (a.order > b.order)
                      return 1
                    if (b.order > a.order)
                      return -1
                    return 0
                  })
                  return (
  
                    <div {...{ className: `event-item-col-${event.col_count||'3'}` }} key={event.id}>
                      {
                        activeGame ?
                          eventArr.map(
                            (eventData, index) => {
                              var evtmarket = { ...event }
                              delete evtmarket.event
                              return (
                                <SelectableEventBtn key={index} sport={{id:sport.id,name:sport.name,alias:sport.alias}} region={{id:region.id,name:region.name,alias:region.alias}} competition={{id:competition.id, name:competition.name}} betSelections={betSelections} game={activeGame} groupId={groupId} market={evtmarket} data={eventData} eventLen={eventArr.length} event_col={event.col_count|| '3'} addEventToSelection={addEventToSelection}
                                  oddType={oddType} />
                              )
                            }
                          )
                          : null
                          }
                    </div>
  
                  )
                })
              }
             
            </div>
          </div>
          :
          <div className="game-status">
            <div className="icon icon-icon-locked-stream"></div>
            <div className="message">This game is suspended.</div>
          </div>
      )
    }
  }