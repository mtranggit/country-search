import React, {useState, useEffect} from 'react'
import {BehaviorSubject} from 'rxjs'
import {writeStorage, useLocalStorage} from '@rehooks/local-storage'
import {makeStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {getSuggestions} from '../api/suggestionService'
import Dialog from './Dialog'
import ItemList from './ItemList'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
  },
}))

const KEY_UP = 38
const KEY_DOWN = 40
const KEY_ENTER = 13
const INITIAL_INDEX = 0

// create subject
const subject$ = new BehaviorSubject('')

const AutoSuggest = props => {
  const classes = useStyles()
  const [value, setValue] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [localStorageSearchCountries] = useLocalStorage('mysearchcountries', [])

  useEffect(() => {
    const subscription = getSuggestions(subject$).subscribe(
      suggestions => {
        setSuggestions(suggestions.slice(0, 10))
        setMenuOpen(suggestions.length > 0 ? true : false)
      },
      error => console.error(error),
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSelect = index => {
    const {name, cioc} = suggestions[index]
    setCountryCode(cioc)

    // store search selection into local storage
    let filteredSearchCountries = []
    if (localStorageSearchCountries && localStorageSearchCountries.length) {
      filteredSearchCountries = localStorageSearchCountries.filter(
        country => country.cioc !== cioc,
      )
    }
    const newLocalStorageSearchCountries = [
      {name, cioc},
      ...filteredSearchCountries,
    ]
    writeStorage('mysearchcountries', newLocalStorageSearchCountries)

    // open the modal dialog
    open()
  }

  const handleChange = e => {
    const {value} = e.target
    setValue(value)
    subject$.next(value)
  }

  // handle selection with keyboard
  const handleKeyDown = e => {
    // console.log(e.keyCode)
    if (e.keyCode === KEY_ENTER && selectedIndex !== undefined) {
      e.preventDefault()
      handleSelect(selectedIndex)
    } else if (e.keyCode === KEY_DOWN) {
      e.preventDefault()
      const index = selectedIndex
      const nextIndex = index !== undefined ? index + 1 : INITIAL_INDEX

      if (nextIndex < suggestions.length) {
        setSelectedIndex(nextIndex)
      } else {
        setSelectedIndex(INITIAL_INDEX)
      }
    } else if (e.keyCode === KEY_UP) {
      e.preventDefault()
      const lastIndex = suggestions.length - 1
      const index = selectedIndex
      const previousIndex = index !== undefined ? index - 1 : lastIndex

      if (previousIndex >= 0) {
        setSelectedIndex(previousIndex)
      } else {
        setSelectedIndex(lastIndex)
      }
    }
  }

  const handleClickAway = () => {
    setMenuOpen(false)
  }

  const showSuggestions = menuOpen && suggestions.length > 0

  return (
    <div className={classes.container}>
      <TextField
        fullWidth
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter country name or code"
      />

      {showSuggestions && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            <ItemList
              suggestions={suggestions}
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

export default AutoSuggest
