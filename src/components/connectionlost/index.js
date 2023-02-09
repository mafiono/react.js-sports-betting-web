import React,{useState, useEffect} from 'react'
import {Transition, animated} from 'react-spring/renderprops'
export const ConnectionLost = () =>{
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  useEffect(()=>{
    setTimeout(()=>{
      setShow(true)
    },1000)
    setTimeout(()=>{
      setShow2(true)
    },2000)
    setTimeout(()=>{
      setShow3(true)
    },3000)
    setTimeout(()=>{
      setShow4(true)

    },4000)
    setTimeout(()=>{
      setShow(false)
      setShow2(false)
      setShow3(false)
      setShow4(false)

    },5000)
    return ()=>{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }
  )
  return (
    <div className="connectionLost">
      <Transition in={show} timeout={1000}>
        {state => (
          <animated.div style={state}>
            <h1>Connection Lost</h1>
          </animated.div>
        )}
      </Transition>
      </div>
  )
        }
        export default ConnectionLost;