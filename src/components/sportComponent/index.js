import React from 'react'
import {SportListLoader} from '../loader'
import Sport from '../../containers/sports'
import Popular from '../popular'
import {allActionDucer} from '../../actionCreator'
import {SPORTSBOOK_ANY} from '../../actionReducers'
import { dataStorage } from '../../common'
export const  SportsComponent = (props)=> {
    
  
     const addToMultiViewGames=(game)=> {
      let multiviewGames = [...props.sportsbook.multiviewGames]
      if (!multiviewGames.includes(game)) {
        multiviewGames.push(game)
        props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ multiviewGames: multiviewGames }))
        dataStorage('multiviewGames', multiviewGames)
      }
    },loadMultiSelectData=()=>{
      props.dispatch(allActionDucer(SPORTSBOOK_ANY,{ allowMultiSelect: !props.sportsbook.allowMultiSelect }))
      props.loadMultiSelectData()
    },
    openGameToView=(competition,region,sport)=>{
      props.history.replace(`/sports/prematch/${sport.alias}/${region.name}/${competition.id}`,{sport:sport.id,region:region.id,competition:competition.id})
    }
      const { data, loadSports,activeView,popularcompetitionData,populargamesData} = props.sportsbook,
        {multiview,addEventToSelection,loadMarkets,loadGames,history} = props

        const sport = data ? data.sport : {}, newdata = [],pg=[],pc=[]
        for (let data in sport) {
            if (null !== sport[data])
                newdata.push(sport[data])
        }
        newdata.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            }
            if (b.order > a.order) {
                return -1;
            }
            return 0;
        })
        Object.keys(popularcompetitionData).forEach((c) => {
  
          if (null !== popularcompetitionData[c])
            pc.push(popularcompetitionData[c])
    
        })
        Object.keys(populargamesData).forEach((g) => {
          if (null !== populargamesData[g])
            pg.push(populargamesData[g])
        })
      return (
        <div className={`sports col-sm-${activeView === "News" ? "3" : "2"}`}>
          <div className={`sports-list ${loadSports ? "loading-view" : ""}`}>
            {!loadSports ? (
              <React.Fragment>
                {/* {pg.length > 0 &&
                activeView !== "Live" && activeView !== "Multiview" ? (
                  <Popular
                    history={history}
                    data={pg}
                    loadGames={
                      activeView === "Prematch" ? loadGames : openGameToView
                    }
                    loadSports={loadSports}
                    type={2}
                    loadMarkets={loadMarkets}
                  />
                ) : null} */}
                {/* {pc.length > 0 &&
                activeView !== "Live" && activeView !== "Multiview" ? (
                  <Popular
                    history={history}
                    data={pc}
                    loadGames={
                      activeView === "Prematch" ? loadGames : openGameToView
                    }
                    loadSports={loadSports}
                    type={1}
                    loadMarkets={loadMarkets}
                  />
                ) : null} */}

                {newdata.map((sport, key) => {
                  return (
                    <Sport
                      multiview={multiview}
                      history={history}
                      key={sport.id}
                      sport={sport}
                      loadGames={loadGames}
                      loadMarkets={loadMarkets}
                      addEventToSelection={addEventToSelection}
                      addToMultiViewGames={id => addToMultiViewGames(id)}
                    />
                  );
                })}
              </React.Fragment>
            ) : (
              <SportListLoader
                live={activeView === "Live" || activeView === "Multiview"}
              />
            )}
          </div>
        </div>
      );
  }