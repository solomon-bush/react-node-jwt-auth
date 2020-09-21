import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Container, Grid } from '@material-ui/core';


import LoginPage from './Views/LoginPage'
import SessionDetails from './Views/SessionDetails'


const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

export default class Main extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Container >
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                        spacing={3}
                    >
                        <Grid item>
                            <LoginPage />
                        </Grid>
                        <Grid item>
                            <SessionDetails />
                        </Grid>
                    </Grid>
                </Container>
            </MuiThemeProvider>
        )
    }
}
