import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';

import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Switch from 'material-ui/Switch';
import Grow from 'material-ui/transitions/Grow';

import NewsCard from './components/news_card'
import ButtonAppBar from './components/tool_bar'
import openSocket from 'socket.io-client';

const theme = createMuiTheme();

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        margin: 0,
        height: '91.8vh',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

const feedly_socket = openSocket("http://"+window.location.hostname + ":8000/feedly");

class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.socketDaemon();
    }


    handleChange = () => {
        /*
         if (!this.state.checked) {
         let _feeds = this.state.feeds;
         this.setState({i: this.state.i + 1});
         _feeds[_feeds.length] = this.state.i;
         this.setState({feeds: _feeds});
         }
         */

        this.setState({checked: !this.state.checked});
    };

    state = {
        checked: false,
        feeds: [],
        i: 0
    };

    socketDaemon = () => {
        const self = this;

        /*
         if (!this.state.checked) {
         let _feeds = this.state.feeds;
         this.setState({i: this.state.i + 1});
         _feeds[_feeds.length] = this.state.i;
         this.setState({feeds: _feeds});
         }
         */

        feedly_socket.on('connections', function (data) {
            console.log('connected', data);

            self.setState({feeds: []});
            setTimeout(function () {
                let items = data.items;
                let _feeds = [];
                for (let k in items) {
                    _feeds[_feeds.length] = items[k];
                    self.setState({feeds: _feeds});
                }
            }, 500);
            //self.handleChange();
        });
    };

    render() {
        const {checked} = this.state;
        const _feeds = this.state.feeds;
        const _time = 0;

        return (
            <MuiThemeProvider theme={theme}>
                <Grid container className={this.props.classes.root}>
                    <Grid item xs={9} style={{paddingTop: '20px'}}>
                        <Paper className={this.props.classes.paper}>
                            <div className="video-container">
                                <iframe src="https://www.youtube.com/embed/QYT8WYdPJYo?rel=0&autoplay=1" frameBorder="0"
                                        width="560"
                                        height="315"></iframe>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={3} className="right-grid">
                        <Switch checked={checked} onChange={this.handleChange} aria-label="collapse"/>


                        {_feeds.map((item, idx) =>
                            <Grow in={checked}
                                  style={{transformOrigin: '0 0 0'}}
                                  {...(checked ? {timeout: _time + idx * 1000} : {})}
                                  key={item.id} in={checked}>
                                <div><NewsCard theme={theme} data={item}></NewsCard></div>
                            </Grow>
                        )}


                    </Grid>
                </Grid>
<ButtonAppBar/>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(App);
