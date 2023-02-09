import React from 'react'
import './styles.css'
export function PaymentFailed(props) { 
    return (
        <div className="payment-body">
            <div className="payment-card col-md-5 col-sm-12">
                <div className="top failed">
                    <div className="icon"><span className="uci-warning"></span></div>
                    <div><h3>Your account deposit failed. We could not charge your wallet. Please try again</h3></div>
                    <div><h3>Contact support if you have any issues. Bet More, Win more!</h3></div>
                </div>
                <div className="bottom">
                    <button>Try Again</button>
                </div>
            </div>
        </div>
    )

 }