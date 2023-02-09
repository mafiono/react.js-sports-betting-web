import React, { PureComponent } from 'react'
import Carousel from 'nuka-carousel';
import {PagingDotsCustom,PreviousSlide,NextSlide} from '../stateless';

export default class SlotGameBanner extends PureComponent{
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
      autoplayInterval:8000,
      pauseOnHover:true
  }
  this.handleAfterSlide = this.handleAfterSlide.bind(this);
   }
   handleAfterSlide(newSlideIndex) {
		this.setState({
			currentSlideIndex: newSlideIndex
		});
	}
    componentDidMount(){

    }
 render (){
  const {photos} = this.props;

    return(

    <Carousel ref={this.bannerRef} {...this.options} wrapAround={this.props.photos.length>1?true:false} renderBottomCenterControls={props => <PagingDotsCustom {...props}/>} renderCenterLeftControls={props => <PreviousSlide {...props}/>} renderCenterRightControls={props => <NextSlide {...props}/>} afterSlide={ this.handleAfterSlide }>
        {photos.map((photo, key) => {
        return <img key={key} onLoad={()=>this.bannerRef.current.setDimensions()}	src={ photo.image }	alt={ photo.title }/>
        })}
      </Carousel>
    
    )
   }
   
 }