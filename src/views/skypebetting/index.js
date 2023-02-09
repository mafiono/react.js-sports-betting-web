import React from 'react';
import Skype from '../../images/skype.png'
import './style.css'
export default function SkypeBetting(props) { 
    return(
        <div className="about-us col-sm-12 article" >
        <div className="col-sm-8" style={{width:"100%",}}>
           <div className="col-sm-12" style={{width:"100%",borderBottomWidth:"2px", borderBottomColor:"#08b981",borderBottomStyle:'solid'}}> 
               <h1 className='title'>SKYPE BETTING</h1>
            </div>
        </div>
        <div className="col-sm-8">
            <div > 
               <h1 className='title'>FOR PROFESSIONAL BETTING</h1>
            </div>
            <div className="col-sm-12" style={{display:"flex"}}>
            <div className="col-sm-6 text-container">
                <span>Corisbet Gambling provides Skype Betting – a well-known and convenient service preferred by players that are looking for even higher limits than what the Asian bookies can regularly offer on sportsbook websites.
                </span>
            </div>
            <div className="col-sm-6" style={{justifyContent:'center',display:'flex',flexDirection:"column",alignItems:'center'}}>
                <img  style={{width:'unset'}}className="skype" src={Skype} width="200" height="100"></img>
                <div>
                    <button className="open-account">Open Account</button>
                </div>
            </div>
            </div>
        </div>
        <div className="col-sm-8">
            <div > 
               <h1 className='title'>WHY CHOOSE SKYPE?</h1>
            </div>
            <div className="col-sm-12">
            <div className="col-sm-12 text-container">
                <span>Corisbet Gambling provides Skype Betting – a well-known and convenient service preferred by players that are looking for even higher limits than what the Asian bookies can regularly offer on sportsbook websites.
                </span>
            </div>
            </div>
        </div>
        <div className="col-sm-8">
            
            <div className="col-sm-12" style={{display:"flex"}}>
            <div className="col-sm-6" style={{padding:"10px"}}>
            <div > 
               <h1 className='title'>HOW TO PLACE BETS VIA SKYPE BETTING?</h1>
            </div>
            <div className="col-sm-12 text-container">
                <span>Using the Skype Betting service, Corisbet Gambling will process your requests via a dedicated Skype or Telegram channel. Corisbet Gambling special resources provide you with a chance to bet without limits and get the bet requests completed swiftly and without having to compromise on odds. You can make a request by stating the game and selection, following the minimum odds and stake, and Corisbet Gambling trading team will deliver!

Skype Betting service is available from 9:00-23:00h CET.
                </span>
            </div>
            </div>
            <div className="col-sm-6" style={{padding:"10px"}}>
            <div > 
               <h1 className='title'>HOW TO OPEN AN ACCOUNT?</h1>
            </div>
            <div className="col-sm-12 text-container">
                <span>For more information regarding Skype Betting service or other products and services, please contact Corisbet Gambling Customer Support via support@corisbet.com or use the live chat option
                </span>
            </div>
            </div>
            </div>
        </div>
    </div>
    )
 }