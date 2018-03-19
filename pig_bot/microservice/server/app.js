/**********************
 * import other lib
 ***********************/
const fs = require('fs');
const path = require('path');
const co = require('co');
// const NodeCache = require("node-cache");
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
// const webCache = new NodeCache();

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

/**********************
 * router
 ***********************/
app.use(router.routes());

module.exports = app;

/**********************
 * schedule job
 ***********************/

const handleGameTask = function(data){
    const offers = data['offers'];
    const result = [];
    for(key in offers){
        const strDate = moment(offers[key]['end_time']*1000).format("YYYY/MM/DD HH:mm");
        const name = offers[key]['name'];
        const thumbnail = offers[key]['thumbnail'];
        const url = offers[key]['url'];
        const max_people = offers[key]['max_people'];
        const taken = offers[key]['taken'];
        result[result.length] = {
            'name': name,
            'end_time': strDate,
            'thumbnail': thumbnail,
            'url': url,
            'content': strDate + '結束,' + '目前人數' + taken + '/' + max_people
        }
    }
    return result;
};

const getGameTask = function(){
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
            console.log(body);
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

setInterval(function () {
    getGameTask();
    console.log('Time for tea!');
    console.log(new Date());
}, 60 * 1000);