import React, { PureComponent } from 'react'
import OverviewCompetitionEventGame from '../overviewCompetitionEventGame'
export default class OverviewCompetition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
    this.selectCompetition = this.selectCompetition.bind(this)
  }

  selectCompetition() {
    this.setState(prevState => ({ isSelected: !prevState.isSelected }))
  }
  render() {
    const {
      props: { competition, routerHistory, region, sport, loadMarkets, addEventToSelection, betSelections, activeGame, setActiveGame, oddType,activeView}
    } = this
    return (
      <li className={`competition-block live`}>
        <div className="events">
          <OverviewCompetitionEventGame routerHistory={routerHistory} oddType={oddType} setActiveGame={setActiveGame} activeGame={activeGame} games={competition.game} activeView={activeView} loadMarkets={loadMarkets} sport={sport} region={region} competition={competition} addEventToSelection={addEventToSelection} betSelections={betSelections} />
        </div>
      </li>
    )
  }
}