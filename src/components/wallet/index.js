import React, { PureComponent } from "react";
import moment from "moment-timezone";
import {
  onFormInputFocus,
  onFormInputFocusLost,
  makeToast,
  getCookie,
} from "../../common";
import { calcMD5 } from "../../utils/jsmd5";
import API from "../../services/api";
import './style.css'
import Lang from "../Lang";
const $api = API.getInstance();
export default class Wallet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formType: 1,
      uid: getCookie("id"),
      AuthToken: getCookie("AuthToken"),
      email: getCookie("email"),
      phoneNumber: this.props.profile.mobilenumber,
      externalAcc:'',
      amount: "",
      formStep: 1,
      telcoType: 1,
      voucher: "",
      password: "",
      showPass: false,
      source: 1,
      loadingMethods: false,
      openedItem: null,
      paymentOptions: [
      ],
      withdrawalOptions: [
      ],
    };
    $api.setToken(this.state.AuthToken);
    this.onInputChange = this.onInputChange.bind(this);
    this.changeTelco = this.changeTelco.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.attemptWithdrawal = this.attemptWithdrawal.bind(this);
    this.attemptForceWithdrawal = this.attemptForceWithdrawal.bind(this);
    this.attemptDeposit = this.attemptDeposit.bind(this);
  }
  componentDidMount() {
    this.setState({ loadingMethods: true });
    $api.paymentOptions(
      ({ data }) => {
        if (data.status === 200) {
          this.setState({ paymentOptions: data.data, loadingMethods: false });
        } else {
          this.setState({ loadingMethods: false });
        }
      },
      (res) => {
        this.setState({ loadingMethods: false });
      }
    );
    $api.withdrawalOptions(
      ({ data }) => {
        if (data.status === 200) {
          this.setState({ withdrawalOptions: data.data, loadingMethods: false });
        } else {
          this.setState({ loadingMethods: false });
        }
      },
      (res) => {
        this.setState({ loadingMethods: false });
      }
    );
  }
  changeForm(type) {
    if (type !== this.props.formType) {
      this.setState({ amount: "", password: "",externalAcc:"",openedItem:0 });
      this.props.changeForm(type);
    }
  }
  toggleShow() {
    !this.state.changingpass &&
      this.setState((prevState) => ({ showPass: !prevState.showPass }));
  }
  onInputChange(e) {
    let $el = e.target,
      newState = {};
    newState[$el.name] = $el.value;
    newState[$el.name + "Empty"] = false;
    if (!this.state.formEdited) newState["formEdited"] = true;
    this.setState(newState);
  }
  changeTelco(telco) {
    this.state.telcoType !== telco &&
      this.setState({ telcoType: telco, amount: "" });
  }
  attemptDeposit() {
    makeToast("We are rocessing your request", 5000, {
      position: "top",
    });
    this.setState({ attemptingDeposit: true });
    const {
        telcoType,
        externalAcc,
        voucher,
        uid,
        AuthToken,
        amount,
        openedItem,
        email,
        paymentOptions
      } = this.state,
      $time = moment().format("YYYY-MM-DD H:mm:ss"),
      $hash = calcMD5(
        `AuthToken${AuthToken}uid${uid}email${email}type${paymentOptions[openedItem].id}amount${amount}${
          telcoType === 2 ? `voucher${voucher}` : ""
        }time${$time}${this.props.appState.$publicKey}`
      );
    let p = {
      pay_type: paymentOptions[openedItem].id,
      amount: amount,
      type: paymentOptions[openedItem].id,
      email: email,
      uid: uid,
      external_acc: externalAcc,
      type_alias: paymentOptions[openedItem].alias,
      AuthToken: AuthToken,
      uid: uid,
      time: $time,
      hash: $hash,
    };
    if (telcoType === 2) p.voucher = voucher;
    $api.deposit(p, this.onDepositSuccess.bind(this));
  }
  onDepositSuccess({ data }) {
    this.setState({ attemptingDeposit: false });
    this.props.depositSuccessDialog(data)
    // makeToast("null" === data.msg ? "Reguest timeout" : data.msg, 6000, {
    //   position: "top",
    //   type: data.status === 200 ? "success" : "error",
    // });
  }
  attemptWithdrawal() {
    this.setState({ attemptingWithdrawal: true });
    const {
        email,
        password,
        uid,
        AuthToken,
        amount,
        openedItem,
        externalAcc,
        withdrawalOptions
      } = this.state,
      $time = moment().format("YYYY-MM-DD H:mm:ss"),
      $hash = calcMD5(
        `AuthToken${AuthToken}uid${uid}email${email}withdrawaltype${withdrawalOptions[openedItem].id}amount${amount}password${password}time${$time}${this.props.appState.$publicKey}`
      );
    let p = {
      withdrawaltype: withdrawalOptions[openedItem].id,
      password: password,
      amount: amount,
      email: email,
      uid: uid,
      pay_type: withdrawalOptions[openedItem].id,
      type: withdrawalOptions[openedItem].id,
      external_acc: externalAcc,
      type_alias: withdrawalOptions[openedItem].alias,
      AuthToken: AuthToken,
      uid: uid,
      time: $time,
      hash: $hash,
    };
    $api.withdraw(p, this.onWithdrawSuccess.bind(this));
  }
  attemptForceWithdrawal() {
    this.setState({ attemptingForceWithdrawal: true });
    const {
        source,
        phoneNumber,
        password,
        uid,
        AuthToken,
        amount,
      } = this.state,
      $time = moment().format("YYYY-MM-DD H:mm:ss"),
      $hash = calcMD5(
        `AuthToken${AuthToken}uid${uid}mobile${phoneNumber}withdrawaltype${source}amount${amount}password${password}time${$time}${this.props.appState.$publicKey}`
      );
    let p = {
      compel: 1,
      withdrawaltype: source,
      password: password,
      amount: amount,
      mobile: phoneNumber,
      uid: uid,
      AuthToken: AuthToken,
      uid: uid,
      time: $time,
      hash: $hash,
    };
    $api.withdraw(p, this.onWithdrawSuccess.bind(this));
  }
  onWithdrawSuccess({ data }) {
    this.setState({
      attemptingWithdrawal: false,
      attemptingForceWithdrawal: false,
    });
    this.props.withdrawSuccessDialog(data)
  }
  render() {
    const {
        amount,
        password,
        showPass,
        attemptingWithdrawal,
        attemptingDeposit,
        paymentOptions,
        withdrawalOptions,
        loadingMethods,
        openedItem,
        externalAcc
      } = this.state,
      profile = this.props.profile,
      { formType, onClose } = this.props;
    return (
      <div className="section-content col-sm-9">
        <div className="filter">
          <div className="header">
            <div className="title" style={{ padding: "15px" }}>
              <Lang word={"My Wallet"}/>
            </div>
            <div
              onClick={() => {
                onClose();
              }}
              className="close uci-close"
            ></div>
          </div>
          <div className="sorter">
            <div
              className={formType === 1 ? "active" : ""}
              onClick={() => {
                this.changeForm(1);
              }}
            >
              {" "}
              <span><Lang word={"Deposit"}/> </span>
            </div>
            <div
              className={formType === 2 ? "active" : ""}
              onClick={() => {
                this.changeForm(2);
              }}
            >
              <span><Lang word={"Withdrawal"}/></span>
            </div>
          </div>
        </div>
        {formType === 1 ? (
          <div style={{margin:0,height:"100%",overflow:"scroll"}}>
            {
              loadingMethods?
              <div className="no-results-container sb-spinner">
                            <span className="btn-preloader sb-preloader"></span>
                          </div>
              :
          paymentOptions.map((paymentmethod,index) => (
            <>
              <div key={paymentmethod.alias+"DP"} className="deposit" style={{borderTopWidth:"5px",borderTopColor:paymentmethod.themecolor,transition:"height .5s linear"}}>
                <div className="">
                  <div className="deposit-type ">
                    <div className="header" onClick={()=>this.setState((prev)=>({openedItem:prev.openedItem===index?null:index}))}>
                      <div className="type-logo col-sm-2">
                        <img alt="" src={paymentmethod.icon} />
                      </div>
                      <div className="type-logo col-sm-3">

                      </div>
                      <div className="type-name col-sm-7">
                        <span style={{fontSize:"13px"}}>{paymentmethod.merchant}</span>
                      </div>
                      <div className="type-limit"></div>
                    </div>
                    <div className="deposit-type-content">
                      <div className="instruction-form col-sm-8">
                        <div className="conditions"  onClick={()=>this.setState((prev)=>({openedItem:prev.openedItem===index?null:index}))}>
                          <div className="cons">
                            <div className="icon-sb-success"></div>
                            <div>
                              <span>
                                <Lang word={"Processing Time"}/>: {paymentmethod.processing}
                              </span>
                            </div>
                          </div>
                          <div className="cons">
                            <div className="icon-sb-success"></div>
                            <div>
                              <span>
                                <Lang word={"Min. Deposit amount"}/>: {paymentmethod.min_deposit}
                              </span>
                            </div>
                          </div>
                          <div className="cons">
                            <div className="icon-sb-success"></div>
                            <div>
                              <span><Lang word={"Fee"}/>: {paymentmethod.fee === "on"? paymentmethod.fee_rate+"%":Lang("Free")}</span>
                            </div>
                          </div>
                          <div className="cons">
                            <div className="icon-sb-success"></div>
                            <div>
                              <span>
                                <Lang word={"Max. Deposit amount"}/>: {paymentmethod.max_deposit}
                              </span>
                            </div>
                          </div>
                          {paymentmethod.bonus!==null && (
                            <div className="cons">
                              <div className="icon-sb-success"></div>
                              <div>
                                <span>Bonus: {paymentmethod.bonus}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {openedItem === index&&
                        <>
                        <div className="deposit-summary"style={{backgroundColor:paymentmethod.themecolor}}>
                          <div>
                            <div>
                              <span>
                                {paymentmethod.alias.toLowerCase() === "btc"
                                  ? `Total ${profile.currency}`
                                  : "Amount"}{" "}
                                <Lang word={"to be deposited"}/>
                              </span>
                            </div>
                            <div>
                              <span>
                                {amount||"0.00"} {profile.currency}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div>
                              <span><Lang word={"Fee"}/></span>
                            </div>
                            <div>
                              <span>
                                {amount&&(
                                  parseFloat(amount) * (parseFloat(`${paymentmethod.fee_rate}`)/100)
                                ).toFixed(2)}{" "}
                                {profile.currency}
                              </span>
                            </div>
                          </div>
                          <div></div>
                          <div className="seperator"></div>
                          <div>
                            <div>
                              <span>
                                <Lang word={"Total"}/>{" "}
                                {paymentmethod.alias.toLowerCase() === "btc"
                                  ? Lang("BTC to be sent")
                                  : Lang("Amount")}
                              </span>
                            </div>
                            <div>
                              <span>
                                {amount&&(
                                  parseFloat(amount) +
                                  (parseFloat(amount) * (parseFloat(`${paymentmethod.fee_rate}`)/100))
                                ).toFixed(2)}{" "}
                                {profile.currency}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="sb-login-form-container sign-in" style={{width:"100%"}}>
                          <div style={{width:"unset"}}>
                            <div className="liquid-container ember-view">
                              <div className="liquid-child ember-view">
                                <div
                                  data-step="sign-in"
                                  className="sb-login-step active ember-view"
                                >
                                  <div className="sb-login-form-wrapper">
                                    <div
                                      className={`form ${
                                        openedItem !== index
                                          ? "animated fadeOut"
                                          : "fadeIn animated"
                                      }`}
                                      id={"pay-" + paymentmethod.id}
                                    >
                                      {paymentmethod.alias.toLowerCase() !==
                                        "btc" && (
                                        <div className="ember-view col-sm-12">
                                          <div className="form-group required">
                                            <div className="form-element empty">
                                              <div className="input-wrapper ">
                                                <input
                                                 name={"externalAcc"}
                                                  value={externalAcc}
                                                  className={`ember-text-field ember-view`}
                                                  type="text"
                                                  onFocus={(e) =>
                                                    onFormInputFocus(e)
                                                  }
                                                  onBlur={(e) =>
                                                    onFormInputFocusLost(e)
                                                  }
                                                  autoComplete="off"
                                                  onChange={this.onInputChange}
                                                />
                                                <span
                                                  className={`placeholder ${
                                                    externalAcc === "" &&
                                                    "placeholder-inactive"
                                                  }`}
                                                >
                                                  <Lang word={"Enter"}/> {paymentmethod.alias}{" "}
                                                  <Lang word={"Number/Email"}/>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <div className="ember-view col-sm-12">
                                        <div className="form-group required">
                                          <div className="form-element empty">
                                            <div className="input-wrapper ">
                                              <div className="field-icons-container ember-view">
                                                <div className="password-visibility-block">
                                                  <span className="password-visibility icon" style={{padding:5,fontSize:13}}>{profile.currency}</span>
                                                </div>
                                              </div>
                                              <input
                                                name="amount"
                                                value={amount}
                                                className={`ember-text-field ember-view`}
                                                type="number"
                                                onFocus={(e) =>
                                                  onFormInputFocus(e)
                                                }
                                                onBlur={(e) =>
                                                  onFormInputFocusLost(e)
                                                }
                                                autoComplete="off"
                                                onChange={this.onInputChange}
                                              />
                                              <span
                                                className={`placeholder ${
                                                  amount === "" &&
                                                  "placeholder-inactive"
                                                }`}
                                              >
                                                <Lang word={"Amount"}/>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="error-box">
                                        <span></span>
                                      </div>
                                      <button
                                        onClick={this.attemptDeposit}
                                        disabled={
                                          (paymentmethod.alias.toLowerCase() !== 'btc'  &&
                                            (amount === "" ||externalAcc === "" ||
                                              parseFloat(amount) < paymentmethod.min_deposit||
                                              parseFloat(amount) > paymentmethod.max_deposit)) ||
                                          (paymentmethod.alias.toLowerCase() === 'btc' &&
                                            (amount === "" ||
                                              parseFloat(amount) < paymentmethod.min_deposit||
                                              parseFloat(amount) > paymentmethod.max_deposit)) ||
                                          attemptingDeposit
                                        }
                                        className="sb-account-btn btn-primary submit-join-now "
                                        type="submit"
                                        style={{ marginTop: 0 }}
                                      >
                                        {attemptingDeposit ? (
                                          <div className="no-results-container sb-spinner">
                                            <span className="btn-preloader sb-preloader"></span>
                                          </div>
                                        ) : Lang(
                                          "Deposit"
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        </>
                        }
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
           </div>
        ) : (
          <div style={{margin:0,height:"100%",overflow:"scroll"}}>
          {
            loadingMethods?
            <div className="no-results-container sb-spinner">
                          <span className="btn-preloader sb-preloader"></span>
                        </div>
            :
        withdrawalOptions.map((paymentmethod,key) => (
          <>
            <div key={paymentmethod.alias+"W"} className="deposit" style={{borderTopWidth:"5px",borderTopColor:paymentmethod.themecolor,transition:"height .5s linear"}}>
              <div className="">
                <div className="deposit-type ">
                  <div className="header" onClick={()=>this.setState((prev)=>({openedItem:prev.openedItem===key?null:key}))}>
                    <div className="type-logo col-sm-2">
                      <img alt="" src={paymentmethod.icon} />
                    </div>
                    <div className="type-logo col-sm-3">

                    </div>
                    <div className="type-name col-sm-7">
                      {/* <span style={{fontSize:"13px"}}>{paymentmethod.merchant}</span> */}
                    </div>
                    <div className="type-limit"></div>
                  </div>
                  <div className="deposit-type-content">
                    <div className="instruction-form col-sm-8">
                      <div className="conditions"  onClick={()=>this.setState((prev)=>({openedItem:prev.openedItem===key?null:key}))}>
                        <div className="cons">
                          <div className="icon-sb-success"></div>
                          <div>
                            <span>
                              <Lang word={"Processing Time"}/>: {paymentmethod.processing}
                            </span>
                          </div>
                        </div>
                        <div className="cons">
                          <div className="icon-sb-success"></div>
                          <div>
                            <span>
                              <Lang word={"Min. Withdrawal amount"}/>: {paymentmethod.min_withdrawal}
                            </span>
                          </div>
                        </div>
                        <div className="cons">
                          <div className="icon-sb-success"></div>
                          <div>
                            <span><Lang word={"Fee"}/>: {paymentmethod.fee ==="on"? paymentmethod.widthrawal_fee+"%":"Free"}</span>
                          </div>
                        </div>
                        <div className="cons">
                          <div className="icon-sb-success"></div>
                          <div>
                            <span>
                              <Lang word={"Max. Withdrawal amount"}/>: {paymentmethod.max_withdrawal}
                            </span>
                          </div>
                        </div>
                        {/* {paymentmethod.bonus!==null && (
                          <div className="cons">
                            <div className="icon-sb-success"></div>
                            <div>
                              <span>Bonus: {paymentmethod.bonus}</span>
                            </div>
                          </div>
                        )} */}
                      </div>
                      {openedItem === key&&
                      <>
                      <div className="deposit-summary"style={{backgroundColor:paymentmethod.themecolor}}>
                        <div>
                          <div>
                            <span>
                              {paymentmethod.alias.toLowerCase() === "btc"
                                ? Lang("Total")` ${profile.currency}`
                                : Lang("Amount")}{" "}
                              <Lang word={"to be Withdrawn"}/>
                            </span>
                          </div>
                          <div>
                            <span>
                              {amount||"0.00"} {profile.currency}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div>
                            <span><Lang word={"Fee"}/></span>
                          </div>
                          <div>
                            <span>
                              {amount&&(
                                parseFloat(amount) * (parseFloat(`${paymentmethod.fee_rate}`)/100)
                              ).toFixed(2)}{" "}
                              {profile.currency}
                            </span>
                          </div>
                        </div>
                        <div></div>
                        <div className="seperator"></div>
                        <div>
                          <div>
                            <span>
                              <Lang word={"Total"}/>{" "}
                              {paymentmethod.alias.toLowerCase() === "btc"
                                ? "BTC " + Lang("to be recieved")
                                : "Amount"}{" "}
                            </span>
                          </div>
                          <div>
                            <span>
                              {amount&&(
                                parseFloat(amount) +
                                (parseFloat(amount) * (parseFloat(`${paymentmethod.widthrawal_fee}`)/100))
                              ).toFixed(2)}{" "}
                              {profile.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="sb-login-form-container sign-in" style={{width:"100%"}}>
                        <div style={{width:"unset"}}>
                          <div className="liquid-container ember-view">
                            <div className="liquid-child ember-view">
                              <div
                                data-step="sign-in"
                                className="sb-login-step active ember-view"
                              >
                                <div className="sb-login-form-wrapper">
                                  <div
                                    className={`form ${
                                      openedItem !== key
                                        ? "animated fadeOut"
                                        : "fadeIn animated"
                                    }`}
                                    id={"pay-" + paymentmethod.id}
                                  >
                                    
                                      <div className="ember-view col-sm-12">
                                        <div className="form-group required">
                                          <div className="form-element empty">
                                            <div className="input-wrapper ">
                                              <input
                                               name={"externalAcc"}
                                                value={externalAcc}
                                                className={`ember-text-field ember-view`}
                                                type="text"
                                                onFocus={(e) =>
                                                  onFormInputFocus(e)
                                                }
                                                onBlur={(e) =>
                                                  onFormInputFocusLost(e)
                                                }
                                                autoComplete="off"
                                                onChange={this.onInputChange}
                                              />
                                              <span
                                                className={`placeholder ${
                                                  externalAcc === "" &&
                                                  "placeholder-inactive"
                                                }`}
                                              >
                                                <Lang word={"Enter"}/> {paymentmethod.alias}{" "}
                                               {Lang(paymentmethod.alias.toLowerCase() !==
                                      "btc"?"Account Number/Email":"Wallet Address")}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                  
                                    <div className="ember-view col-sm-12">
                                      <div className="form-group required">
                                        <div className="form-element empty">
                                          <div className="input-wrapper ">
                                            <div className="field-icons-container ember-view">
                                              <div className="password-visibility-block">
                                                <span className="password-visibility icon" style={{padding:5,fontSize:13}}>{profile.currency}</span>
                                              </div>
                                            </div>
                                            <input
                                              name="amount"
                                              value={amount}
                                              className={`ember-text-field ember-view`}
                                              type="number"
                                              onFocus={(e) =>
                                                onFormInputFocus(e)
                                              }
                                              onBlur={(e) =>
                                                onFormInputFocusLost(e)
                                              }
                                              autoComplete="off"
                                              onChange={this.onInputChange}
                                            />
                                            <span
                                              className={`placeholder ${
                                                amount === "" &&
                                                "placeholder-inactive"
                                              }`}
                                            >
                                              <Lang word={"Amount"}/>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-group required">
                                      <div className="form-element empty">
                                        <div className="input-wrapper  show-password-switcher">
                                          <div className="field-icons-container ember-view">
                                            <div
                                              className="password-visibility-block"
                                              onClick={this.toggleShow}
                                            >
                                              <span
                                                className={`password-visibility icon ${
                                                  showPass ? "icon-sb-hide" : "icon-sb-show"
                                                }`}
                                              ></span>
                                            </div>
                                          </div>
                                          <input
                                            name="password"
                                            value={password}
                                            required
                                            className="ember-text-field ember-view"
                                            type={showPass ? "text" : "password"}
                                            onFocus={(e) => onFormInputFocus(e)}
                                            onBlur={(e) => onFormInputFocusLost(e)}
                                            autoComplete="off"
                                            onChange={this.onInputChange}
                                          />
                                          <span
                                            className={`placeholder ${
                                              password === "" && "placeholder-inactive"
                                            }`}
                                          >
                                            {" "}
                                            <Lang word={"Password"}/>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="error-box">
                                      <span></span>
                                    </div>
                                    <button
                                        onClick={this.attemptWithdrawal}
                                        disabled={
                                          
                                            (amount === "" ||externalAcc === "" ||
                                              parseFloat(amount) < paymentmethod.min_withdrawal||
                                              parseFloat(amount) > paymentmethod.max_withdrawal)
                                        }
                                        className="sb-account-btn btn-primary submit-join-now "
                                        type="submit"
                                        style={{ marginTop: 0 }}
                                      >
                                        {attemptingWithdrawal ? (
                                          <div className="no-results-container sb-spinner">
                                            <span className="btn-preloader sb-preloader"></span>
                                          </div>
                                        ) : Lang(
                                          "Withdraw"
                                        )}
                                      </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </>
                      }
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
         </div>
          
        )}
      </div>
    );
  }
}
