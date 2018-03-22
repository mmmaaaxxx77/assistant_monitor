/**********************
 * import other lib
 ***********************/
const fs = require('fs');
const path = require('path');
const co = require('co');
const NodeCache = require("node-cache");
const readConfig = require('read-config');
const axios = require('axios');
const md5 = require('blueimp-md5');

const koaRequest = require('koa-http-request');

const rp = require('request-promise');
const moment = require('moment');

/**********************
 * read config
 ***********************/
const configObject = readConfig(path.join(__dirname, 'config.json'));

/**********************
 * import koa lib
 ***********************/
const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const IO = require('koa-socket');

/**********************
 * cache setting
 ***********************/
const gameTaskCache = new NodeCache();
const voteTaskCache = new NodeCache();

/**********************
 * koa setting
 ***********************/
const app = new Koa();
const router = Router();
app.use(bodyParser());
app.use(logger());

app.use(koaRequest({
  json: true, //automatically parsing of JSON response
  timeout: 3000,    //3s timeout
  host: 'https://api.github.com'
}));

/**********************
 * pig function
 ***********************/
const pig_data = readConfig(path.join(__dirname, 'pig_config.json'));

/**********************
 * router functions
 * async
 * await
 ***********************/
router.get('/', async function (ctx) {
    //await getToken(ctx);
    // ctx.body = 'Hello World';

    const myJSONObject = pig_data['post_data'];


    let repo = await ctx.post('http://ckclouds.com/api/login',
        myJSONObject,
        {
        'User-Agent': 'koa-http-request'
        }
    );
    const token = repo['user']['token'];

    let repo2 = await ctx.get('http://ckclouds.com/api/task/offer?device=ios&limit=20&offset=0&sa=1',
        null,
        {
        "Authorization": token
        }
    );
    ctx.body = repo2;
});

router.get('/test', async function (ctx) {
    getToken();
    ctx.body = 'Hello World';
});

/**********************
 * router
 ***********************/
app.use(router.routes());

module.exports = app;

/**********************
 * game task schedule job
 ***********************/
const handleGameTask = function(data){
    const offers = data['offers'];
    const result = [];
    for(key in offers){
        const value = gameTaskCache.get(offers[key]['url']);
        const url = offers[key]['url'];
        const max_people = offers[key]['max_people'];
        const taken = offers[key]['taken'];
        const point = offers[key]['point'];
        if(!value){
            gameTaskCache.set(offers[key]['url'], {
                'last_time': offers[key]['end_time']*1000,
                'alert': false,
                'last_alert': 0
            });

            const now_st = moment().valueOf();
            if(now_st > offers[key]['end_time']*1000 || taken*1 >= max_people*1){
                continue;
            }
        }else{
            if(offers[key]['end_time']*1000 >= moment().valueOf()){
                console.log(offers[key]);
            }

            let cfull = taken*1 >= max_people*1 ? true:false;
            const now_st = moment().valueOf();

            if(value['last_time'] == offers[key]['end_time']*1000 && cfull){
                gameTaskCache.set(offers[key]['url'], {
                    'last_time': offers[key]['end_time']*1000,
                    'alert': value['alert'],
                    'last_alert': value['last_alert']
                });
                continue;
            }else if(value['last_time'] == offers[key]['end_time']*1000 &&
                !cfull &&
                now_st - value['last_alert'] < 1000*60*30){
                console.log(now_st + "," + value['last_alert']);
                gameTaskCache.set(offers[key]['url'], {
                    'last_time': offers[key]['end_time']*1000,
                    'alert': value['alert'],
                    'last_alert': value['last_alert']
                });
                continue;
            }else if(value['last_time'] == offers[key]['end_time']*1000 &&
                !cfull &&
                now_st - value['last_alert'] > 1000*60*30) {
                console.log(now_st + "," + value['last_alert']);
                gameTaskCache.set(offers[key]['url'], {
                    'last_time': offers[key]['end_time'] * 1000,
                    'alert': true,
                    'last_alert': now_st
                });
            }else{
                gameTaskCache.set(offers[key]['url'], {
                    'last_time': offers[key]['end_time']*1000,
                    'alert': true,
                    'last_alert': now_st
                });
            }

        }

        const strDate = moment(offers[key]['end_time']*1000).format("YYYY/MM/DD HH:mm");
        const name = offers[key]['name'];
        const thumbnail = offers[key]['thumbnail'];
        if(!thumbnail.includes("https")){
            thumbnail.replace('http', 'https')
        }
        result[result.length] = {
            'name': name,
            'end_time': strDate,
            'thumbnail': thumbnail,
            'url': url,
            'content': strDate + '結束 \n' + '目前人數' + taken + '/' + max_people,
            'point': point,
            'type_name': '緊急任務'
        }
    }
    return result;
};

const getGameTask = function(token){
    const options2 = {
        uri: 'http://ckclouds.com/api/task/offer?device=ios&limit=20&offset=0&sa=1',
        qs: null,
        headers: {
            'Authorization': token
        },
        json: true
    };
    rp(options2).then(function(body, err){
        //console.log(body);
        const bot_data = handleGameTask(body);

        const bot_options = {
            uri: pig_data['bot_url'],
            method: "POST",
            json: true,
            body: {'data': bot_data}
        };
        rp(bot_options).then(function(body, err){
            console.log(body);
            console.log("getGameTask OK");
        });
    });
};

/**********************
 * vote task schedule job
 ***********************/
const handleVoteTask = function(data){
    const offers = data['items'];
    const result = [];
    for(key in offers){
        const value = voteTaskCache.get(offers[key]['url']);
        const limit_people = offers[key]['limit_people'];
        const join_people = offers[key]['limit_people'];
        const now_st = moment().valueOf();
        if(!value){
            voteTaskCache.set(offers[key]['url'], {
                'last_time': offers[key]['end_time']*1000,
                'last_alert': 0
            });

            const now_st = moment().valueOf();
            if(now_st > offers[key]['end_time']*1000 || join_people*1 >= limit_people*1){
                continue;
            }
        }else{
            if(value == offers[key]['end_time']*1000 && join_people*1 >= limit_people*1){
                continue;
            }
            if(now_st-value['last_alert']<1000*60*30 && now_st-value['last_alert']!=0){
                continue;
            }
            if(now_st-value['last_alert']<1000*60*30){
                continue;
            }
            voteTaskCache.set(offers[key]['url'], {
                'last_time': offers[key]['end_time']*1000,
                'last_alert': now_st
            });
        }

        const strDate = moment(offers[key]['end_time']*1000).format("YYYY/MM/DD HH:mm");
        const name = offers[key]['title'];
        const thumbnail = "";
        const url = offers[key]['url'];
        const max_people = offers[key]['limit_people'];
        const taken = offers[key]['join_people'];
        const point = offers[key]['point'];
        result[result.length] = {
            'name': name,
            'end_time': strDate,
            'thumbnail': thumbnail,
            'url': url,
            'content': strDate + '結束 \n' + '目前人數' + taken + '/' + max_people,
            'point': point,
            'type_name': '投票任務'
        }
    }
    return result;
};

const getVoteTask = function(token){
    const options2 = {
        uri: 'http://ckclouds.com/api/task?limit=20&offset=0',
        qs: null,
        headers: {
            'Authorization': token
        },
        json: true
    };
    rp(options2).then(function(body, err){
        //console.log(body);
        const bot_data = handleVoteTask(body);

        const bot_options = {
            uri: pig_data['bot_url'],
            method: "POST",
            json: true,
            body: {'data': bot_data}
        };
        rp(bot_options).then(function(body, err){
            console.log(body);
            console.log("getVoteTask OK");
        });
    });
};

/**********************
 * schedule job
 ***********************/
const getToken = function(){
    const myJSONObject = pig_data['post_data'];

    const options = {
    	uri: 'http://ckclouds.com/api/login',
        method: "POST",
        json: true,
        body: myJSONObject
    };

    rp(options).then(function(body, err){
        const token = body['user']['token'];
        getGameTask(token);
        getVoteTask(token);
    });
};

setInterval(function () {
    getToken();
    console.log('Time for tea!');
    console.log(moment().format("YYYY/MM/DD HH:mm"));
}, 3 * 60 * 1000);

// init
const initPigTask = function(){
    const myJSONObject = pig_data['post_data'];

    const options = {
    	uri: 'http://ckclouds.com/api/login',
        method: "POST",
        json: true,
        body: myJSONObject
    };

    rp(options).then(function(body, err){
        const token = body['user']['token'];
        const options2 = {
            uri: 'http://ckclouds.com/api/task/offer?device=ios&limit=20&offset=0&sa=1',
            qs: null,
            headers: {
                'Authorization': token
            },
            json: true
        };
        rp(options2).then(function(body, err){
            const bot_data = handleGameTask(body);

            const bot_options = {
                uri: pig_data['bot_url'],
                method: "POST",
                json: true,
                body: {'data': bot_data}
            };
            rp(bot_options).then(function(body, err){
                console.log(body);
            });
        });
    });
};
initPigTask();

