import React from 'react'

export const AppLoader=()=>{
          return (
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          )  
}
export const Loader=()=>{
          return (
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          )  
}
export const SportListLoader = (props) => {
  return (
    <React.Fragment>
      {
        !props.live ?
          <div className="sports-container">
            <div className="sport-header favorite-competitions select">
              <div className="sport-avatar col-sm-2 favoritecompetitions"></div>
              <div className="sport-title col-sm-9">Top Leagues</div>
              <div className="sport-accord col-sm-2"><span className="icon-icon-arrow-down icon icon-show col-sm-1 icon-up"></span></div>
            </div>
            <div className="region-block-open" style={{ display: 'block' }}>
              <ul className="sports-region-list">
                <li className="competition-block ">
                  <div className="header popular-league">
                    <span className="sport-avatar"></span>
                    <span className="match-league-title-text">No Results</span>
                    <span className="region-icon"></span>
                  </div>
                </li>
              </ul>
            </div>
          </div> :
          null
      }
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className={`icon-icon-arrow-down icon icon-show ${props.live ? 'icon-up' : ''}`}></span>
          </div>
        </div>
        {
          props.live ?
            [1, 2].map((d, i) => {
              return (
                <div key={i} className="region-block-open" style={{ display: 'block' }}>
                  <ul className="sports-region-list">
                    <li>
                      <div className="region-header select">
                        <span className="region-name"><div className="g-loading medium gradient"></div></span>
                        <span className="total-games text"> <span className="text"></span><span className="icon-icon-arrow-down icon icon-show col-sm-1 icon-up"></span></span>
                      </div>
                      <div className="region-competition show" style={{ display: 'block' }}>
                        <ul className="competition-list">
                          <li className="competition-block live select">
                            
                            <div className="events">
                              <div className="sportlist-competition-accordion">
                                <div className="sb-accordion-container">
                                  <div className="sb-accordion-item match open">
                                    <div className="sb-accordion-title match-title">
                                      <div className="match-title-text"><span><div className="g-loading large gradient"></div></span><span style={{ marginTop: "5px" }}><div className="g-loading small gradient"></div></span></div>
                                      <div className="match-title-text match-title-text-x2"><span><div className="g-loading large gradient"></div></span><span style={{ marginTop: "5px" }}><div className="g-loading small gradient"></div></span></div>
                                      <div className="hidden-icons">
                                        <div className="match-time">
                                          <div className="match-time-info"><div className="g-loading small gradient"></div></div>
                                        </div>
                                        <span className="add-to-favorite"><i className="icon-icon-star"></i></span>
                                        <div className="sb-accordion-arrow sb-accordion-toggle">
                                          <div className="sb-arrow-inner"><i className="icon-icon-arrow-up"></i></div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="sb-accordion-content match-content sportlist-game-accordion" style={{ display: "block" }}>
                                      <div>
                                        <div className="sb-game-bet-block-wrapper">
                                          <div className="sb-game-bet-block">
                                            <div className="sb-game-bet-block-inner coeficiente-change-up" style={{ height: "30px" }}>
                                              <div className="sb-game-bet-type"></div>
                                              <div className="sb-game-bet-coeficiente"></div>
                                            </div>
                                            <div className="sb-game-bet-block-inner coeficiente-change-down" style={{ height: "30px" }}>
                                              <div className="sb-game-bet-type"></div>
                                              <div className="sb-game-bet-coeficiente"></div></div>
                                            <div className="sb-game-bet-block-inner coeficiente-change-up" style={{ height: "30px" }}>
                                              <div className="sb-game-bet-type"></div>
                                              <div className="sb-game-bet-coeficiente"></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              )
            })
            : null
        }
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>
      <div className="sports-container bg-grey">
        <div className="sport-header bg-grey">
          <div className="sport-title col-sm-9 flex">
            <div className="g-loading large gradient"></div>
          </div>
          <div className="sport-accord col-sm-2 flex">
            <span className="text text-show g-loading small gradient"></span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
}
export const MarketLoader = (props) => {
  return (
    <React.Fragment>
      <div className="game-info banner-image">
        {props.activeView !== "Live" ?
          <React.Fragment>
            <div className="game-date-time ">
              <span className="date"><div className="g-loading large gradient"></div></span>
              <span className="time"><div className="g-loading medium gradient"></div></span>
            </div>
            <div className="game-teams-competition-wrapper">
            <div className="game-teams-competition team-1">
              <span className="teams">
                <span className="w1"><div className="g-loading medium gradient"></div></span>
              </span>
              
            </div>
            <div className="game-teams-competition team-vs">
              <span className="teams"> 
                <span className="vs"><div className="g-loading small gradient"></div></span> 
              </span>
            
            </div>
            <div className="game-teams-competition team-2 ">
              <span className="teams">
                <span className="w2"><div className="g-loading medium gradient"></div></span>
              </span>
              
            </div>
            </div>
          </React.Fragment>
          :
          <div className={`live-game-teams-stats`}>
            <div className={`stats-header`}>
              <div className="title"><div className="g-loading large gradient"></div></div>
              <div className={`first-half-score`}></div>
              <div className={`second-half-score`}></div>
              <div className={`third-half-score`}></div>
              <div className={`forth-half-score`}></div>
              <div className="score"><div className="g-loading medium gradient"></div></div>

            </div>
            <div className={`stats-teams`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
              <div className="title"><div className="g-loading large gradient"></div></div>
              <div className={`first-half-score`}></div>
              <div className={`second-half-score`}></div>
              <div className={`third-half-score`}></div>
              <div className={`forth-half-score`}></div>
              <div className="score"><div className="g-loading medium gradient"></div></div>
            </div>
            <div className={`stats-teams`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
              <div className="title"><div className="g-loading large gradient"></div></div>
              <div className={`first-half-score`}></div>
              <div className={`second-half-score`}></div>
              <div className={`third-half-score`}></div>
              <div className={`forth-half-score`}></div>
              <div className="score"><div className="g-loading medium gradient"></div></div>
            </div>
          </div>
        }
      </div>
      {props.activeView === "Live" ?
        <div id="" className={`game-markets-header sport-header fill ember-view`}>
          <div className="game-markets-header-text sb-sport-header-title">
            <span>
              <span className="game-markets-header-county"><div className="g-loading large gradient"></div></span>
              <span className="game-markets-header-league"> </span>
              <span className="game-markets-header-teams"><div className="g-loading large gradient"></div></span>
            </span>
          </div>

          <div className="info-icons">
            <div className="lineups-opener ">

            </div>
            <span className="icon-icon-statistics statistics"></span>
          </div>
        </div> : null
      }
      <div className="market-event-container">
        <div className="scrollable">
          {props.activeView === "Live" ?
            <div className="sb-game-markets-game-info">
              <i className="icon-icon-info"></i>
              <span className="game-info-text"><div className="g-loading large gradient"></div></span>
            </div>
            : null}
          <div>
            <div className="events-nav">
              <div className="events-nav-item">
                <div className="g-loading medium gradient"></div>
              </div>
              <div className="events-nav-item">
                <div className="g-loading medium gradient"></div>
              </div>
              <div className="events-nav-item">
                <div className="g-loading medium gradient"></div>
              </div>
              <div className="events-nav-item">
                <div className="g-loading medium gradient"></div>
              </div>
            </div>
            <div>
              <div className="events-list">
               {
                 [1,2,3,4].map((e,i)=>{
                   return(
                    <div key={i} className="col-sm-12">
                      <div className="event">
                    <div className="event-header">
                      <div className="g-loading large gradient"></div>
                      <ul className="market-icons">
                        <div className="g-loading medium gradient"></div>
                      </ul>
                    </div>
                    <div className="event-data" style={{ display: 'block' }}>
                      <div className="event-item-col-2">
                        <div className="single-event col-sm-6">
                          <span className="event-name col-sm-10"><div className="g-loading large gradient"></div></span>
                          <span className="event-price col-sm-2"><div className="g-loading medium gradient"></div></span>
                        </div>
                        <div className="single-event col-sm-6">
                          <span className="event-name col-sm-10"><div className="g-loading large gradient"></div></span>
                          <span className="event-price col-sm-2"><div className="g-loading medium gradient"></div></span>
                        </div>
                      </div>
                      <div className="event-item-col-2">
                        <div className="single-event col-sm-6">
                          <span className="event-name col-sm-10"><div className="g-loading large gradient"></div></span>
                          <span className="event-price col-sm-2"><div className="g-loading medium gradient"></div></span>
                        </div>
                        <div className="single-event col-sm-6">
                          <span className="event-name col-sm-10"><div className="g-loading large gradient"></div></span>
                          <span className="event-price col-sm-2"><div className="g-loading medium gradient"></div></span>
                        </div>
                      </div>
                      <div className="event-item-col-2">
                        <div className="single-event col-sm-6">
                          <span className="event-name col-sm-10"><div className="g-loading large gradient"></div></span>
                          <span className="event-price col-sm-2"><div className="g-loading medium gradient"></div></span>
                        </div>
                        <div className="single-event col-sm-6">
                          <span className="event-name col-sm-10"><div className="g-loading large gradient"></div></span>
                          <span className="event-price col-sm-2"><div className="g-loading medium gradient"></div></span>
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
                   )
                 })
               }
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export const MultiviewMarketLoader = (props) => {
  return (
    <React.Fragment>
      <div className="sport-header">
        <div className="sport-title"><div className="g-loading large gradient"></div></div>
        <div className="sport-accord"><div className="g-loading small gradient"></div></div>
      </div>
          <div className={`live-game-teams-stats`}>
            <div className={`stats-header`}>
              <div className="title"><div className="g-loading large gradient"></div></div>
              <div className={`first-half-score`}></div>
              <div className={`second-half-score`}></div>
              <div className={`third-half-score`}></div>
              <div className={`forth-half-score`}></div>
              <div className="score"><div className="g-loading medium gradient"></div></div>

            </div>
            <div className={`stats-teams`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
              <div className="title"><div className="g-loading large gradient"></div></div>
              <div className={`first-half-score`}></div>
              <div className={`second-half-score`}></div>
              <div className={`third-half-score`}></div>
              <div className={`forth-half-score`}></div>
              <div className="score"><div className="g-loading medium gradient"></div></div>
            </div>
            <div className={`stats-teams`} style={{ borderBottom: "1px solid color: rgba(51,51,51,.65)" }}>
              <div className="title"><div className="g-loading large gradient"></div></div>
              <div className={`first-half-score`}></div>
              <div className={`second-half-score`}></div>
              <div className={`third-half-score`}></div>
              <div className={`forth-half-score`}></div>
              <div className="score"><div className="g-loading medium gradient"></div></div>
            </div>
          </div>
      <div className="market-event-container">
        <div className="scrollable">
          {props.activeView === "Live" ?
            <div className="sb-game-markets-game-info">
              <i className="icon-icon-info"></i>
              <span className="game-info-text"><div className="g-loading large gradient"></div></span>
            </div>
            : null}
          <div>

            <div>
              <div className="events-list">
               {
                 [1,2,3,4].map((e,i)=>{
                   return(
                    <div key={i} className="event">
                    <div className="event-header">
                      <div className="g-loading large gradient"></div>
                      <ul className="market-icons">
                        <div className="g-loading medium gradient"></div>
                      </ul>
                    </div>
                    <div className="event-data" style={{ display: 'block' }}>
                      <div className="event-item-col-3">
                        <div className="single-event">
                          <span className="event-name"><div className="g-loading large gradient"></div></span>
                          <span className="event-price"><div className="g-loading small gradient"></div></span>
                        </div>
                        <div className="single-event">
                          <span className="event-name"><div className="g-loading large gradient"></div></span>
                          <span className="event-price"><div className="g-loading small gradient"></div></span>
                        </div>
                        <div className="single-event ">
                          <span className="event-name"><div className="g-loading large gradient"></div></span>
                          <span className="event-price"><div className="g-loading small gradient"></div></span>
                        </div>
                      </div>
                    </div>
                  </div>
                   )
                 })
               }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="goto-link"><a><i className="icon-go-to-link"></i>OPEN THIS EVENT</a></div>
    </React.Fragment>
  )
}
export const CompetitionLoader = () => {
  return (
    <div className="competition-game loading-competition">
      <div className="game-date">
        <span className="date"><div className="g-loading large gradient"></div></span>
        <span className="events">
          <span className="w1"></span>
          <span className="draw"></span>
          <span className="w2"></span></span>
      </div>
      {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d, i) => {
          return (
            <div key={i} className="game">
              <div className="game-teams col-sm-5">
                <span className="w1"><div className="g-loading large gradient"></div></span>
                <span className="w2"><div className="g-loading large gradient"></div></span>
              </div>
              <div className="game-time col-sm-2">
                <span className="time"><div className="g-loading small gradient"></div></span>
                <span className="market-count"><div className="g-loading small gradient"></div></span>
              </div>
              <div className="game-market col-sm-5">
                <div className="w1 col-sm-4"><span className="price"><div className="g-loading small gradient"></div></span></div>
                <div className="draw col-sm-4"><span className="price"><div className="g-loading small gradient"></div></span></div>
                <div className="w2 col-sm-4"><span className="price"><div className="g-loading small gradient"></div></span></div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
export const OverviewLoader = () => {
  return (
    <React.Fragment>
      <div className="sports-container">
        <div className="sport-header select ">
          <div className="sport-title"><div className="g-loading large gradient"></div></div>
          <div className="sport-accord"><span className="text text-hide">
            <div className="g-loading small gradient"></div>
          </span>
            <span className="icon-icon-arrow-down icon icon-show col-sm-1 icon-up"></span>
          </div>
        </div>
        <div className="region-block-open" style={{ display: 'block' }}>
          <ul className="sports-region-list">
            {
              [1, 2, 3].map((d, i) => {
                return (
                  <li key={i}>
                    <div className="region-header overview">
                      <span className="region-name"><div className="g-loading large gradient"></div> </span>
                      <span className="total-games text">
                        <span className="icon-icon-arrow-down icon icon-show col-sm-1 icon-up">
                        </span>
                      </span>
                    </div>
                    <div className="region-competition show" style={{ display: "block" }}>
                      <ul className="competition-list ">
                        <li className="competition-block live">
                          <div className="events">
                            <div className="sportlist-competition-accordion">
                              <div className="sb-accordion-container">
                                <div className="sb-accordion-item match open overview">
                                  <div className="sb-accordion-title match-title border-bottom">
                                    <div className="match-title-text"><div className="g-loading large gradient"></div>
                                    </div>
                                    <div className="match-title-text match-title-text-x2"><div className="g-loading large gradient"></div>
                                    </div>
                                    <div className="hidden-icons">
                                      <div className="match-time">
                                        <div className="match-time-info"><div className="g-loading large gradient"></div>
                                        </div>
                                      </div>
                                      <span className="add-to-favorite">
                                      </span>
                                    </div>
                                  </div>
                                  <div className="sb-accordion-content overview-item match-content sportlist-game-accordion">
                                    <div className=" sb-accordion-title sb-block-header hidden-icon-parent game-market-title event-list-breadcrumb ">
                                      <div className="custom-select ">
                                        <div className="custom-select-style custom-select-default">
                                          <div className="g-loading large gradient"></div>
                                        </div>

                                      </div>
                                      <div className="sb-accordion-title-icons">
                                        <div className="sb-accordion-title-icons-left">
                                          <div className="calendar-events-title-dropdown-container">
                                          </div>
                                        </div>
                                        <div className="more-matches"><div className="g-loading small gradient"></div>
                                        </div></div></div><div className="event-list">
                                      <div className="event-item-col-undefined">
                                        <div className="single-event">
                                          <span className="event-name col-sm-9"><div className="g-loading large gradient"></div></span>
                                          <span className="event-price col-sm-3"><div className="g-loading small gradient"></div></span>
                                        </div>
                                      </div>
                                      <div className="event-item-col-undefined">
                                        <div className="single-event">
                                          <span className="event-name col-sm-9"><div className="g-loading large gradient"></div></span>
                                          <span className="event-price col-sm-3"><div className="g-loading small gradient"></div></span>
                                        </div>
                                      </div>
                                      <div className="event-item-col-undefined">
                                        <div className="single-event">
                                          <span className="event-name col-sm-9"><div className="g-loading large gradient"></div></span>
                                          <span className="event-price col-sm-3"><div className="g-loading small gradient"></div></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>
                )
              })
            }

          </ul>
        </div>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, i) => {
        return (
          <div key={i} className="sports-container">
            <div className="sport-header select ">
              <div className="sport-title"><div className="g-loading large gradient"></div></div>
              <div className="sport-accord"><span className="text text-hide">
                <div className="g-loading small gradient"></div>
              </span>
                <span className="icon-icon-arrow-down icon icon-show col-sm-1"></span>
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}
export const CalenderLoader = () => {
  var lLen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  return (
    <React.Fragment>
      {
        lLen.map((l, i) => {
          return (
            <div key={i} className="calender-event-item loading-view col-sm-12">
              <div className="sport col-sm-2"><div className="g-loading large gradient"></div></div>
              <div className="time col-sm-1"><div className="g-loading small gradient"></div></div>
              <div className="league col-sm-2"><div className="g-loading large gradient"></div></div>
              <div className="event col-sm-3"><span><div className="g-loading large gradient"></div></span></div>
              <div className="w1 col-sm-1"><div className="g-loading medium gradient"></div></div>
              <div className="draw col-sm-1"><div className="g-loading medium gradient"></div></div>
              <div className="w2 col-sm-1"><div className="g-loading medium gradient"></div></div>
              <div className="stats col-sm-1"><span style={{ textAlign: "right", paddingRight: "10px" }}><div className="g-loading small gradient"></div></span></div>
            </div>
          )
        })
      }
    </React.Fragment>
  )
}
export const ResultsLoader = () => {
  var lLen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  return (
    <React.Fragment>
      {
        lLen.map((l, i) => {
          return (
            <div key={i} className="game loading-view">
              <div className="game-header">
                <div className="date col-sm-2"><span><div className="g-loading large gradient"></div></span></div>
                <div className="competition col-sm-3"><div className="g-loading large gradient"></div></div>
                <div className="event col-sm-5"><div className="g-loading large gradient"></div></div>
                <div className="score col-sm-1"><span><div className="g-loading medium gradient"></div></span></div>
                <div className="arrow"><span className="total-games text"><span className="icon-icon-arrow-down icon icon-show"></span></span></div>
              </div>
            </div>
          )
        })
      }
    </React.Fragment>
  )
}
export const BetHistoryLoader = () => {
  var lLen = [1, 2, 3, 4, 5, 6]
  return (

    lLen.map((l, i) => {
      return (
        <div key={i} className="bet-details history-loading" style={{ height: '40px' }}>
          <div className="more">
            <span style={{ marginTop: '10px' }} className="icon-more icon-icon-arrow-down icon close"></span>
          </div>
          <div className="date"><div className="g-loading large gradient"></div></div>
          <div className="id"><div className="g-loading medium gradient"></div></div>
          <div className="type "><span><div className="g-loading small gradient"></div></span></div>
          <div className="stake"><div className="g-loading small gradient"></div></div><div className="odds"><div className="g-loading small gradient"></div></div>
          <div className="win"><span><div className="g-loading medium gradient"></div></span></div>
          <div className="state"><span><div className="g-loading medium gradient"></div></span></div>
        </div>
      )
    })

  )
}
export const GameResultsLoder = ()=>{
  var numT =[1,2,3,4,5,6,7,8,9,10]
 return(
   numT.map((e,i)=>{
     return(
      <div key={i} className="market-events"><span><div className="g-loading medium gradient"></div></span><span> <div className="g-loading medium gradient"></div></span></div>
     )
   })
 )
}
export const LiveEventLoader = (props)=>{
  const is_live = props.is_live
  return(
<React.Fragment>
        <div className="sport-item">
          {
            [0,1,2,3,4,5,6,7,8,9,10].map((s,i)=>{
              return(
                <div key={i} className={`sport`} >
                <div className="sport-background top"></div>
                <div className={`sport-avatar`}></div>
              </div>
              )
            })
          }
        </div>
        <div className={`events-list-container ${is_live?'live':''} load`}>
        {
          [0,1,2,3,4,5].map((d,i)=>{
 
            return(
              <div className="event-block inline" key={i}>
                <div className="event-details"style={{flexDirection:is_live?'row':'column'}}>
                    {
                      is_live?
                      <div className="live-event-details">
                      <span><div className="g-loading small gradient"></div></span>
                      <span>
                      <div className="g-loading small gradient"></div>
                      </span>
                  </div>:
                  <span className="time"><div className="g-loading large gradient"></div></span>
                    }
                    <span className="competition" ><div className="g-loading large gradient"></div></span>
                </div>
                <div className="event-odds inline">
                  {
                    ["w1","X","w2"].map((e,index)=>{ 
                      return (
                        <div key={index} className={`${e} single-event`}>
                          <span className="event-name" ><div className="g-loading medium gradient"></div></span>
                          <span className="event-price"><div className="g-loading small gradient"></div></span>
                        </div>
                      )
                    })
                  }
                </div>
                <div className="event-info live  livestream-disabled">
                    <div className="g-loading small gradient"></div>
                </div>
              </div>
            )
          })
        }
        </div>
      </React.Fragment>
  )
},
CasinoLoading=()=>{
  return(
    <React.Fragment>
      {[1,2,3,4].map(()=>{
        return(
          [1,2,3,4,5].map((n,i)=>{
            return(
              <li key={i} className="game">
              <div>
              <a style={{width:" 100%"}}>
              <div className="img-loading">
              <div className="g-loading large gradient"></div>
              </div>
                <div className="loading-p"><div className="g-loading large gradient"></div></div>
              </a>
              </div>
              </li>
            )
          })
        )
      })
      
      }
    </React.Fragment>
  )
}