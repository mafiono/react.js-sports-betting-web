import React, { PureComponent } from 'react'
import API from '../../services/api'
import '../style.css'
 const $api = API.getInstance()

export default class ContacttUs extends PureComponent{
    constructor(props){
        super(props)
        this.state = {data:{}}
    }
    componentDidMount() {
        $api.getInfoView({id:48})
        .then(({data})=>{
           this.setState({data:data.data})
        })
    }
    render(){
         const {data} = this.state
        return(
            <div className="about-us col-sm-12">
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