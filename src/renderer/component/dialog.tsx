import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Dialog as MuiDialog, DialogContent, Paper, Typography, makeStyles, Theme, Button } from '@material-ui/core';
import { RootState } from '../reducer/renderer';
import { DialogType } from '../reducer/renderer/dialog';
import * as actions from '../actions/dialog';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  button: {
    margin: 10,
  },
}));

type Props = DialogType & {
  clickOk: Function;
  clickCancel: Function;
};

const App: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles({});
  return (
    <MuiDialog open={props.open} onBackdropClick={() => props.clickCancel}>
      <DialogContent className={classes.root}>
        <Typography variant={'subtitle1'}>{props.message}</Typography>
        <div>
          {props.type === 'confirm' && (
            <Button className={classes.button} variant={'contained'} onClick={() => props.clickCancel()}>
              キャンセル
            </Button>
          )}
          <Button className={classes.button} variant={'contained'} color={'primary'} onClick={() => props.clickOk()}>
            OK
          </Button>
        </div>
      </DialogContent>
    </MuiDialog>
  );
};

// state
const mapStateToProps = (state: RootState): DialogType => {
  return {
    type: state.dialog.type,
    open: state.dialog.open,
    message: state.dialog.message,
  };
};
const mapDispatchToProps = {
  clickOk: actions.dialogOkClick,
  clickCancel: actions.dialogCancelClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
