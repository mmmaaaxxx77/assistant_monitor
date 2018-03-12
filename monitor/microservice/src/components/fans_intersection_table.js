import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const comment_icon = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  backgroundSize: 'cover',
  verticalAlign: 'middle',
  margin:'10px 10px 10px 0'
}

export default class FansInterSectionTable extends Component {
  constructor(props){
    super(props)
    this.state={show:'迴響'}
  }
  componentDidMount() {
    //this.props.fetchImg('10000136204703');
  }
  render(){
     const headergenerator = this.props.data[0].fangroup.map((fansgroup,idx) => {
      let imgURL = "";
      let matchedData = this.props.queryInfo.filter(function(item){
          return item.fans == fansgroup.fans;
      })

      if(matchedData.length > 0){
        imgURL = matchedData[0].fansimg;
      }

      return (
        <TableHeaderColumn style={{color:'#333333',textAlign:'left'}} className="tableHeaderColumn" key={idx}><img className="fangroup_profile" src={imgURL}/>{fansgroup.fans}</TableHeaderColumn>
      )
     })



    return (
    <div className={`overlapFansTable ${this.props.bgSetting}`} style={{margin:'20px 15px'}}>
            <Table style={{background:'#000',color:'#fff', fontFamily: '"Noto Sans TC","WenQuanYi Zen Hei","Heiti TC","Helvetica","Microsoft YaHei","Microsoft JhengHei","Arial","sans-serif"'}} wrapperStyle={{overflow: 'visible'}} bodyStyle={{overflow: 'visible'}}>
             <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
              <TableHeaderColumn style={{width:'35%',color:'#333333'}} className="tableHeaderColumn"></TableHeaderColumn>
                {headergenerator}
              </TableRow>
             </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <tr style={{height:'48px'}}>
                  <td style={{width:'35%'}}></td>
                  <td style={{width:'65%',color:'#666',verticalAlign: 'middle'}} colSpan={this.props.queryInfo.length}>
                    回應數
                  </td>
              </tr>
              {this.props.data.map((el,idx) => {
                // console.log("=============",this.state.show)
                // console.log(idx);
                const overlapCheck = () => {
                  // console.log(this.state.show); 
                  const currentState = this.state.show; 
                  const rcarr = el.fangroup.map((channel) => channel.currentState); 
                  const sum = rcarr.reduce((prev, curr) => prev + curr);
                  const max_rcarr = rcarr.reduce((a,b) => Math.max(a,b)); 
                  if (max_rcarr === sum) {
                    el.fangroup.overlap = false; 
                    // console.log("!!!!!!!!!!!!!!!!!!!", false);
                  } else {
                    el.fangroup.overlap = true;
                    // console.log("!!!!!!!!!!!!!!!!!!!", true);
                  }
                }

                overlapCheck(); 


                const fuckuel = el.fangroup.map((channel,index)=>{
                  const overlapbg = () => {
                    // console.log(el.fangroup.overlap)
                    if (channel[this.state.show] !== 0){
                      if(idx%2 == 1)
                      {
                        return 'striped'
                      }
                      else
                      {
                        return 'striped2'
                      }
                    } else {
                      return ''; 
                    } 
                  }

                  var color = '#23a1ff';
                  if(channel[this.state.show] == 0) color = '#ffffff';

                  if(this.props.isReport)
                  {
                    return(
                     <TableRowColumn key={index} style={{fontSize:'28px', overflow:'visible', textAlign:'center', verticalAlign:'middle'}} className={overlapbg()}>
                        <span style={{fontSize:'28px', color:{color}}}>{channel[this.state.show]}</span>
                     </TableRowColumn> 
                    ) 
                  }
                  else
                  {
                    return(
                     <TableRowColumn style={{fontSize:'28px', overflow:'visible', textAlign:'center', verticalAlign:'middle'}} className={overlapbg()}>
                        <span style={{fontSize:'28px', color:{color}}}>{channel[this.state.show]}</span>
                        <IconButton iconClassName="material-icons"
                                    tooltip={<div>
                                      <i className="sprite3 sprite-icon-comment" style={comment_icon}></i><span style={{color:'white',fontSize:'16px', margin:'12px 20px 10px 0'}}>{channel['留言']}</span>
                                      <i className="reaction reaction-like" style={{margin:'10px 10px 10px 0'}}></i><span style={{color:'white',fontSize:'16px', margin:'12px 20px 10px 0'}}>{channel['讚']}</span><br/>
                                      <i className="reaction reaction-love" style={{margin:'10px 10px 10px 0'}}></i><span style={{color:'white',fontSize:'16px', margin:'12px 20px 10px 0'}}>{channel['大心']}</span>
                                      <i className="reaction reaction-haha" style={{margin:'10px 10px 10px 0'}}></i><span style={{color:'white',fontSize:'16px', margin:'10px 20px 10px 0'}}>{channel['哈']}</span><br/>
                                      <i className="reaction reaction-wow" style={{margin:'10px 10px 10px 0'}}></i><span style={{color:'white',fontSize:'16px', margin:'10px 20px 10px 0'}}>{channel['哇']}</span>
                                      <i className="reaction reaction-sad" style={{margin:'10px 10px 10px 0'}}></i><span style={{color:'white',fontSize:'16px', margin:'10px 20px 10px 0'}}>{channel['嗚']}</span><br/>
                                      <i className="reaction reaction-angry" style={{margin:'10px 10px 10px 0'}}></i><span style={{color:'white',fontSize:'16px', margin:'10px 20px 10px 0'}}>{channel['怒']}</span>
                                      </div>
                                    } 
                                    tooltipPosition="top-right" 
                                    tooltipStyles={{width:'150px', height:'200px'}} iconStyle={{color:"#23a1ff"}}>
                          info
                        </IconButton>
                     </TableRowColumn> 
                    ) 
                  }               
                })
                // console.log("fucku",el);
                return (
                <TableRow key={idx}>
                  <TableRowColumn style={{width:'35%',fontSize:'16px'}}>
                    <a href={el.link} target="_blank" style={{display:'inline-Block'}}>
                      <img src={el.img} style={{width:'80px',height:'65px',padding:'5px',paddingRight:'10px',verticalAlign:'middle'}}/>
                      {el.User}
                    </a>
                  </TableRowColumn>
                  {fuckuel}
                </TableRow>)
              })}
            </TableBody>
            </Table>
          </div>
      )
  }
}