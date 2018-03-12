import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import OverviewSingle from './components/overviewSingle';
import OverviewMultiple from './components/overviewMultiple';
import ReportBottom from './components/reportBottom';
import './styles/App.css';
import "./styles/sprite1.css";
import './styles/fb_reaction.css';
import './styles/sprite3.css';
import './styles/sprite5.css';
import './styles/date_range_picker.css';
import './styles/overview.css';
import iconDate from './imgs/icon_settingDate.png'

let apidata = window.DATA

class App extends Component {
  render() {
    let layout = apidata.d1.length === 1 ? <OverviewSingle/>:<OverviewMultiple data={apidata}/>;
    return (
      <MuiThemeProvider>
        <div>
          <div className="container">
            <header className="searchq">
              <div className="appHeader">
                <div className="logo"></div>
                <div className="dateRangePicker">
                  <span className="date">{apidata.dateRange}</span>
                  <img className="sprite-icon-settingdate" src={iconDate}/>
                </div>
                <p className="alert">因臉書隱私權政策修改，績效報告中以下功能資料僅提供至2018/2/5：粉絲平均互動、鐵粉率、重疊粉絲。</p>
              </div>
            </header>
            <article className="main">
              <div className="pageTitle">
                <h2>績效洞察報告</h2>
              </div>
              { layout }
              <ReportBottom />
            </article>
            <footer className="footer">
              <p>Copyright © 2017 大數據股份有限公司 All rights reserved</p>
            </footer>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
