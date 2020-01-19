import React from 'react'
import {createStyles, withStyles} from '@material-ui/core/styles'

const styles = theme =>
  createStyles({
    container: {
      with: 600,
      border: '1px solid #272727',
    },
  })

const AutoSuggest = props => {
  const {classes} = props
  return <div className={classes.container}>Auto suggest component</div>
}

const StyledComponent = withStyles(styles)(AutoSuggest)

export default StyledComponent
