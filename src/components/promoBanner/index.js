import React,{PureComponent} from 'react'
import Carousel from 'nuka-carousel';
import {PagingDotsCustom,PreviousSlide,NextSlide} from '../stateless';
import { Link } from 'react-router-dom';

export default class PromoBanner extends PureComponent{
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
      autoplayInterval:10000,
      pauseOnHover:true
    }

   }
 render (){
  const {promo_banner} = this.props
  promo_banner.sort((a,b)=>{
     if(a.list_order > b.list_order)
     return 1
     if(a.list_order < b.list_order)
     return -1
     return 0
  })
    return(

    <Carousel ref={this.bannerRef} {...this.options} wrapAround={promo_banner.length>1?true:false} renderBottomCenterControls={props => <PagingDotsCustom {...props}/>} renderCenterLeftControls={props => promo_banner.length>1?<PreviousSlide {...props}/>:null} renderCenterRightControls={props =>promo_banner.length>1? <NextSlide {...props}/>:null}>
        {promo_banner.map((photo) => {
        return photo.hasOwnProperty('image') ?<Link key={photo.id} to={photo.url} style={{display:'block'}}><img  onLoad={()=>this.bannerRef.current.setDimensions()}	src={ photo.image }	alt={ photo.title }/></Link>:null})}
    </Carousel>
    
    )
   }
   
 }