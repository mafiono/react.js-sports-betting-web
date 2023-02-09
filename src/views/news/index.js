import React, { PureComponent } from 'react'
import API from '../../services/api'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY} from '../../actionReducers'
import SportsComponent from '../../containers/sportsComponent'
import NewsBanner from './newsbanner'
import {decodeHTMLEntities} from '../../common'
import { Switch, Route } from 'react-router-dom'
import { NewsRead } from './newsview'
import Helmet from 'react-helmet'
// import ReactGA from 'react-ga'
const $api = API.getInstance()
export default class News extends PureComponent{

     constructor(props){
         super(props)
         this.state={
            loadingInitailData:false,
            newList:[],
            newsNav:[]
         }
         this.banner=[]
         this.onError = this.onError.bind(this)
         this.readNewsItem = this.readNewsItem.bind(this)
         this.getNewsBanner()
     }
     componentDidMount() {
        // ReactGA.pageview('/news');
         $api.getNewsList(this.handleNewsList.bind(this))
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: 'News', loadSports: true }))
        if (undefined !== this.props.sportsbook.sessionData.sid && undefined === this.props.sportsbook.data.sport && !this.state.loadingInitailData) {
            this.setState({ loadingInitailData: true })
            this.props.loadData()
        }
    }
    componentDidUpdate() {
        if (undefined !== this.props.sportsbook.sessionData.sid && undefined === this.props.sportsbook.data.sport && !this.state.loadingInitailData) {
            this.setState({ loadingInitailData: true })
            this.props.loadData()
        }
    }
    componentWillUnmount(){
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {data:[],activeView: ''}))
    }
    handleNewsList({data}){
        this.setState({newList:data.data})
    }
    handleNewsNav({data}){
        if(data.status ===200){
            this.setState({newNav:data.data})
        }
    }
    handleBanner({data}){
        this.banner = data.data
    }
    onError(data){
        console.log(data)
    }
    getNewsBanner(){
        $api.getNewsBanner().then(this.handleBanner.bind(this),this.onError)
    }

    readNewsItem(title,id){
        this.props.history.push(`${this.props.match.path}/${title.split(' ').join('-')}`,{id:id})
    }
    render(){
        const{history,loadMarkets,addEventToSelection,sendRequest,unsubscribe}=this.props
        this.newsItems = this.state.newList.slice(0,this.state.newList.length-5).map((news)=>{
            return(
                <div key={news.id} className="news-single-item">
                    <div className="news-title" onClick={()=>this.readNewsItem(decodeHTMLEntities(news.post_title),news.id)}><span>{decodeHTMLEntities(news.post_title)}</span></div>
                    <div className="news-content"><p dangerouslySetInnerHTML={{__html:decodeHTMLEntities(news.post_excerpt)}}></p></div>
                    <div className="news-date"><span>{new Date(news.published_time).toDateString()}</span></div>
                </div>
            )
        })
        this.moreStories = this.state.newList.slice(this.state.newList.length-5,this.state.newList.length).map((news,ind)=>{
            return(
                <div key={news.id} className="news-single-item" onClick={()=>this.readNewsItem(decodeHTMLEntities(news.post_title),news.id)}>
                    <div className="thumbnail col-sm-3"> 
                        <img src={news.thumbnail} />
                    </div>
                    <div key={news.id} className="details col-sm-9">
                        <div className="news-title"><span>{decodeHTMLEntities(news.post_title)}</span></div>
                        <div className="news-content"><span dangerouslySetInnerHTML={{__html:decodeHTMLEntities(news.post_excerpt)}}></span></div>
                        <div className="news-date"><span>{new Date(news.published_time).toDateString()}</span></div>
                    </div>
                </div>
            )
        })
        return(
            <div className={`sportsbook-container news`}>
                <Helmet>
                    <title>News- Corisbet Gambling</title>
                </Helmet>
            <div className="sportsbook-inner">
                <div className="sportsbook-view">
                    <div className="sportsbook-content">
                        <div className="event-view col-sm-12" style={{paddingTop:'10px'}}>
                         <SportsComponent history={history} multiview={false} loadMarkets={loadMarkets} addEventToSelection={addEventToSelection} sendRequest={sendRequest} />
                        
                        <Switch>
                            <Route  exact path={this.props.match.path}>
                            <div className="news-banner-list col-sm-12">
                            <div className="banners-header col-sm-12">
                            <div className="col-sm-12">
                            <div style={{width:'100%',height:'inherit',display:'flex'}}>
                            <NewsBanner photos={this.banner} openNews={this.readNewsItem}/>
                            </div>
                            </div>
                            </div>
                            <div className="news-list-container col-sm-12">
                            <div className="header"><div className="title">Latest News</div></div>
                                {
                                   this.newsItems
                                }
                            </div>
                            </div>
                            </Route>
                            <Route path={`${this.props.match.path}/:newsID`} render={(props)=> <NewsRead {...props}/>
                        </Switch>
                        <div className="news-nav col-sm-3">
                            <div className="top-news col-sm-12">
                            <div className="header"><div className="title">Top Stories</div></div>
                            
                            <div className="item col-sm-12">
                                <div className="number col-sm-1">1</div>
                                <div className="title col-sm-10"><span>Man Utd Barca Join Chase For 17yo African Sensation</span></div>
                            </div>
                            <div className="item col-sm-12">
                                <div className="number col-sm-1">2</div>
                                <div className="title col-sm-10"><span>Man Utd Barca Join Chase For 17yo African Sensation</span></div>
                            </div>
                            <div className="item col-sm-12">
                                <div className="number col-sm-1">3</div>
                                <div className="title col-sm-11"><span>Man Utd Barca Join Chase For 17yo African Sensation</span></div>
                            </div>
                            
                            </div>
                            <div className="more-news col-sm-12">
                            <div className="header"><div className="title">More Stories</div></div>
                            {
                                this.moreStories
                            }
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}