import React, {useState, useEffect} from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'

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

const AutoSuggest = props => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleChange = e => {
    setValue(e.target.value)
  }

  const handleKeyDown = e => {
    console.log(e.keyCode)
  }

  const handleShowHistory = e => {
    console.log('Show search history')
  }

  const {classes} = props
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
    </div>
  )
}

const StyledComponent = withStyles(styles)(AutoSuggest)

export default StyledComponent
