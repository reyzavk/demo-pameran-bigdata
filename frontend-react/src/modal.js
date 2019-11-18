import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import QualityPie from './pie'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
      var data = {
            datasets: [{
                // data: [chosen.nGoods, chosen.nRejects]
                data: [
                    props.chosen.nGoods <= 0? 100: props.chosen.nGoods,
                    props.chosen.nRejects <= 0? 100: props.chosen.nRejects
                ],
                backgroundColor: [
                    '#36A2EB',
                    '#F86183'
                ]
            },
        ],

            labels: [
                'Good',
                'Reject',
            ],

        }
  const classes = useStyles();

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.onClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                Machine {props.chosen.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <h1>{Math.round((props.chosen.nGoods + props.chosen.nRejects)/60)} unit/minute</h1>
        <QualityPie data={data}>
        </QualityPie>

      </Dialog>
    </div>
  );
}