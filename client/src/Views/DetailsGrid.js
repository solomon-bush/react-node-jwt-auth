import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider'

export default class DetailsGrid extends Component {
    buildRows = () => {
        if (this.props.items) {
            return this.props.items.map(row => {
                return (
                    <React.Fragment key={row.key}>
                        <Grid item xs={4}>
                            <Typography color='textSecondary'>{row.key}</Typography>
                        </Grid>
                        <Grid item xs={1}> <Divider orientation='vertical' /></Grid>
                        <Grid item xs={7}>
                            <Typography>{row.val}</Typography>
                        </Grid>
                    </React.Fragment>
                )
            })
        } else {
            return <Grid item xs={12}>No Items</Grid>
        }

    }

    render() {
        return (
            <Grid container spacing={1}>
                {this.buildRows()}
            </Grid>
        )
    }
}