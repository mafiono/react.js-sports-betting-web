import React from 'react'
import './styles.css'
export function PaymentSuccess(props) { 
    return (
        <div className="payment-body">
            <div className="payment-card col-sm-6 col-md-5">
                <div className="top success col-sm-12">
                    <div className="icon"><span className="icon-sb-success"></span></div>
                    <div><h3>Thank You for your payment. Your account has been credited with the said amount.</h3></div>
                    <div><h3>Contact support if you have any issues. Bet More, Win more!</h3></div>
                </div>
                <div className="bottom col-sm-12">
                    {/* <button></button> */}
                </div>
            </div>
        </div>
    )

 }