import React, {useState, useEffect} from 'react'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
// import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

import {getCountryByCode} from '../api/suggestionService'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

const DialogTitle = withStyles(styles)(props => {
  const {children, classes, onClose, ...other} = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          {/* <CloseIcon /> */}
          <span aria-hidden>&times;</span>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)

export default function CustomizedDialogs(props) {
  const {showDialog, closeDialog, id} = props
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      setLoading(true)
      const subscription = getCountryByCode(id).subscribe(countryData => {
        console.log(countryData)
        setCountry(countryData)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }
  }, [id])

  const handleClose = () => {
    closeDialog()
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={showDialog}
        >
          <DialogTitle id="customized-dialog-title">
            <img src={country?.flag} alt={country?.name} width="300" />
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>Name: {country?.name}</Typography>
            <Typography gutterBottom>
              Currency: {country?.currencies[0].name}
              {` (${country?.currencies[0].code} - ${country?.currencies[0].symbol})`}
            </Typography>
            <Typography gutterBottom>
              Latitude/longitude: {`${country?.latlng.join('/')}`}
            </Typography>
            <Typography gutterBottom>
              Land area: {`${country?.area} km²`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}
