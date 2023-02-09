import React, { useState } from 'react'
import Promotions from '../../views/promotions'
import FAQ from '../../views/faq'
import BettingRules from '../../views/betting-rules'
import Withdrawal from '../../views/Withdrawal'
import Deposit from '../../views/deposit'
import BonusTerms from '../../views/bonus-terms'
import Lang from '../../containers/Lang';

export const Help = (props) => {
    const [formType, changeForm] = useState(1), onClose = props.onClose
    return (
        <div className="section-content col-sm-9">
            <div className="filter">
                <div className="header">
                    <div className="title" style={{ padding: '15px' }}>Help</div>
                    <div onClick={() => { onClose() }} className="close uci-close"></div>
                </div>
                <div className="sorter">
                    <div className={formType === 1 ? 'active' : ''} onClick={() => { changeForm(1) }}> <span><Lang word={"Promotions"}/> </span>
                    </div>
                    <div className={formType === 2 ? 'active' : ''} onClick={() => { changeForm(2) }}><span><Lang word={"Betting Rules"}/></span>
                    </div>
                    <div className={formType === 3 ? 'active' : ''} onClick={() => { changeForm(3) }}><span><Lang word={"Deposit"}/></span>
                    </div>
                    <div className={formType === 4 ? 'active' : ''} onClick={() => { changeForm(4) }}><span><Lang word={"Withdrawal"}/></span>
                    </div>
                    <div className={formType === 5 ? 'active' : ''} onClick={() => { changeForm(5) }}><span><Lang word={"FAQ"}/></span>
                    </div>
                    <div className={formType === 6 ? 'active' : ''} onClick={() => { changeForm(6) }}><span><Lang word={"Bonus Terms"}/></span>
                    </div>
                </div>
            </div>
            <div style={{overflowY: 'auto' }}>
                {
                    formType === 1 ?
                        <Promotions />
                        :
                        formType === 2 ?
                            <BettingRules />
                            :
                            formType === 3 ?
                                <Deposit />
                                :
                                formType === 4 ?
                                    <Withdrawal />
                                    :
                                    formType === 5 ?
                                        <FAQ />
                                        :
                                        formType === 6 ?
                                            <BonusTerms />
                                            :
                                            null
                }
            </div>
        </div>
    )
}