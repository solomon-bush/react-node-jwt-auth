import React, { Component } from 'react'
import SessionMaster from '../SessionMaster'

import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';


import DetailsGrid from './DetailsGrid'

export default class SessionDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            auth: false,
            timer: 0,
            refreshes: 0,
            messages: []
        }
    }

    componentDidMount = () => {
        this.subs = [
            SessionMaster.isLoggedIn.subscribe(auth => {
                if (auth === true) {
                    this.setState({ auth: true })
                }
            }),
            SessionMaster.message.subscribe(message => {
                console.log(message)
                let messages = this.state.messages
                messages.push(message)
                this.setState({ messages })
            })
        ]

    }

    render() {
        return (
            <Grid container
                direction="row"
                justify="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={8}>
                    <Card style={{ height: '100%' }}>
                        <CardHeader title='Session Details' />
                        <CardContent>
                            <DetailsGrid items={
                                [
                                    { key: 'Status', val: this.state.auth ? 'Logged In' : 'Not Logged In' },
                                    { key: 'Time Remaining', val: this.state.timer },
                                    { key: 'Refreshes', val: this.state.refreshes }
                                ]
                            } />
                        </CardContent>
                        <CardActions>
                            <Button disabled={!this.state.auth}>Refresh</Button>
                            <Button disabled={!this.state.auth}>Logout</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={8}  >
                    <Card style={{ height: '100%' }}>
                        <CardHeader subheader='Messages' action={
                            <Button onClick={() => this.setState({ messages: [] })}>Clear</Button>
                        } />
                        <CardActions>
                        </CardActions>
                        <CardContent>
                            {this.state.messages.map((val, i) => {
                                return <Typography key={i}>{val.toString()}</Typography>
                            })}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}
