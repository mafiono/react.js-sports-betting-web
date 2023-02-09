import React, { PureComponent } from 'react'
import {MultiviewMarketLoader} from '../loader'
export default class Droppable extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        draggedOver: false,
        dragEnter: false
      }
    }
    componentDidMount() {
  
    }
    componentDidUpdate() {
  
    }
    onDragOver(e) {
      e.preventDefault()
      this.setState({ draggedOver: true })
    }
    onDragLeave(e) {
      e.preventDefault()
      this.setState({ draggedOver: false,dragEnter: false })
    }
    onDragEnter(e) {
      e.preventDefault()
      this.setState({ dragEnter: true })
    }
  
    render() {
      const {
        props: { onDrop },
        state: {dragEnter }
      } = this
      return (
        <div className={`droppable loading-view col-sm-6 ${dragEnter ? 'loading-view' : ''}`} onDragOver={(e) => { this.onDragOver(e) }} onDragEnter={(e) => { this.onDragEnter(e) }} onDragLeave={(e) => { this.onDragLeave(e) }} onDrop={(e) => { this.onDragLeave(e); onDrop(e) }}>
        <div className={`dotted-border`}>
          {dragEnter ?
            <div className="market live">
              <div className="market-container">
                <MultiviewMarketLoader activeView={'Live'} />
              </div>
            </div>
            :
            <div>
              <i className="icon-drop"></i>
              <span>Click or drag events here</span>
            </div>
          }
        </div>
      </div>
      )
    }
  }