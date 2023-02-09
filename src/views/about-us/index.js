import React, { PureComponent } from 'react'
import API from '../../services/api'
import '../style.css'
import Helmet from 'react-helmet'
 const $api = API.getInstance()

export default class AboutUs extends PureComponent{
    constructor(props){
        super(props)
        this.state = {data:{}}
    }
    componentDidMount() {
        $api.getInfoView({id:47})
        .then(({data})=>{
           this.setState({data:data.data})
        })
    }
    render(){
         const {data} = this.state
        return(
            <div className="about-us col-sm-12">
                 <Helmet>
                    <title>About Us- Macau Gambling Marke</title>
                </Helmet> 
                <div className="col-sm-6">
                   <div> 
                       <h1 className='title'>{
                     data.post_title
                    }</h1>
                    </div>
                </div>
                <div className="col-sm-6" dangerouslySetInnerHTML={{__html:data.post_content}}></div>
            </div>
        )
    }
}