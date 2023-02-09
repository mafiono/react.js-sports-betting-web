import React, { PureComponent } from 'react'
import Carousel from 'nuka-carousel';
import {PagingDotsCustom,PreviousSlide,NextSlide} from '../stateless';
import { Link } from 'react-router-dom';

export default class HomeBanner extends PureComponent{
   constructor(props){
     super(props)
     this.state={
      currentSlideIndex: 0
     }
     this.bannerRef = React.createRef()
     this.options = {
      slidesToShow: 1,
      autoplay: true,
      transitionMode:"scroll",
      autoplayInterval:5000,
      pauseOnHover:true
  }
  this.sendBannerToGame = this.sendBannerToGame.bind(this);
   }
   sendBannerToGame(data) {
    this.props.history.replace(`${data.url}/${data.sport.alias}/${data.region.name}/${data.competition.id}/${data.game.id}`,{sport:data.sport.id,region:data.region.id,competition:data.competition.id,game:data.game.id})
	}
 render (){
  const {photos,featured_banner} = this.props,homebanners = [...photos,...featured_banner];
  homebanners.sort((a,b)=>{
     if(a.list_order > b.list_order)
     return 1
     if(a.list_order < b.list_order)
     return -1
     return 0
  })
    return(

    <Carousel ref={this.bannerRef} {...this.options} wrapAround={homebanners.length>1?true:false} renderBottomCenterControls={props => <PagingDotsCustom {...props}/>} renderCenterLeftControls={props => <PreviousSlide {...props}/>} renderCenterRightControls={props => <NextSlide {...props}/>}>
        {homebanners.map((photo, key) => {
        return photo.hasOwnProperty('image') ?photo.slide_id=== 26? <a key={photo.id} to={photo.url} onClick={(e)=>{e.preventDefault();this.sendBannerToGame({url:photo.url,...JSON.parse(photo.description)})}} style={{display:'block'}}><img  onLoad={()=>this.bannerRef.current.setDimensions()}	src={ photo.image }	alt={ photo.title }/></a>:<Link key={photo.id} to={photo.url} style={{display:'block'}}><img  onLoad={()=>this.bannerRef.current.setDimensions()}	src={ photo.image }	alt={ photo.title }/></Link>:null})}
      </Carousel>
    
    )
   }
   
 }