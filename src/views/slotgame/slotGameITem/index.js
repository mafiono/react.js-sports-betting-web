import React, { PureComponent } from 'react'
import './style.css'
import {getCookie} from '../../../common'
// import TagManager from 'react-gtm-module'
export default class GamePlayMode extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            fullscreenMode:false,
            loading:true
        }
        this.iframeRef = React.createRef()
    }
    componentDidMount(){
        this.iframeRef.current.addEventListener('load',this.onLoadFinish.bind(this))
        // const tagManagerArgs = {
        //     dataLayer: {
        //         userId: getCookie('id'),
        //         authToken : getCookie('AuthToken'),
        //         page: 'Slot Game',
        //         sportbookData:{slotGameData:this.props.game}
        //     },
        //     dataLayerName: 'User Activity Data Layer'
        // }
        // TagManager.dataLayer(tagManagerArgs)
    }
    onLoadFinish(){
        this.setState({loading:false})
    }
    showFullScreen(){
        let elem = document.getElementById("body-contents");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            this.setState({isFullScreen:true})
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
            this.setState({isFullScreen:true})
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
            this.setState({isFullScreen:true})
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
            this.setState({isFullScreen:true})
        }
    }
    exitFullScreen(){
        // let elem = document.getElementById("body-contents");
        if(document.exitFullscreen)
        {
        document.exitFullscreen();
        this.setState({isFullScreen:false})
        }
        else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
            this.setState({isFullScreen:false})
        }
        else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
            this.setState({isFullScreen:false})
        }
        else if(document.msExitFullscreen){
            document.msExitFullscreen();
            this.setState({isFullScreen:false})
        }
    }
     closeGame(){
        this.IsFullScreenCurrently() && this.exitFullScreen()
        this.props.onClose()
     }
      IsFullScreenCurrently() {
        let full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
        
        // If no element is in full-screen
        if(full_screen_element === null)
            return false;
        else
            return true;
    }
    openInPopUp(url){
        window.open( 
            url,this.props.game.name,"height=700,width=900"); 
             this.closeGame()
    }
    render(){

         const {game,togglePlayForReal}=this.props,{fullscreenMode,isFullScreen,loading}=this.state,userId = getCookie('id'), authToken = getCookie('AuthToken'); let userPart=''
         if (userId !== undefined && authToken !== undefined && game.playtype === 'real') {
             userPart= `&token=${authToken}`
         }
        return(
            <div className="big-games-overflow">
                <div className="big-game-background">
                    <div className="big-game-contain notscrolled" style={{backgroundImage:`url(${game.icon})`}}>
                        <div className="casual-game">
                            <div className="casino-game-contain" id="game-c">
                                <div className="flash-game-contain">
                                <div className="big-game-control">
                                    <div className="icon-delete"><a title="close" className="icon-cs-close" onClick={this.closeGame.bind(this)}>Close</a></div>
                                    <div className="icon-delete popup"><a title="Open In Pop-Up Window" onClick={()=>this.openInPopUp(`https://games.africabetsgh.com/authorization.php?partnerId=${851}&gameId=${game.extearnal_game_id}&language=en&openType=${game.playtype}&devicetypeid=1&platformType=0&exitURL=${encodeURIComponent('https://www.africabetsgh.com/slot-games')}`)} className="icon-cs-pop-up">popUp</a></div>
                                    <div className="icon-delete refresh">
                                    {!isFullScreen?  
                                        <a title="Open Full-Screen" onClick={this.showFullScreen.bind(this)} className="icon-cs-maximize">Full-Screen</a>
                                        :
                                        <a title="Exit Full-Screen" onClick={this.exitFullScreen.bind(this)} className="icon-cs-minimize">Exit Full-Screen</a>
                                        }
                                    </div>
                                    <div className="icon-delete favourite"><a title="Add to Favorite Games"  ng-click="toggleSaveToMyCasinoGames(gameInfo.game)" className="icon-cs-favourite">Favorite</a></div>
                                    <div className={`icon-delete favourite ${game.playtype}`} title="Click to change to real mode"><a onClick={()=>togglePlayForReal()} trans="">really/for fun</a></div>
                                    {/* <div ng-if="((wideMode &amp;&amp; viewCount === 2) || viewCount === 1) &amp;&amp; (!!hasIframeJackpot[gameInfo.game.id] || env.authorized &amp;&amp; gameInfo.game.id &amp;&amp; hasTournaments &amp;&amp; hasIframeTournamentInfo[gameInfo.game.id])" className="icon-delete closed-iframe-info"><a trans="" ng-click="iframeTab[gameInfo.game.id].show = !iframeTab[gameInfo.game.id].show"></a></div> */}
                                </div>
                                <iframe ref={this.iframeRef} className="iframe-tournament-sidebar-padding" 
                                 frame-control="" has-bottom-bar="false" has-sidebar="true" allow="autoplay; fullscreen" number-of-window="1" initial-width="" initial-height="" element-id="" 
                                 aspect-ratio="4:3" all-ratio="4:3" 
                                 src={`https://games.africabetsgh.com/authorization.php?partnerId=${851}${userPart}&gameId=${game.extearnal_game_id}&language=en&openType=${game.playtype}&tech=H5&devicetypeid=1&platformType=0&exitURL=${encodeURIComponent('https://www.africabetsgh.com/slot-games')}`} allowFullScreen={fullscreenMode}  
                                 style={{display:loading && 'none',width:isFullScreen?window.screen.width -200 +"px" :window.screen.width -400+"px",height: window.screen.height-220+"px"}} className="iframe-tournament-sidebar-padding"></iframe>
                                 <div style={{display:!loading && 'none',width:isFullScreen?window.screen.width -200 +"px" :window.screen.width -400+"px",height: window.screen.height-220+"px",transition: 'height 200ms',padding: '200ms',position: 'relative',zIndex: 5,background: 'rgba(29,29,29,.7)'}} className="iframe-tournament-sidebar-padding">
                                 <div  className="no-results-container sb-spinner" >
                                <span className="btn-preloader sb-preloader"style={{width:'100px',height:'100px'}}></span>
                                </div>
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