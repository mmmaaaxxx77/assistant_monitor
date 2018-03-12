import React, { Component } from 'react';
import TwoSimplePieChart from './postpies';
import Card_Custom from './card';
import FansIntersectionTable from './fans_intersection_table';
import '../styles/posttype.css';
import '../styles/fanpost.css';
import arrow from '../imgs/icon_btnArrow.png'

let apidata = window.DATA

class ReportBottom extends Component {

  constructor(props){
    super(props)
  }

  renderPostInfo(posttype, postlist, bgSetting){
    const borderTop = bgSetting === 'dark' ? '15px solid #000': '15px solid #fff';
      const groupTop = [];
      const groupBot = [];

      for (let i =0; i<posttype.length;i++){

        var imgURL = "";
        var matchedData = apidata.d1.filter(function(item){
            return item.fans == posttype[i].fans;
        })
        if(matchedData.length > 0){
          imgURL = matchedData[0].fansimg;
        }

        groupTop.push(
            <div className="boxInfo marginLeftRight_15px" key={i}>  
              <div className="circleDiv">             
                <img className="fangroup_profile" src={imgURL}/>
                <p className="fanTitle"><span>{posttype[i].fans}</span></p>               
              </div>
              <TwoSimplePieChart piedata={posttype[i].posttype} />
              <div className="postNumber">
              	<span>{posttype[i].posttype[0].value}</span>
              	<span>{posttype[i].posttype[1].value}</span>
              	<span>{posttype[i].posttype[2].value}</span>
              	<span>{posttype[i].posttype[3].value}</span>
              </div>
            </div>
          )
      }

      for (let i =0; i<posttype.length;i++){
        groupBot.push(
          <div className="boxInfo marginLeftRight_15px" key={i}>
              <Card_Custom cardinfo={postlist[i].postlist} bgSetting={bgSetting}/>
            </div> 
          )
      }

      return (
      	<div>
    			<div className="checkDetails first">
            <span style={{width:'900px',textAlign:'left'}}>註：
              <b>1.粉絲平均互動：</b>平均每位粉絲，每天與粉專貼文的互動數。
              <b>2.貼文平均互動：</b>平均每篇粉專貼文獲得的互動數。
            </span>
            <div className="item3"><b>3.鐵粉率：</b>觸及到的用戶中，對粉專貼文留言的用戶，佔回應用戶的比例。</div>
            <div className="note">*回應：用戶在粉專的貼文下按讚、心情或留言。<br/>*互動：用戶在粉專的貼文下按讚、心情、留言或分享。</div>
    				<a href="http://vision.fansdo.tw/">
    					<div >看詳細分析 <img className="sprite1 sprite-icon-arrow" src={arrow} /></div>
    				</a>
    			</div>
    			<h2 className="title marginBottom_10px marginLeftRight_15px">貼文類型比較</h2>
    			<div className={'posttype light'}>
    				{groupTop}
    			</div>
    			<div className="checkDetails">
    				<a href="http://vision.fansdo.tw/">
    					<div >看詳細分析 <img className="sprite1 sprite-icon-arrow" src={arrow} /></div>
    				</a>
    			</div>
          <div className="mostHotDiv">
  			    <h2 className="title marginBottom_10px marginLeftRight_15px">最熱貼文</h2>
  			    <div className={'posttype light'}>
  				    {groupBot}
  			    </div>
          </div>
        </div>
      )
  }

  render() {
    let intersectionTable = null;
    if(apidata.d4 !== undefined) {
      intersectionTable = <FansIntersectionTable data={apidata.d4} queryInfo={apidata.d1} bgSetting={'light'} isReport={true}/>;
    }
    else {
      intersectionTable = <p className="errormsg">查無重疊粉絲</p>;
    }
    let intersectionTitle = apidata.d1.length > 1 ? "重疊粉絲" : "忠實粉絲";

    return(
        <div>
          {this.renderPostInfo(apidata.d2, apidata.d3, 'light')}
    			<div className={'fanpost light'}>   
    				<div className="checkDetails">
    					<a href="http://vision.fansdo.tw/">
    						<div >看詳細分析 <img className="sprite1 sprite-icon-arrow" src={arrow} /></div>
    					</a>
    				</div>
            <div className="intersectionDiv">  
      				<h2 className="title marginBottom_10px marginLeftRight_15px">{intersectionTitle}</h2>
      				{intersectionTable}
      				<div className="checkDetails">
      					<a href="http://vision.fansdo.tw/">
      						<div >看詳細分析 <img className="sprite1 sprite-icon-arrow" src={arrow} /></div>
      					</a>
      				</div>
            </div>
    			</div>
        </div>
    )
   }
}

export default ReportBottom;