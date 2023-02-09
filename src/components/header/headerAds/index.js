import React, { PureComponent } from 'react'
import Carousel from 'nuka-carousel';
import { Link } from 'react-router-dom';

export default class HeaderAds extends PureComponent{
   constructor(props){
     super(props)
     this.state={
      currentSlideIndex: 0,
      finished:false
     }
     this.bannerRef = React.createRef()
     this.options = {
      slidesToShow: 1,
      autoplay: true,
      transitionMode:"scroll",
      autoplayInterval:10000,
      pauseOnHover:true,
      autoGenerateStyleTag:false
  }
  this.sendBannerToGame = this.sendBannerToGame.bind(this);
   }
   sendBannerToGame(data) {
    this.props.history.replace(`${data.url}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport.id,region:data.region.id,competition:data.competition.id,game:data.game.id})
	}
 render (){
  const {ads} = this.props,{finished}=this.state;
  ads.sort((a,b)=>{
     if(a.list_order > b.list_order)
     return 1
     if(a.list_order < b.list_order)
     return -1
     return 0
  })
    return(

    <Carousel ref={this.bannerRef} {...this.options} wrapAround={ads.length>1?true:false} renderBottomCenterControls={props => null} renderCenterLeftControls={props => null} renderCenterRightControls={props => null}>
        {ads.map((photo, key) => {
        return photo.hasOwnProperty('image') ?photo.slide_id=== 26? <a  key={photo.id} to={photo.url} onClick={(e)=>{e.preventDefault();this.sendBannerToGame({url:photo.url,...JSON.parse(photo.description)})}} style={{height:!finished&&'25px'}}><img  onLoad={()=>{this.bannerRef.current.setDimensions();!finished&&this.setState({finished:true});}}	src={ photo.image }	alt={ photo.title }/></a>:<Link key={photo.id} to={photo.url} style={{height:!finished&&'25px'}}><img  onLoad={()=>{this.bannerRef.current.setDimensions();!finished&&this.setState({finished:true});}}	src={ photo.image }	alt={ photo.title }/></Link>:null})}
      </Carousel>
    
    )
   }
   
 }