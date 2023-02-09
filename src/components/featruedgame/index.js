import React, { PureComponent } from 'react'
import Carousel from 'nuka-carousel';
import {sortDateByStartTimeDesc} from '../../common'
import {PagingDotsCustom} from '../stateless';
import moment from 'moment';
import EventPrice from './event';

export default class FeaturedGames extends PureComponent{
   constructor(props){
     super(props)
     this.bannerRef = React.createRef()
     this.options = {
      slidesToShow: 1,
      autoplay: true,
      transitionMode:"scroll3d",
      autoplayInterval:5000,
      pauseOnHover:true,
      wrapAround:true
  };
   }
    componentDidMount(){

    }
    showGame(data){
      this.props.history.replace(`/sports/${this.props.is_live?'live':'prematch'}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport.id,region:data.region.id,competition:data.competition.id,game:data.game.id})
    }
    arrayBuffer(arr, size){
      let a=[...arr],b=[]
      while(a.length){
          let obj = []
          for (let i = 0; i < size; i++) {
              if(a[i])obj.push(a[i]);
          }
          a= a.slice(size,a.length)
          b.push(obj)
      }
      return b
    }
 render (){
  const { data,betSelections,oddType } = this.props
  let reg = [], compete = [], screnSize = window.screen.width
  data.map((sport, sID) => { 
    Object.keys(sport.region).forEach((reg) => {
      //  reg.push({name:sport.region[reg].name,alias:sport.region[reg].alias,id:sport.region[reg].id,order:sport.region[reg].order})
      var thisRegion = sport.region[reg]
      Object.keys(thisRegion.competition).forEach((c) => {
      
        if(thisRegion.competition[c].game) 
       
        Object.keys(thisRegion.competition[c].game).forEach((g)=>{
          let market = thisRegion.competition[c].game[g].market[Object.keys(thisRegion.competition[c].game[g].market)[0]],event= market.event,newEvent=[]
          Object.keys(event).forEach((ev,id)=>{
            if(event[ev].name === 'W1' || event[ev].name === 'W2') newEvent.push(event[ev])
          })
          compete.push({competition: { name: thisRegion.competition[c].name, id: thisRegion.competition[c].id, order: thisRegion.competition[c].favorite_order ? thisRegion.competition[c].favorite_order : thisRegion.competition[c].order }
          ,region : { ...thisRegion },sport :{ name: sport.name, alias: sport.alias, id: sport.id },game:{ ...thisRegion.competition[c].game[g] },market:{id:market.id,name:market.name,type:market.type},event:newEvent})
            
          })
      })
    })})
    return(

    <Carousel ref={this.bannerRef} {...this.options} renderBottomCenterControls={props=>{}} renderTopRightControls={props => <PagingDotsCustom {...props} style={{listStyles:{top:'-28px',right:'10px'},listItemStyles:{width: '20px',borderRadius:'unset'}}}/>} renderCenterLeftControls={props => {}} renderCenterRightControls={props => {}}>
       {
           this.arrayBuffer(compete,screnSize>1366?3:screnSize>810?2:1).map((group, sID) => {
             group.sort((a,b)=>sortDateByStartTimeDesc(a,b))
            return (
              <div key={sID} className="featured-group-container col-sm-12">
                {
                  group.map((eachGame,gID)=>{
                    let gameEvnt = eachGame.event
                    gameEvnt.sort((a,b)=>{
                      if(a.order > b.order)
                      return 1
                      if(a.order< b.order)
                      return -1
                      return 0
                    })
                    return(
                      <div key={gID} className={`featured-item ${group.length<2? 'col-sm-12':group.length<3? 'col-sm-6':'col-sm-4'}`} onClick={this.showGame.bind(this,eachGame)}>
                      <div className="competition-logo col-sm-4">
                        <div className="logo" style={{backgroundImage:`url(https://statistics.bcapps.org/images/c/b/0/${eachGame.competition.id}.png),url(https://statistics.bcapps.org/images/c/b/1/${eachGame.competition.id}.png)`}}></div>
                        <div className="date-time col-sm-11">{moment.unix(eachGame.game.start_ts).format('MMM D YYYY H:mm') }</div>
                      </div>
                      <div className="competition-game col-sm-8">
                        <div className="game-details">
                          <div className="team">
                            <div className="flag-name col-sm-8">
                              <span className={`col-sm-2 team-logo`} style={{backgroundImage:`url("https://statistics.bcapps.org/images/e/s/0/${eachGame.game.team1_id}.png")`}}></span>
                              <span className="team-name col-sm-10">{eachGame.game.team1_name}</span>
                            </div>
                           {gameEvnt.length>0 && <EventPrice sport={eachGame.sport} region={eachGame.region} competition={eachGame.competition} evnt={gameEvnt[0]} evtmarket={eachGame.market} game={eachGame.game} betSelections={betSelections} oddType={oddType}/>}
                          </div>
                          <div className="team">
                          <div className="flag-name col-sm-8">
                              <span className={`col-sm-2 team-logo`} style={{backgroundImage:`url("https://statistics.bcapps.org/images/e/s/0/${eachGame.game.team2_id}.png")`}}></span>
                              <span className="team-name col-sm-10">{eachGame.game.team2_name}</span>
                            </div>
                            {gameEvnt.length>0 &&<EventPrice sport={eachGame.sport} region={eachGame.region} competition={eachGame.competition} evnt={gameEvnt[1]} evtmarket={eachGame.market} game={eachGame.game} betSelections={betSelections} oddType={oddType}/>}
                          </div>
                        </div>
                        <div className="action">
                          <div className="btn"><span>Bet Now</span></div>
                          <div style={{display:'flex',alignSelf:'center',alignItems:'center',justifyContent:'center',height:'35px',width:'30%'}}><div className={`sport-icon sport-avatar ${eachGame.sport.alias}`}></div></div>
                        </div>
                      </div>
                    </div>
                    )
                  })
                }
            </div>
            )
          })
       }
      </Carousel>
    
    )
   }
   
 }