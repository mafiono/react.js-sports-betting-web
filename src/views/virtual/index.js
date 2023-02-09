import React,{useEffect,useState} from 'react'
import Helmet from 'react-helmet'
import { getCookie } from '../../common'
// import ReactGA from 'react-ga';
export const Virtual=(props)=>{
     const iframeRef = React.createRef(), [loading,setLoaded]= useState(true),onLoadFinish=()=>{setLoaded(false)} ; let authorize = ''
     if(getCookie('AuthToken') && getCookie('id')){
         authorize=`AuthToken=${encodeURIComponent(getCookie('AuthToken'))}&UserId=${encodeURIComponent(getCookie('id'))}`
     }
    useEffect(()=>{iframeRef.current.addEventListener('load',function(){onLoadFinish(this)})},[])
    // ReactGA.pageview('/virtual-sports');
    return(                  
    <div className="col-md-12" style={{display:'flex',height:'calc(100vh - 60px)'}}>
    <Helmet>
     <title>Virtual Sports - Corisbet Gambling</title>
    </Helmet>
 
       <iframe ref={iframeRef} title="Virtual Sports Iframe" className="col-md-12" style={{width:'100%',height:'100%',display:loading && 'none'}} src={`https://sportsbook.africabetsgh.com/#/virtualsports?${authorize}&lang=${props.lang}`}></iframe>
        <div style={{display:!loading && 'none'}} className="no-results-container sb-spinner">
        <span className="btn-preloader sb-preloader"style={{width:'100px',height:'100px'}}></span>
        </div>
   </div>)
  }