import React, { PureComponent } from 'react';
import SportsComponent from '../../containers/sportsComponent'
import HomeBanner from '../../components/homebanner'
import HomepageEvents from '../../components/homeEvents'
import { LiveEventLoader } from '../../components/loader'
import { SPORTSBOOK_ANY, SITE_BANNER } from '../../actionReducers';
import { allActionDucer } from '../../actionCreator';
import FeaturedGames from '../../components/featruedgame';
import API from '../../services/api'
import Helmet from 'react-helmet';
import BetSlip from '../../containers/betslip'
// import TagManager from 'react-gtm-module';
// import ReactGA from 'react-ga';
const $api = API.getInstance()
export default class Home extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            loadingInitailData: false,
            featuredbanner:[]
        }
        this.bannerRef = React.createRef()
        this.rids = this.props.sportsbook.rids
        this.timeOptions = [
            15,
            30,
            60
        ]
        $api.getBanners({bid:3},this.fBanners.bind(this),this.onError.bind(this))
        $api.getBanners({bid:1},this.bannersResult.bind(this),this.onError.bind(this))
    }
    componentDidMount() {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: 'Home', loadSports: true }))
        if (undefined !== this.props.sportsbook.sessionData.sid && undefined === this.props.sportsbook.data.sport && !this.state.loadingInitailData) {
            this.setState({ loadingInitailData: true })
            this.props.loadHomeData()
            this.loadHomeEvents()
        }
        // const tagManagerArgs = {
        //     dataLayer: {
        //         userId: this.props.profile.uid,
        //         userPhone: this.props.profile.mobilenumber,
        //         page: this.props.sportsbook.activeView,
        //         sportbookData:{}
        //     },
        //     dataLayerName: 'User Activity Data Layer'
        // }
        // TagManager.dataLayer(tagManagerArgs)
    // ReactGA.pageview('/');
    }
    componentDidUpdate() {
        if (undefined !== this.props.sportsbook.sessionData.sid && undefined === this.props.sportsbook.data.sport && !this.state.loadingInitailData) {
            this.setState({ loadingInitailData: true })
            this.props.loadHomeData()
            this.loadHomeEvents()
        }
    }
    componentWillUnmount() {
        this.props.bulkUnsubscribe([], true)
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {activeView: '',
            data: [], liveNowData: {},
            upcomingData: {},
            populargamesData: {}
        }))
    }
    bannersResult({data}){
        this.props.dispatch(allActionDucer(SITE_BANNER,{siteBanner:Array.isArray(data.data)?[...data.data]:[data.data[1]]}))
    }
    fBanners({data}){
        let newD = []
       if( Array.isArray(data.data))
      newD= [...data.data]
       else{
           for (const key in data.data) {
                   newD.push(data.data[key]);
           }
       }
        this.setState({featuredbanner:newD})
    }
    onError(d){
        console.log(d)
    }
    loadHomeEvents() {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadLiveNow: true, loadUpcomingEvents: true }))
        this.queryEvents('liveNow')
        // this.popularInSportsBook('game')
        this.queryEvents('upcoming')
    }
    queryEvents(type, mf = null) {
        let id = type === 'liveNow' ? 19 : type === 'upcoming' ? 20 : 21;
        var d = {
            source: "betting",
            what: {
                sport: ["id", "name", "alias"],
                competition: ["id", "order", "name"],
                region: ["id", "name", "alias"],
                game: "id start_ts team1_name team2_name type info markets_count match_length is_blocked is_stat_available team1_external_id team2_external_id game_external_id is_live is_started order".split(" "),
                event: ["id", "price", "type", "name", "order"],
                market: ["id", "type", "express_id", "cashout", "name", "home_score", "away_score"]
            },
            where: {
                game: {
                    // "@limit": this.props.sportsbook.gameLimit
                },
                market: {
                    display_key: "WINNER", display_sub_key: "MATCH"
                }
            }
        };
        d.where.sport = {
            type: {
                "@ne": 1
            }
        };
        if ("lastMinutesBets" === type) {
            d.where.game.start_ts = {
                "@now": {
                    "@gte": 0,
                    "@lt": 60 * (mf ? mf : this.props.sportsbook.minutesFilter)
                }
            }
        } else if ("liveNow" === type) { d.where.game.type = 1; d.where.game.is_started = 1 }
        else if ("upcoming" === type) {
            d.where.game.start_ts =
                {
                    "@now": {
                        "@gte": 0,
                        "@lt": 60 * (mf ? mf : this.props.sportsbook.minutesFilter)
                    }
                }
            d.where.game.type = 2; d.where.game.is_started = 0;
        }
        this.rids[id].request = {
            command: "get",
            params: { ...d, subscribe: true }, rid: id
        }
        this.props.sendRequest(this.rids[id].request)
    }
    setMinutesFilter(filter) {
        if (filter !== null && void 0 !== filter) {
            this.queryEvents('upcoming', this.timeOptions[filter])
            this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { minutesFilter: this.timeOptions[filter], loadUpcomingEvents: true }))
        }
    }
    render() {
        const {
            loadUpcomingEvents, loadLiveNow, minutesFilter, liveNowData, upcomingData, betSelections, oddType, data,
            populargamesData, activeView, activeGame,appTheme
        } = this.props.sportsbook, { loadMarkets, loadGames, addEventToSelection, unsubscribe,
            subscribeToSelection,
            retrieve, validate, sendRequest, getBetslipFreebets, history,handleBetResponse } = this.props,{siteBanner}= this.props.homeData,{featuredbanner}=this.state
        const sport = data ? data.sport : {}, newdata = [], pg = []
        for (let data in sport) {
            if (null !== sport[data])
                newdata.push(sport[data])
        }
        newdata.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            }
            if (b.order > a.order) {
                return -1;
            }
            return 0;
        })
        Object.keys(populargamesData).forEach((g) => {
            if (null !== populargamesData[g] && void 0 !== populargamesData[g])
                pg.push(populargamesData[g])
        })
        return (
            <div className={`sportsbook-container ${appTheme+'-theme'}`}>
                <Helmet>
                    <title>Corisbet Gambling - Sports Betting</title>
                </Helmet>
                <div className="sportsbook-inner">
                    <div className="sportsbook-view">
                        <div className="sportsbook-content">
                            <div className="event-view col-sm-12">
                                <SportsComponent history={history} multiview={false} loadGames={loadGames} loadMarkets={loadMarkets} addEventToSelection={addEventToSelection} sendRequest={sendRequest} />

                                <div className={`promotion col-sm-8`}>
                                    <div>
                                        <div className="promo-banner">
                                            <div>
                                                <HomeBanner photos={siteBanner} featured_banner={featuredbanner} history={this.props.history}/>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        pg.length?
                                        <div className="events-container">
                                            <div className="content-body">
                                                <div className="header">
                                                    <div className="title">Featured Games</div>
                                                </div>
                                            </div>
                                            {loadLiveNow ?
                                                <LiveEventLoader is_live={true} />
                                                :
                                                <FeaturedGames history={history} data={pg} activeView={activeView} loadMarkets={loadMarkets}

                                                    loadGames={loadGames} activeGame={activeGame} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} />
                                            }
                                        </div>
                                        :''
                                    }
                                    <div className="events-container">
                                        <div className="content-body">
                                            <div className="header">
                                                <div className="title"> LIVE NOW</div>
                                            </div>
                                        </div>
                                        {loadLiveNow ?
                                            <LiveEventLoader is_live={true} />
                                            :
                                            <HomepageEvents history={history} data={liveNowData} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} is_live={true} onEventClick={loadMarkets} />
                                        }
                                    </div>
                                    <div className="top-events">

                                    </div>
                                    <div className="events-container">
                                        <div className="content-body">
                                            <div className="header">
                                                <div className="title">Upcoming Events</div>
                                                {
                                                    !loadUpcomingEvents ?
                                                        <div className={`minutes-filter`}>
                                                            <div onClick={() => this.setMinutesFilter(0)} className={`filter-button ${minutesFilter === 15 ? 'active' : ''}`}>15 Minutes</div>
                                                            <div onClick={() => this.setMinutesFilter(1)} className={`filter-button ${minutesFilter === 30 ? 'active' : ''}`}>30 Minutes</div>
                                                            <div onClick={() => this.setMinutesFilter(2)} className={`filter-button ${minutesFilter === 60 ? 'active' : ''}`}>60 Minutes</div>
                                                        </div> :
                                                        null
                                                }
                                            </div>
                                        </div>
                                        {loadUpcomingEvents ?
                                            <LiveEventLoader is_live={false} />
                                            :
                                            <HomepageEvents history={history} data={upcomingData} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} is_live={false} onEventClick={loadGames} />
                                        }
                                    </div>
                                </div>
                                <BetSlip unsubscribe={unsubscribe}
          subscribeToSelection={subscribeToSelection}
          retrieve={retrieve} validate={validate} sendRequest={sendRequest} getBetslipFreebets={getBetslipFreebets} handleBetResponse={handleBetResponse}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}