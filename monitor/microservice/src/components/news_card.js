import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import SkipNextIcon from 'material-ui-icons/SkipNext';

const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
    },
    content: {
        flex: '1 0 auto',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingBottom: '15px',
        paddingTop: '15px',
        height: '10vh'
    },
    cover: {
        width: '30%',
    },
});


class MediaControlCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const item = this.props.data;
        console.log(item);
        const imageUrl = 'visual' in item ? item['visual']['url'] : 'https://material-ui-next.com/static/images/cards/paella.jpg';

        return (
            <div style={{paddingBottom:'10px'}}>
                <Card className={this.props.classes.card}>
                    <CardMedia
                        className={this.props.classes.cover}
                        image={imageUrl}
                        title={item.title}
                    />
                    <div className={this.props.classes.details}>
                        <CardContent className={this.props.classes.content}>
                            <Typography variant="subheading">
                                {item.title}
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            </div>
        );
    }
}

MediaControlCard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaControlCard);