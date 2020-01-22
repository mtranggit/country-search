import React, {useState} from 'react'
import {useLocalStorage} from '@rehooks/local-storage'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Paper from '@material-ui/core/Paper'
import Dialog from './Dialog'
import ItemList from './ItemList'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  historyButton: {
    width: 180,
  },
}))

export default function History(props) {
  const classes = useStyles()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [countryCode, setCountryCode] = useState('')
  const [localStorageSearchCountries] = useLocalStorage('mysearchcountries', [])
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const handleClickAway = () => {
    setMenuOpen(false)
  }

  const handleShowHistory = e => {
    setMenuOpen(true)
  }

  const handleSelect = index => {
    const {cioc} = localStorageSearchCountries[index]
    setCountryCode(cioc)
    setSelectedIndex(index)
    // open the modal dialog
    open()
  }

  if (!localStorageSearchCountries) {
    return null
  }
  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        onClick={handleShowHistory}
        className={classes.historyButton}
      >
        My search history
      </Button>
      {menuOpen && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            <ItemList
              suggestions={localStorageSearchCountries}
              handleSelect={handleSelect}
              selectedIndex={selectedIndex}
            />
          </Paper>
        </ClickAwayListener>
      )}
      <Dialog showDialog={showDialog} closeDialog={close} id={countryCode} />
    </div>
  )
}
