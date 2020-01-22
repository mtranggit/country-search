import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AutoSuggest from './components/AutoSuggest'
import History from './components/History'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '400px auto',
    gridGap: 20,
    maxWidth: 800,
    marginTop: 20,
    marginLeft: 20,
    backgroundColor: theme.palette.background.paper,
  },
}))

function App() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <AutoSuggest />
      <History />
    </div>
  )
}

export default App
