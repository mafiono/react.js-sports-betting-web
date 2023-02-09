import React,{ PureComponent} from 'react'
import { Link } from 'react-router-dom';


export default class  PageNotFoun extends PureComponent{
     constructor(props){
          super(props)
         this.timeout=null
     }
     type = (n, t)=> {
        var str = document.getElementsByTagName("code")[n].innerHTML.toString();
        var i = 0;
        document.getElementsByTagName("code")[n].innerHTML = "";
    
        this.timeout=  setTimeout(function() {
            var se = setInterval(function() {
                i++;
                document.getElementsByTagName("code")[n].innerHTML =
                    str.slice(0, i) + "|";
                if (i === str.length) {
                    clearInterval(se);
                    document.getElementsByTagName("code")[n].innerHTML = str;
                }
            }, 10);
        }, t);
    }

 componentDidMount() {
    this.type(0, 0);
    this.type(1, 600);
    this.type(2, 1300);
 }
  componentWillUnmount(){
      clearTimeout(this.timeout)
  }
 render(){
    return(
        <div className="error-not-found" style={{width:'100%',height:'100%'}}>
        <p>HTTP: <span>404</span></p>
        <code><span>It seems you are lost</span></code>
        <code><span>The page your are looking for was not found</span></code>
        <code><span>Please use the link below to get Home</span></code>
        <center><Link to="/">Home</Link></center>
        </div>
    )
 }
}
