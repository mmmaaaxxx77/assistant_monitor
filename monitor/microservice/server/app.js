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
const views = require('koa-views');

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

/**********************
 * view setting
 ***********************/
/*
 app.use(views(path.join(__dirname, '..', 'public'), {
 extension: 'html'
 }));
 */
app.use(views(path.join(__dirname, '..', 'build'), {
    extension: 'html'
}));
app.use(serve(path.join(__dirname, '..', 'build')));


/**********************
 * router functions
 * async
 * await
 ***********************/
router.get('/', async function (ctx) {
    //ctx.body = 'Hello World';
    await ctx.render('index');
});

/**********************
 * socket setting
 ***********************/
const io = new IO();
const chat = new IO('chat');
const feedly = new IO('feedly');

io.attach(app);
chat.attach(app);
feedly.attach(app);

/**********************
 * socket handlers
 ***********************/
io.on('connection', function (ctx) {
    console.log('Join event', ctx.socket.id);
    io.broadcast('connections', {
        numConnections: io.connections.size
    });
    // app.io.broadcast( 'connections', {
    //   numConnections: socket.connections.size
    // })
});

io.on('disconnect', function (ctx) {
    console.log('leave event', ctx.socket.id);
    io.broadcast('connections', {
        numConnections: io.connections.size
    });
});

io.on('data', function (ctx, data) {
    console.log('data event', data);
    console.log('ctx:', ctx.event, ctx.data, ctx.socket.id);
    console.log('ctx.teststring:', ctx.teststring);
    ctx.socket.emit('response', {
        message: 'response from server'
    });
});

io.on('ack', function (ctx, data) {
    console.log('data event with acknowledgement', data);
    ctx.acknowledge('received');
});

io.on('numConnections', function (packet) {
    console.log('Number of connections: ' + io.connections.size);
});

/**********************
 * chat socket handlers
 ***********************/
chat.on('connection', function (ctx) {
    console.log('Joining chat namespace', ctx.socket.id);
});

chat.on('message', function (ctx) {
    console.log('chat message received', ctx.data);

    // Broadcasts to everybody, including this connection
    app.chat.broadcast('message', 'yo connections, lets chat');

    // Broadcasts to all other connections
    ctx.socket.broadcast('message', 'ok connections:chat:broadcast');

    // Emits to just this socket
    ctx.socket.emit('message', 'ok connections:chat:emit');
});

/**********************
 * feedly socket handlers
 ***********************/
feedly.on('connection', function (ctx) {
    console.log('Joining feedly namespace', ctx.socket.id);
    feedlySender();
});

/**********************
 * router
 ***********************/
app.use(router.routes());

module.exports = app;

/**********************
 * schedule job
 ***********************/

// var schedule = require('node-schedule');
//
// var j = schedule.scheduleJob('*/1 * * * *', function(y){
//     console.log('Time for tea!');
//     console.log(y);
//     io.broadcast('connections', {
//         datetime: y
//     });
// });

const feedlySender = function () {
    const self = this;
    const instance = axios.create({
        baseURL: 'http://cloud.feedly.com/v3/streams/contents?count=6&streamId=user/b869fc6c-a570-42c0-b973-782f0fb0db18/category/News',
        timeout: 1000,
        headers: {'Authorization': 'OAuth  ' + configObject['feedly_token']}
    });
    instance.get('http://cloud.feedly.com/v3/streams/contents?count=6&streamId=user/b869fc6c-a570-42c0-b973-782f0fb0db18/category/News')
        .then(function (response) {
            console.log(response.data);

            feedly.broadcast('connections', {
                items: response.data.items
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

setInterval(function () {
    feedlySender();
    console.log('Time for tea!');
    console.log(new Date());
    io.broadcast('connections', {
        datetime: new Date()
    });
}, 60 * 1000);