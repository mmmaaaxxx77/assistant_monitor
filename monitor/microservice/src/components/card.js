import React from 'react';
import {Card, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import comment from '../imgs/icon_comment.png'
import fbmood from '../imgs/mood.png'
import forward from '../imgs/icon_forward.png'

const Card_Custom = (postlist) => {
  const bgColor = postlist.bgSetting === 'dark'? '#000' : '#EAE8E3';
  const color = postlist.bgSetting === 'dark'? '#fff' : '#333333';
  const lowerbgColor = postlist.bgSetting === 'dark'? '#236F67' : '#bfe4d4';
  const iconColor = postlist.bgSetting === 'dark'? 'lightblue' : '#0e3b40';
  const pixStyle = {
    zIndex: '100000000',
    position:'relative',
    width: 'initial',
    minWidth: 'initial',
    height: '170px',
    maxWidth: '318px'
  }
  const cardCustom =  postlist.cardinfo.map((card,idx) => {

    var fucktype = card.type == "其他" ? "貼文": card.type;
    var fuckimg = () => {
                    if (card.contentpath !== "{}"){
                      return(
                        <CardMedia style={{padding:'0 16px'}}>
                          <img className="cardimg" style={pixStyle} alt="fansimg" src={card.contentpath} />
                        </CardMedia>
                        )
                    } else {
                      return (
                        <CardMedia style={{padding:'0 16px'}}>
                        </CardMedia>
                        )
                    } 
                  }
    var fucktext = () => {
                    if (card.text !== "{}"){
                      return(
                        <CardText style={{color:color,textAlign:'left', height:'100px', overflow:'hidden', lineHeight:'27px'}}>
                          {card.text}
                        </CardText>
                        )
                    } else {
                      return (
                        <CardText style={{color:color,textAlign:'left', overflow:'hidden', lineHeight:'27px'}}>
                        </CardText>
                        )
                    } 
                  }

    return (
      <a href={card.link} style={{ display:'block', position:'relative'}} target="_blank" key={idx}>
        <Card className="cardWrapper" style={ {fontFamily: '"Noto Sans TC","WenQuanYi Zen Hei","Heiti TC","Helvetica","Microsoft YaHei","Microsoft JhengHei","Arial","sans-serif"'}}>
          <CardHeader
            style={{textAlign:'left'}}
            title={`${card.poster}分享了一個${fucktype}`}
            subtitle={`${card.date}`}
            avatar={card.posterimg}
            className="cardheader"
          />
          {fuckimg()}
          {fucktext()}
           <CardText className="card_reactions">
            <span className="iconWrap"><img className="sprite3 sprite-icon-fb-emotion-like-60" src={fbmood}/>{card['心情']}</span>
            <span className="iconWrap"><img className="sprite3 sprite-icon-forward" src={forward}/>{card['分享']}</span>
            <span className="iconWrap"><img className="sprite3 sprite-icon-comment" src={comment}/>{card['留言']}</span>
          </CardText>
        </Card>
      </a>
    )
  })
  return (
    <div>{cardCustom}</div>
  )
};

export default Card_Custom;