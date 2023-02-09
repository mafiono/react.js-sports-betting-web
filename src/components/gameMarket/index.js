import React ,{useState} from 'react'
import Market from '../market'

const MarketComponent=(props)=>{
    const [isGridView,setIsGridView]= useState(false), arrayBuffer=(arr)=>{
        let a=[...arr],b=[]
        if(isGridView){
            let len = a.length
            b[0]=a.slice(0,Math.ceil(len/2))
            b[1]=a.slice(Math.ceil(len/2),len)
        }else b[0]= a
        return b
      }
    return (
        <div className="market-event-container" style={{height:props.activeSport.id === 1 && props.activeView === 'Live'&& 'calc(100% - 10px)'}}>
        <div className={`scrollable`}>
          {props.activeView === "Live" ?
            <div className="sb-game-markets-game-info">
              <i className="icon-icon-info"></i>
              <span className="game-info-text">{props.activeGame ? props.activeGame.text_info : null} {props.activeGame.add_info_name? " | "+props.activeGame.add_info_name:''}</span>
            </div>
            : null}


          <div>
            <div className="events-nav">
            <div {...{ className: `events-nav-item ${props.activeNav === 0 ? 'active' : null}`, onClick: () => props.activeNav !== 0 ? props.sortByGroups(0) : null }}>
            <div className="active-market-type"></div>
            <span className="market-type-name">All</span>
            </div>
              {
                props.marketGroups.map((group, id) => {
                  return (
                    <div key={group.id} {...{ className: `events-nav-item ${props.activeNav === group.id ? 'active' : null}`, onClick: () => props.activeNav !== group.id ? props.sortByGroups(group.id) : null }}>
                    <div className="active-market-type"></div>
                    <span className="market-type-name">{group.name}</span>  
                    </div>
                  )
                })
              }
              <div className="sb-eventview-events-columns-settings">
                    <div className={`${!isGridView?"active":"disabled"}`} onClick={()=>setIsGridView(false)}>
                        <i className="icon-one-column"></i>
                    </div>
                    <div className={`${isGridView?"active":"disabled"}`} onClick={()=>setIsGridView(true)}>
                        <i className="icon-two-column"></i>
                    </div>
            </div>
            </div>

            <div>
              {props.marketDataArr.length > 0 ?
                <div className={`events-list`}>
                  {
                    arrayBuffer(props.marketDataArr).map((group,rowId)=>
                    <div key={rowId} {...{className:`${isGridView?'col-sm-6':'col-sm-12'}`}}>
                        {
                            group.map((market, key) => {
                                let elRef = React.createRef();
                                return (
        
                                <Market sport={props.sport} region={props.region} competition={props.competition} ref={elRef} key={market.data[0].id} marketIndex={key} activeGameSuspended={props.activeGameSuspended} activeGame={props.activeGame} market={market} addEventToSelection={props.addEventToSelection} loadMarket={props.loadMarket} betSelections={props.betSelections} clearUpdate={props.clearUpdate} oddType={props.oddType} />
                                )
                            })
                    }
                    </div>
                    )

                  }
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

          </div>
        </div>
      </div>
    )
}
export default MarketComponent