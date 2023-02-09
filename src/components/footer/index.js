import React, { PureComponent } from 'react'
import './footer.css'
import moment from 'moment'
import Skrill from '../../images/Skrill-Logo.svg'
import Neteller from '../../images/NETELLER.png'
import BitCoin from '../../images/bitcoin.svg'
import Ecopayz from '../../images/ecopayz.png'
import PlayStore from '../../images/GoogleplayStore.png'
import QRimg from '../../images/QRIMG.png'
import { NavLink } from "react-router-dom";
export default class Footer extends PureComponent {
    render() {
        return (
            <div className="footer-container">
                <div className="footer-body">
                    <div className="footer-inner">
                        <div className="footer-row top">

                            <div className="footer-col">
                                <div className="footer-col-content">
                                    <div className="title">About</div>
                                    {/* <div className="item"><NavLink exact to="/about-us"><span>About us</span></NavLink></div> */}
                                    <div className="item"><NavLink exact to="/responsible-gaming"><span>Responsible Gaming</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/afiliate-program"><span>Affiliate Program</span></NavLink></div>
                                </div>
                            </div>
                            {/* <div className="footer-col">
                                <div className="footer-col-content">
                                    <div className="title">Help</div>
                                    <div className="item"><NavLink exact to="/faq"><span>FAQS</span></NavLink></div>
                                    <div className="item"> <NavLink exact to="/betting-rules"><span>Betting Rules</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/promotions"><span>Promotions</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/bonus-terms"><span>Bonus Terms</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/deposits"><span>Deposits</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/withdrawals"><span>Withdrawals</span></NavLink></div>
                                </div>
                            </div> */}
                            <div className="footer-col">
                                <div className="footer-col-content">
                                    <div className="title">Corisbet Gambling</div>
                                    {/* <div className="item">RNG Certificate</div> */}
                                    <div className="item"> <NavLink exact to="/general-terms-and-conditions"><span>General Terms &amp; Conditions</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/privacy-policy"><span>Privacy Policy</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/cookies-policy"><span>Cookies Policy</span></NavLink></div>
                                    <div className="item"><NavLink exact to="/contact-us"><span>Contact Us</span></NavLink></div>
                                    {/* <div className="item"><NavLink exact to="/careers"><span>Careers</span></NavLink></div> */}
                                    {/* <div className="item"><NavLink exact to="/betting-new"><span>Responsible Gaming</span></NavLink></div> */}
                                </div>
                            </div>
                            <div className="footer-col">
                                <div className="footer-col-content">
                                    <div className="title">Mobile App</div>
                                    <div className="item">
                                        <a href="https://corisbet.com/app.php/9" target="_blank" style={{textDecoration:'none'}}>
                                        <img src={PlayStore} />
                                        </a>
                                        <a href="" target="_blank" style={{textDecoration:'none'}}>
                                        <img src={QRimg} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-col">
                                <div className="footer-col-content">
                                    <div className="title">Payment Options</div>
                                    <div className="item"><img src={Skrill}/></div>
                                    <div className="item" ><img src={Neteller}/></div>
                                    <div className="item"><img src={BitCoin}/></div>
                                    <div className="item"><img src={Ecopayz}/></div>
                                
                                </div>
                            </div>
                            <div className="footer-col">
                                <div className="footer-col-content">
                                    <div className="age-strict"><strong>18+</strong></div>
                                    {/* <div className="item" style={{ color: 'crimson', fontSize: '14px', fontWeight: 700 }}>Payment Options</div>
                                    <div className="item">
                                        <div className="social">
                                            <ul className=" square" data-module-id="65">
                                                <li className="uci-facebook-square main-font-typography">
                                                    <img src={Skrill}/>
                                                </li>
                                                <li className="uci-twitter-square main-font-typography">
                                                    <img src={Neteller}/>
                                                </li>
                                                <li className="uci-instagram-square main-font-typography">
                                                    <img src={BitCoin}/>
                                                </li>
                                                <li className="uci-youtube-square main-font-typography">
                                                    <img src={Ecopayz}/>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>  */}
                                </div>
                            </div>
                        </div>
                        <div className="footer-row bottom">
                            <div className="footer-col">
                                <p className="brag">Corisbet Gambling welcome punters with highs quality types of both online and offline sports, virtual games and slot games, featuring differentiated high odds, intensive risk management and continuously optimized user experience.</p>
                                <p className="copy-right">Copyright © {moment().format('YYYY')} Corisbet Gambling. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}