import React, { PureComponent } from 'react'
import { decodeHTMLEntities } from '../../../common'

export default class NewsBanner extends PureComponent{
   constructor(props){
     super(props)
     this.state={
      currentSlideIndex: 0
     }
     this.bannerRef = React.createRef()
     this.options = {
      slidesToShow: 1,
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
  const {photos, isSlideshowMode = false} = this.props;

  photos.sort((a,b)=>{
       if(a.list_order > b.list_order)
       return 1
       if(a.list_order < b.list_order)
       return -1
       return 0
    })
  const photosNodes = photos.map((photo, key) => {
    // if (key <= this.state.currentSlideIndex + 2) {

        return <li key={key} className={`news-banner-item news-banner-item-${key+1}`}>
          <div className="media media-hero media-overlay" onClick={(e)=>{e.preventDefault();this.props.openNews(decodeHTMLEntities(photo.title),photo.url)}}>
            <div className={`media-image ${key>0?'fit':''}`}>
              <div className="image-responsive">
              <img src={photo.image}/>
              </div>
            </div>
            <div className="media-content">
            <h3 className="media-title">
              <a className="media-link" href={photo.url} rev="hero1|headline" onClick={(e)=>{e.preventDefault();this.props.openNews(decodeHTMLEntities(photo.title),photo.url)}}>{photo.title}</a>
            </h3>
            </div>
            <a className="block-link__overlay-link" href={photo.url} onClick={(e)=>{e.preventDefault();this.props.openNews(decodeHTMLEntities(photo.title),photo.url)}}></a>
          </div>
          </li>;
    // }
    // return <div key={key}></div>;
  });
    return(
        <ul className="news-banner-parent">{photosNodes}</ul>
    )
   }
   
 }