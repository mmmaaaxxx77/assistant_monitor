import React, { Component } from 'react';
import '../styles/single.css';
import arrow from '../imgs/icon_arrow.png'

let apidata = window.DATA

class OverviewSingle extends Component {
  render () {
    return (
      <div className="singleMain wrapper">
        <img className="fangroup_profile" src={apidata.d1[0].fansimg} style={{marginTop:'130px'}}/>
        <p className="fanTitle"><span>{apidata.d1[0].fans}</span></p> 
        <table>
          <tbody>
            <tr>
              <td>粉絲數<img className="arrow" src={arrow}/><span>{apidata.d1[0].likes}</span></td>
              <td>貼文數<img className="arrow" src={arrow}/><span>{apidata.d1[0].post}</span></td>
            </tr>
            <tr>
              <td>回應數*<img className="arrow" src={arrow}/><span>{apidata.d1[0].rc}</span></td>
              <td>分享數<img className="arrow" src={arrow}/><span>{apidata.d1[0].share}</span></td>
            </tr>
            <tr>
              <td>粉絲平均互動*<img className="arrow" src={arrow}/><span>{apidata.d1[0].participate}</span></td>
              <td>貼文平均互動*<img className="arrow" src={arrow}/><span>{apidata.d1[0].postFeedback}</span></td>
            </tr>
            <tr>
              <td>鐵粉率<img className="arrow" src={arrow}/><span>{apidata.d1[0].loyalty}</span></td>
            </tr>
          </tbody>
        </table>  
      </div>
    )
  }
}

export default OverviewSingle;

