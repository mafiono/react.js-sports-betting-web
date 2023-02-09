import React,{useEffect,useState} from 'react'
import API from '../../../services/api'
import {decodeHTMLEntities} from '../../../common'
import moment from 'moment'
const $api = API.getInstance()
export const NewsRead= (props)=>{
    const [news,setNews]= useState({}),{id} = props.location.state
    useEffect(() => {
         function handleNewsData({data}){
             (data && data.status ===200) && setNews(data.data)
         }
         $api.getNewsView({id:id},handleNewsData)
      },[id]);
 return(
     <div className="news-list-container col-sm-12" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
         <div ><h1>{decodeHTMLEntities(news.post_title)}</h1></div>
         <div ><span>{moment(news.published_time).format('ddd, YYYY MM DD')}</span></div>
         {/* <div><img src={news.thumbnail}/></div> */}
         <div  className="col-sm-8 news-content" dangerouslySetInnerHTML={{__html:news.post_content}}>
             
         </div>
     </div>
 )
}