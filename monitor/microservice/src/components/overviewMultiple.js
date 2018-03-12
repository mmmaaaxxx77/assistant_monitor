import React, { Component } from 'react';
import bubbleImg from '../imgs/bg_proportion.png';
import colon from '../imgs/colon.png';
import bg_stripe from '../imgs/bg_stripe.png';
import icon_arrow from '../imgs/icon_arrow.png';
import icon_crown from '../imgs/icon_crown.png'

class OverviewMultiple extends Component {

  constructor(props){
    super(props)
  }

  checkBubbleColor(champion,winnerNum) {
    if(champion === true) {
      return <span className="red">{winnerNum}</span>
    }else {
      return <span>{winnerNum}</span>
    }
  }

  checkCrownNumber(width) {
    if(width === '100%') {
      return <img className="iconCrown" src={icon_crown} alt="iconCrown" />
    }
  }

  renderList(mapData){
    let columnLayout = mapData.d1.length === 2 ? 'col2':'col3'

    const list = mapData.d1.map((key, index)=>{
      return (
        <div className={`list col ${columnLayout}`} key={index}>
          <div className="boxInfo">
            <div className="profilePic">
              <img src={key.fansimg} alt="fansimg" />
              <p className="fansName">{key.fans}</p>
            </div>
            <div className="totalScore">
                <img className="divider" src={colon} alt="divider" />
                {this.checkBubbleColor(key.champion,key.winnerNum)}
            </div>
          </div>
          <div className="boxData">
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar purple" style={{width:key.likesRate}}></div>
                  <span className="number">{key.likes}</span>
                  {this.checkCrownNumber(key.likesRate)}
              </div>
            </div>
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar blue" style={{width:key.postRate}}></div>
                  <span className="number">{key.post}</span>
                  {this.checkCrownNumber(key.postRate)}
              </div>
            </div>
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar green" style={{width:key.rcRate}}></div>
                  <span className="number">{key.rc}</span>
                  {this.checkCrownNumber(key.rcRate)}
              </div>
            </div>
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar purple" style={{width:key.shareRate}}></div>
                  <span className="number">{key.share}</span>
                  {this.checkCrownNumber(key.shareRate)}
              </div>
            </div>
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar blue" style={{width:key.participateRate}}></div>
                  <span className="number">{key.participate}</span>
                  {this.checkCrownNumber(key.participateRate)}
              </div>
            </div>
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar green" style={{width:key.postFeedbackRate}}></div>
                  <span className="number">{key.postFeedback}</span>
                  {this.checkCrownNumber(key.postFeedbackRate)}
              </div>
            </div>
            <div className="listItem">
              <div className="barWrap">
                  <div className="bar purple" style={{width:key.loyaltyRate}}></div>
                  <span className="number">{key.loyalty}</span>
                  {this.checkCrownNumber(key.loyaltyRate)}
              </div>
            </div>
          </div>
        </div>
      )
    })
    return list
  }

  render() {
    return (
      <div className="mutipleMain">
        <div className="wrapper">
          <div className="list listTitle">
            <img className="emptyBlock" src={bg_stripe} />
            <div className="fontBlueTitle"><b>績效比數</b></div>
            <div className="listItem alignRight">
              <b>粉絲數</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
            <div className="listItem alignRight">
              <b>貼文數</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
            <div className="listItem alignRight">
              <b>回應數*</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
            <div className="listItem alignRight">
              <b>分享數</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
            <div className="listItem alignRight">
              <b>粉絲平均互動*</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
            <div className="listItem alignRight">
              <b>貼文平均互動*</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
            <div className="listItem alignRight">
              <b>鐵粉率</b>
              <img className="icon_arrow" src={icon_arrow} alt="icon_arrow" />
            </div>
          </div>
          <div className="list listContainer">
            {this.renderList(this.props.data)}
          </div>
        </div>
      </div>
    )
  }
}

export default OverviewMultiple;