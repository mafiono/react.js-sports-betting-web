import React,{useState,useEffect} from 'react'
import Competition from '../competition'
import {Transition, Spring} from 'react-spring/renderprops'
export const CompetitionLive=(pProps)=>{
    const [opened,isOpen] = useState(false), [ignoreActiveRegion, ignoreRegion] = useState(false),[hover, setHover] = useState(false);
      useEffect(()=>{if(pProps.competitionRegion.id === pProps.region.id  && !ignoreActiveRegion && !opened){isOpen(!opened)}},[pProps.competitionRegion])
    return(
        <li >
        <div {...{ className: `region-header ${!ignoreActiveRegion && pProps.competitionRegion.id === pProps.region.id ? 'select' : (ignoreActiveRegion && opened) ? 'select' : ''}`, onClick: () => {isOpen(!opened);ignoreRegion(!ignoreActiveRegion) } }} onMouseEnter={()=>setHover(!hover)} onMouseLeave={()=>setHover(!hover)}>
          <span {...{ className: `region-icon flag-icon flag-${pProps.region.alias ? pProps.region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }}></span><span className="region-name">{pProps.cProps.competition.name} </span><span {...{ className: `total-games text` }}>
            <span {...{ className: `icon-icon-arrow-down icon icon-show ${(!ignoreActiveRegion && pProps.competitionRegion.id == pProps.region.id) ? "icon-up" : (ignoreActiveRegion && opened) ? 'icon-up' : ""}` }}>
            </span></span>
        </div>
           {
          ((!ignoreActiveRegion && pProps.competitionRegion.id == pProps.region.id) ||(ignoreActiveRegion && opened)) && <div className="region-competition" style={{display:'block',height:'auto'}}>
         <Spring
         from={{minHeight:0,height:0}}
         to={{minHeight:10,height:'auto'}}
         >
           {props=>(  <ul className="competition-list"  style={props}>
             <Competition {...pProps.cProps}/>     
             </ul>)}
         </Spring>
           </div>
           }
      </li>
    )
}