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
        <QualityPie data={data}>
        </QualityPie>

      </Dialog>
    </div>
  );
}
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
// import Backdrop from '@material-ui/core/Backdrop';
// import Fade from '@material-ui/core/Fade';
// import QualityPie from './pie';

// const useStyles = makeStyles(theme => ({
//   modal: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   paper: {
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//     height: '500'
//   },
// }));

// export default function TransitionsModal(props) {
//   const classes = useStyles();
//   const data = [
//     {
//       "id": "stylus",
//       "label": "stylus",
//       "value": 170,
//       "color": "hsl(316, 70%, 50%)"
//     },
//     {
//       "id": "javascript",
//       "label": "javascript",
//       "value": 127,
//       "color": "hsl(232, 70%, 50%)"
//     },
//     {
//       "id": "php",
//       "label": "php",
//       "value": 529,
//       "color": "hsl(263, 70%, 50%)"
//     },
//     {
//       "id": "ruby",
//       "label": "ruby",
//       "value": 417,
//       "color": "hsl(334, 70%, 50%)"
//     },
//     {
//       "id": "go",
//       "label": "go",
//       "value": 340,
//       "color": "hsl(205, 70%, 50%)"
//     }
//   ]

//   return (
//     <div>
//       <Modal
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         className={classes.modal}
//         open={props.open}
//         onClose={props.onClose}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={props.open}>
//           <div className={classes.paper}>
//             <h2 id="transition-modal-title">Transition modal</h2>
//             <QualityPie data={data}></QualityPie>
//             <p id="transition-modal-description">react-transition-group animates me.</p>
//           </div>
//         </Fade>
//       </Modal>
//     </div>
//   );
// }