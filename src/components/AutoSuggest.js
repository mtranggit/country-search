import React, {useState, useEffect} from 'react'
import {BehaviorSubject} from 'rxjs'
import {createStyles, withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {getSuggestions} from '../api/suggestionService'

const styles = theme =>
  createStyles({
    container: {
      padding: 20,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridGap: 20,
      maxWidth: 800,
      // border: '1px solid #272727',
    },
  })

const KEY_UP = 38
const KEY_DOWN = 40
const KEY_ENTER = 13

// create subject
const subject$ = new BehaviorSubject('')

const AutoSuggest = props => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [countriesSearch, setCountriesSearch] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const subscription = getSuggestions(subject$).subscribe(
      suggestions => {
        setSuggestions(suggestions)
        setMenuOpen(suggestions.length > 0 ? true : false)
      },
      error => console.error(error),
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleChange = e => {
    const {value} = e.target
    setValue(value)
    subject$.next(value)
  }

  const handleKeyDown = e => {
    console.log(e.keyCode)
  }

  const handleSelect = index => {
    console.log('selecting index ', index)
  }

  const handleClickAway = () => {
    setMenuOpen(false)
  }

  const handleShowHistory = e => {
    console.log('Show search history')
    // setMenuOpen(prevState => !prevState)
    setMenuOpen(true)
    setSuggestions([
      {name: 'Australia', cioc: 'AUS'},
      {name: 'New Zealand', cioc: 'NZL'},
      {name: 'United State of America', cioc: 'USA'},
    ])
  }

  const {classes} = props
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
      <button onClick={handleShowHistory}>My search history</button>
      {showSuggestions && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            {suggestions.map((suggestion, index) => (
              <MenuItem
                key={`suggestion-${index}`}
                onClick={() => handleSelect(index)}
                selected={selectedIndex === index}
              >
                {`${suggestion.name} - ${suggestion.cioc}`}
              </MenuItem>
            ))}
          </Paper>
        </ClickAwayListener>
      )}
    </div>
  )
}

const StyledComponent = withStyles(styles)(AutoSuggest)

export default StyledComponent
