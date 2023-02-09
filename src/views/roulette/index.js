import React,{useEffect,useState} from 'react'
import Helmet from 'react-helmet'
import { getCookie } from '../../common'
// import TagManager from 'react-gtm-module';
// import ReactGA from 'react-ga';
export const Roulette=(props)=>{
     const iframeRef = React.createRef(), [loading,setLoaded]= useState(true),onLoadFinish=()=>{setLoaded(false)} ; let  authorize = ''
     if(getCookie('AuthToken') && getCookie('id')){
         authorize=`&authToken=${encodeURIComponent(getCookie('AuthToken'))}&UserId=${encodeURIComponent(getCookie('id'))}`
     }
    useEffect(()=>{iframeRef.current.addEventListener('load',function(){onLoadFinish(this)})},[])
    // const tagManagerArgs = {
    //     dataLayer: {
    //         userId: getCookie('id'),
    //         authToken:getCookie('AuthToken'),
    //         page: 'Roulette',
    //         sportbookData:{}
    //     },
    //     dataLayerName: 'User Activity Data Layer'
    // }
    // TagManager.dataLayer(tagManagerArgs)
    // ReactGA.pageview('/roulette');
    return(
    <div className="col-md-12 roulette-container">
    <Helmet>
    <title>Roulette - Corisbet Gambling</title>
    </Helmet>
        <iframe ref={iframeRef} title="Roulette Iframe"  style={{width:'100%',height:'100%',border:'none',display:loading && 'none'}} className="col-md-12" src={`https://www.africabeting.com/ghana/#/roulette?partnerID=100001${authorize}`}></iframe>
        <div className="no-results-container sb-spinner" style={{display:!loading && 'none'}}>
        <span className="btn-preloader sb-preloader"style={{width:'100px',height:'100px'}}></span>
        </div>
    
    </div>)
  }