import React, { Component } from 'react'
import SessionMaster from '../SessionMaster'

import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';


import DetailsGrid from './DetailsGrid'

export default class SessionDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            auth: false,
            timer: null,
            time: null,
            refreshes: 0,
            messages: []
        }
    }

    componentDidMount = () => {
        this.subs = [
            SessionMaster.isLoggedIn.subscribe(auth => {
                if (auth !== null) {
                    this.setState({ auth })
                }
            }),
            SessionMaster.message.subscribe(message => {
                console.log(message)
                let messages = this.state.messages
                messages.push(message)
                this.setState({ messages })
            }),
            SessionMaster.timeRemaining.subscribe(time => {
                if (time !== null) {
                    this.initTimer(time / 1000)
                } else {
                }
            })
        ]

    }

    padTwo = number => number <= 60 ? `0${number}`.slice(-2) : number;

    initTimer = (time) => {
        this.setState({
            timer: (setInterval(() => {
                this.setState({ time: --time })
            }, 1000))
        })
        setTimeout(() => {
            this.endTimer()
        }, time * 1000)
    }
    endTimer = () => {
        this.setState({ timer: null, time: null })
        clearInterval(this.state.timer)
    }
    handleLogout = () => {
        SessionMaster.logout()
        this.endTimer()
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
                                    { key: 'Time Remaining', val: `${Math.floor(this.state.time / 60)} : ${this.padTwo(this.state.time % 60)}` },
                                    { key: 'Refreshes', val: this.state.refreshes }
                                ]
                            } />
                        </CardContent>
                        <CardActions>
                            <Button disabled={!this.state.auth}>Refresh</Button>
                            <Button disabled={!this.state.auth} onClick={() => this.handleLogout()}>Logout</Button>
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
