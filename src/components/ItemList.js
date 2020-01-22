import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function ItemList(props) {
  const classes = useStyles()
  const {suggestions, handleSelect, selectedIndex = 0} = props

  if (!suggestions) {
    return null
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <MenuList>
          {suggestions.map((suggestion, index) => (
            <MenuItem
              onClick={() => handleSelect(index)}
              key={`suggestion-${index}`}
              selected={selectedIndex === index}
            >{`${suggestion.name} - ${suggestion.cioc}`}</MenuItem>
          ))}
        </MenuList>
      </Paper>
    </div>
  )
}
