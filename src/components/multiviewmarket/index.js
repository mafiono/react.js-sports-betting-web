import React,{PureComponent} from 'react'
import { MultiviewMarketLoader } from '../loader'
 import Market from '../market'
 import {
   StatsBannerSoccer,
  StatsBannerBasketBall,
  StatsBannerTennis
} from '../statsBanner'
import {stringReplacer} from '../../common'
export default class MultiviewMarket extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        draggedOver: false
      }
      this.onSuccess = this.onSuccess.bind(this)
    }
    componentDidMount() {
  
    }
    componentDidUpdate() {
  
    }
    onDragOver(e) {
      e.preventDefault()
      this.setState({ draggedOver: true })
    }
    onDragLeave(e) {
      e.preventDefault()
      this.setState({ draggedOver: false })
    }
    onDrop(e, game) {
      e.preventDefault()
      let id = JSON.parse(e.dataTransfer.getData("text")), oldId = game
      this.props.removeMultiViewGame(oldId, id.id, this.onSuccess)
    }
    onSuccess() {
      this.setState({ draggedOver: false })
    }
    render() {
      const {
        props: { gameSets, loadMarkets, activeSport, activeGame, addEventToSelection, betSelections, activeGameSuspended, marketDataArr, loadMarket, competition,
          region, removeMultiViewGame, oddType }
        , state: { draggedOver }
      } = this
  
      const sportAlias = stringReplacer(activeSport.alias, [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase(), activeView = 'Live';
      return (
        draggedOver ?
        <div className="droppable" onDrop={(e) => { this.onDrop(e, activeGame.id) }} onDragLeave={(e) => { this.onDragLeave(e) }}>
          <div className="dotted-border">
            <MultiviewMarketLoader />
          </div>
        </div>
        :
        <div data-game={activeGame.id} data-competition={competition.id} className={`market ${activeView == "Live" ? "live col-sm-6" : ''}`} onDragOver={(e) => { this.onDragOver(e) }} >
          <div className="market-container">
            <div {...{ className: `sport-header ${sportAlias} select` }} >
              <div {...{ className: `sport-avatar col-sm-2 ${stringReplacer(activeSport.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}` }}></div>
              <div className="sport-title col-sm-8">{activeSport.name} - {region.name} ({competition.name})</div>
              <div className="sport-accord col-sm-2"><span {...{ className: `icon-icon-match-live` }}></span><span {...{ className: `close uci-close`, onClick: () => { removeMultiViewGame(activeGame.id) } }}>
              </span>
              </div>
            </div>
            {
              activeSport.id == 1 ?
                <StatsBannerSoccer activeSport={activeSport} activeGame={activeGame} gameSets={gameSets} loadMarket={loadMarket} />
                : activeSport.id == 3 ?
                  <StatsBannerBasketBall activeSport={activeSport} activeGame={activeGame} gameSets={gameSets} loadMarket={loadMarket} />
                  : activeSport.id == 4 ?
                    <StatsBannerTennis activeSport={activeSport} activeGame={activeGame} gameSets={gameSets} loadMarket={loadMarket} />
                    : null
            }

            <div className="market-event-container">
              <div className={`scrollable ${loadMarket ? 'loading-view' : ''}`}>
                {activeView == "Live" ?
                  <div className="sb-game-markets-game-info">
                    <i className="icon-icon-info"></i>
                    <span className="game-info-text">{activeGame ? activeGame.text_info : null}</span>
                  </div>
                  : null}

                {!loadMarket ?
                  <div>
                    <div>
                      {marketDataArr.length > 0 ?
                        <div className={`events-list`}>
                          <div className="col-sm-12">
                          {
                            marketDataArr.map((market, key) => {
                              var elRef = React.createRef();
                              return (

                                <Market ref={elRef} key={market.data[0].id} activeGameSuspended={activeGameSuspended} activeGame={activeGame} market={market} addEventToSelection={addEventToSelection} betSelections={betSelections} oddType={oddType} />
                              )
                            })

                          }
                          </div>
                        </div>
                        : null
                      }
                    </div>
                    <div className="sb-indicator-message">
                      <span>
                        The time display shown within live betting serves as an indicator. The company takes no responsibility for the correctness and currentness of the displayed information like score or time.
    </span>
                      <br />
                    </div>

                  </div> :
                  <MultiviewMarketLoader />}
              </div>
            </div>
            <div className="goto-link">
              <a onClick={() => { loadMarkets(activeGame, activeSport, region, competition, 0) }}>
                <i className="icon-go-to-link"></i>
                OPEN THIS EVENT
           </a>
            </div>
          </div>
        </div>
  
      )
    }
  }