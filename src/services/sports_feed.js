import axios from 'axios'
import { errorHandler } from '../utils/index';
class SportsFeedAPI{
    static instance = null

    constructor(){
        this.isLoggedIn = false
        this.token = null
        this.cancelToken = axios.CancelToken.source()

        this.http = axios.create({
            baseURL:"https://bet365-sports-odds.p.rapidapi.com",
            headers:{'Content-Type': 'application/json;charset=utf-8',
            "x-rapidapi-host": " bet365-sports-odds.p.rapidapi.com ", 
            "x-rapidapi-key": "2154ae0934mshe44abfa1b9a3d90p1b74b0jsn1d50e61d0934"},
            cancelToken:this.cancelToken.token
        })
         this.http.interceptors.request.use((config)=>{
             if(this.isLoggedIn){
                 config.headers.common['Authorization'] = 'Bearer '+this.token
             }
             return config
         })
    }

    static getInstance = ()=>{
        if(SportsFeedAPI.instance == null){
            SportsFeedAPI.instance = new SportsFeedAPI();
        }
        return SportsFeedAPI.instance
    }

    setToken =  (token)=> {
        this.token = token
        this.isLoggedIn=true
    }

    logError(error){
      errorHandler(error)
    }
    
    getSportsDataPrematch(params,success,error){
        this.http.get('v1/bet365/upcoming',{params:params}).then(success,error)
    }
    getSportsDataInplay(params,success,error){
        this.http.get('v1/bet365/inplay',{params:params}).then(success,error)
    }
    getPrematchOdds(params,success,error){
        this.http.get('v3/bet365/prematch',{params:params}).then(success,error)
    }
    getInplayOdds(params,success,error){
        this.http.get('v1/bet365/event',{params:params}).then(success,error)
    }
    getInplayFilter(params,success,error){
        this.http.get('v1/bet365/inplay_filter',{params:params}).then(success,error)
    }
    getMatchResults(params,success,error){
        this.http.get('v1/bet365/result',{params:params}).then(success,error)
    }
    cancelRequest(){
        this.cancelToken.cancel("Request cancelled @ "+Date.now())
    }

}


export default SportsFeedAPI;