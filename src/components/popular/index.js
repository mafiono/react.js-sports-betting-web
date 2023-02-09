import React,{PureComponent} from 'react'
import PopularEvent from '../popularEvent'
export default class Popular extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: true,
      hover: false,
      ignoreActiveSport: false
    };
    this.toggleHover = this.toggleHover.bind(this)
    this.openSport = this.openSport.bind(this)
  }

  toggleHover() {
    this.setState({ hover: !this.state.hover })
  }
  openSport() {
    if (this.state.ignoreActiveSport === false)
      this.setState(prevState => ({ opened: !prevState.opened }))
    else
      this.setState(prevState => ({ opened: !prevState.opened }))
  }
  getTotalGames(region) {
    var size = 0;
    for (let reg in region) {
      if (null !== region[reg]) {

        var competition = region[reg].competition;
        for (let compete in competition) {
          // console.log(competition[compete].game)
          if (null !== competition[compete]) {
            if (null !== competition[compete].game)
              size += Object.keys(competition[compete].game).length;
          }
        }
      }
    }
    return size;
  }
  componentDidMount() {

  }
  render() {
    const {
      props: { data, loadGames, activeView, loadMarkets, type, activeGame }
      ,
      state: { opened, hover}
    } = this;

    return (

      <div className="sports-container">
        <div {...{ className: `sport-header favorite-${type === 1 ? 'competitions' : 'games'} ${opened ? 'select' : ''} ${hover ? 'hover' : ''}`, onClick: () => this.openSport() }} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
          <div {...{ className: `sport-avatar col-sm-2 favoritecompetitions` }}></div>
          <div className="sport-title col-sm-8">{'Top '}{type === 1 ? 'Leagues' : 'Games'}</div>
          <div className="sport-accord col-sm-2"><span {...{ className: `icon-icon-arrow-down icon ${hover || opened ? 'icon-show' : "icon-hide"} ${opened ? 'icon-up' : ""}` }}>
          </span></div>
        </div>
        {

              opened &&
                <div {...{ className: 'region-block-open' }} style={{ display: 'block', height:'auto' }}>
                  <ul className="sports-region-list">
                    {

                      data.map((sport, sID) => {
                        let reg = [], compete = [], game = []
                        Object.keys(sport.region).forEach((reg) => {
                          //  reg.push({name:sport.region[reg].name,alias:sport.region[reg].alias,id:sport.region[reg].id,order:sport.region[reg].order})
                          var thisRegion = sport.region[reg]
                          Object.keys(thisRegion.competition).forEach((c) => {
                            var cData = { competition: { name: thisRegion.competition[c].name, id: thisRegion.competition[c].id, order: thisRegion.competition[c].favorite_order ? thisRegion.competition[c].favorite_order : thisRegion.competition[c].order } }
                            if (thisRegion.competition[c].game)
                              cData.game = { ...thisRegion.competition[c].game }

                            cData.region = { ...thisRegion }
                            cData.sport = { name: sport.name, alias: sport.alias, id: sport.id }
                            compete.push(cData)
                          })
                        })

                        return (
                          <PopularEvent data={compete} activeView={activeView} loadMarkets={loadMarkets}
                            key={sID}
                            loadGames={loadGames} activeGame={activeGame} type={type}

                          />
                        )
                      })
                    }
                  </ul>
                </div>

            }

      </div>

    )
  }
}