import React, { Component } from 'react'
import {
    stringReplacer,
    convertSetName,
  
  } from '../../common'
   import moment from 'moment'
   import 'moment/locale/fr'
export class StatsBannerSoccer extends Component {

    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        return (
            activeGame.stats ?
            <div className={`live-game-teams-stats`}>
                <div className={`stats-header`}>
                    <div className="title">{activeGame ? activeGame.info ? convertSetName()(activeGame.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : null : null} {activeGame ? activeGame.info ? activeGame.info.current_game_time : null : null}</div>
                    <div className="corners icon-icon-corner"></div>
                    <div className="yellow-card icon-icon-cards-yellowred" style={{ color: '#d9ab1f' }}></div>
                    <div className="red-card icon-icon-cards-yellowred" style={{ color: '#d1191f' }}></div>
                    <div className="penalty icon-icon-penalty"></div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>1</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>2</div>
                    <div className="score">Score</div>
                </div>
                <div className={`stats-teams ${loadMarket || !activeGame ? 'element-loading' : ''}`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
                    <div className="title"><span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '' }}></span><span>{activeGame ? activeGame.team1_name : null}</span></div>
                    <div className="corners">{activeGame ? activeGame.stats.corner ? activeGame.stats.corner.team1_value : 0 : null}</div>
                    <div className="yellow-card">{activeGame ? activeGame.stats.yellow_card ? activeGame.stats.yellow_card.team1_value : 0 : null}</div>
                    <div className="red-card">{activeGame ? activeGame.stats.red_card ? activeGame.stats.red_card.team1_value : 0 : null}</div>
                    <div className="penalty">{activeGame ? activeGame.stats.penalty ? activeGame.stats.penalty.team1_value : 0 : null}</div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set1 ? activeGame.stats.score_set1.team1_value : 0 : null}</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set2 ? activeGame.stats.score_set2.team1_value : 0 : null}</div>
                    <div className="score">{activeGame ? activeGame.info.score1 : null}</div>
                </div>
                <div className={`stats-teams ${loadMarket || !activeGame ? 'element-loading' : ''}`}>
                    <div className="title"><span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></span><span>{activeGame ? activeGame.team2_name : null}</span></div>
                    <div className="corners">{activeGame ? activeGame.stats.corner ? activeGame.stats.corner.team2_value : 0 : null}</div>
                    <div className="yellow-card">{activeGame ? activeGame.stats.yellow_card ? activeGame.stats.yellow_card.team2_value : 0 : null}</div>
                    <div className="red-card">{activeGame ? activeGame.stats.red_card ? activeGame.stats.red_card.team2_value : 0 : null}</div>
                    <div className="penalty">{activeGame ? activeGame.stats.penalty ? activeGame.stats.penalty.team2_value : 0 : null}</div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : 'hidden' : ''}`}>{activeGame ? activeGame.stats.score_set1 ? activeGame.stats.score_set1.team2_value : 0 : null}</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : 'hidden' : ''}`}>{activeGame ? activeGame.stats.score_set2 ? activeGame.stats.score_set2.team2_value : 0 : null}</div>
                    <div className="score">{activeGame ? activeGame.info.score2 : null}</div>
                </div>
            </div>:
            <div><span></span></div>
        )
    }
}
export class StatsBannerTennis extends Component {
    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        return (
            <div className={`live-game-teams-stats`}>
                <div className={`stats-header`}>
                    <div className="title">{activeGame ? activeGame.info ? convertSetName()(activeGame.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : null : null} {activeGame ? activeGame.info ? activeGame.info.current_game_time : null : null}</div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>1</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>2</div>
                    <div className={`third-half-score ${activeGame ? activeGame.stats.score_set3 && (activeGame.info.current_game_state === 'set3' || activeGame.info.current_game_state === 'set4') ? '' : "hidden" : ''}`}>3</div>
                    <div className={`forth-half-score ${activeGame ? activeGame.stats.score_set4 ? '' : "hidden" : ''}`}>4</div>
                    <div className="score">Set</div>
                    <div className="score">Pts</div>
                    <div className="winner"></div>
                </div>
                <div className={`stats-teams ${loadMarket || !activeGame ? 'element-loading' : ''}`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
                    <div className="title"><span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '' }}></span><span>{activeGame ? activeGame.team1_name : null}</span></div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set1 ? activeGame.stats.score_set1.team1_value : 0 : null}</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set2 ? activeGame.stats.score_set2.team1_value : 0 : null}</div>
                    <div className={`third-half-score ${activeGame ? activeGame.stats.score_set3 && (activeGame.info.current_game_state === 'set3' || activeGame.info.current_game_state === 'set4') ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set3 ? activeGame.stats.score_set3.team1_value : 0 : null}</div>
                    <div className={`forth-half-score ${activeGame ? activeGame.stats.score_set4 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set4 ? activeGame.stats.score_set4.team1_value : 0 : null}</div>
                    <div className="score">{activeGame ? activeGame.info.score1 : null}</div>
                    <div className="score">{activeGame ? activeGame.stats.passes ? activeGame.stats.passes.team1_value : 0 : null}</div>
                    <div className="winner">
                        <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', marginTop: '8px', backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team === 'team1' ? '#333' : '#e7e7e7' : '#e7e7e7' }}></span>
                    </div>
                </div>
                <div className={`stats-teams ${loadMarket || !activeGame ? 'element-loading' : ''}`}>
                    <div className="title"><span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></span><span>{activeGame ? activeGame.team2_name : null}</span></div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set1 ? activeGame.stats.score_set1.team2_value : 0 : null}</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set2 ? activeGame.stats.score_set2.team2_value : 0 : null}</div>
                    <div className={`third-half-score ${activeGame ? activeGame.stats.score_set3 && (activeGame.info.current_game_state == 'set3' || activeGame.info.current_game_state == 'set4') ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set3 ? activeGame.stats.score_set3.team2_value : 0 : null}</div>
                    <div className={`forth-half-score ${activeGame ? activeGame.stats.score_set4 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set4 ? activeGame.stats.score_set4.team2_value : 0 : null}</div>
                    <div className="score">{activeGame ? activeGame.info.score2 : null}</div>
                    <div className="score">{activeGame ? activeGame.stats.passes ? activeGame.stats.passes.team2_value : 0 : null}</div>
                    <div className="winner">
                        <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', marginTop: '8px', backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team === 'team2' ? '#333' : '#e7e7e7' : '#e7e7e7' }}></span>
                    </div>
                </div>
            </div>
        )
    }
}
export class StatsBannerBasketBall extends Component {
    render() {
        const {
            props: { activeGame, activeSport, loadMarket }
        } = this
        let currentSet = activeGame && activeGame.info ? convertSetName()(activeGame.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : ''
        return (
            <div className={`live-game-teams-stats`}>
                <div className={`stats-header`}>
                    <div className="title">{activeGame ? activeGame.info ? currentSet !== 'notstarted' ? currentSet : moment.unix(activeGame.start_ts).format('D MMMM YYYY H:mm') : null : null} {activeGame ? activeGame.info ? activeGame.info.current_game_time : null : null}</div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>1</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>2</div>
                    <div className={`third-half-score ${activeGame ? activeGame.stats.score_set3 ? '' : "hidden" : ''}`}>3</div>
                    <div className={`forth-half-score ${activeGame ? activeGame.stats.score_set4 ? '' : "hidden" : ''}`}>4</div>
                    <div className="score">Total</div>
                    <div className="winner"></div>
                </div>
                <div className={`stats-teams ${loadMarket || !activeGame ? 'element-loading' : ''}`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
                    <div className="title"><span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '' }}></span><span>{activeGame ? activeGame.team1_name : null}</span></div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set1 ? activeGame.stats.score_set1.team1_value : 0 : null}</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set2 ? activeGame.stats.score_set2.team1_value : 0 : null}</div>
                    <div className={`third-half-score ${activeGame ? activeGame.stats.score_set3 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set3 ? activeGame.stats.score_set3.team1_value : 0 : null}</div>
                    <div className={`forth-half-score ${activeGame ? activeGame.stats.score_set4 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set4 ? activeGame.stats.score_set4.team1_value : 0 : null}</div>
                    <div className="score">{activeGame ? activeGame.info.score1 : null}</div>
                    <div className="winner">
                        <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', marginTop: '8px', backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team1' ? '#333' : '#e7e7e7' : '#e7e7e7' }}></span>
                    </div>
                </div>
                <div className={`stats-teams ${loadMarket || !activeGame ? 'element-loading' : ''}`}>
                    <div className="title"><span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></span><span>{activeGame ? activeGame.team2_name : null}</span></div>
                    <div className={`first-half-score ${activeGame ? activeGame.stats.score_set1 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set1 ? activeGame.stats.score_set1.team2_value : 0 : null}</div>
                    <div className={`second-half-score ${activeGame ? activeGame.stats.score_set2 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set2 ? activeGame.stats.score_set2.team2_value : 0 : null}</div>
                    <div className={`third-half-score ${activeGame ? activeGame.stats.score_set3 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set3 ? activeGame.stats.score_set3.team2_value : 0 : null}</div>
                    <div className={`forth-half-score ${activeGame ? activeGame.stats.score_set4 ? '' : "hidden" : ''}`}>{activeGame ? activeGame.stats.score_set4 ? activeGame.stats.score_set4.team2_value : 0 : null}</div>
                    <div className="score">{activeGame ? activeGame.info.score2 : null}</div>
                    <div className="winner">
                        <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', marginTop: '8px', backgroundColor: activeGame ? activeGame.info.pass_team && activeGame.info.pass_team == 'team2' ? '#333' : '#e7e7e7' : '#e7e7e7' }}></span>
                    </div>
                </div>
            </div>
        )
    }
}