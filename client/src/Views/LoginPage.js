import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SessionMaster from '../SessionMaster'

export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            username: '',
            password: ''
        }

    }
    componentDidMount = () => {
        this.subs = [SessionMaster.isLoggedIn.subscribe(auth => {
            if (auth === true) {
                this.setState({ auth: true })
            }
        })]
    }

    handleChange = (e) => {
        this.setState({ [e.currentTarget.id]: e.currentTarget.value })
    }
    login = () => {
        SessionMaster.login(this.state.username, this.state.password)
    }
    render() {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box display='flex' flexDirection='column' alignItems='center' marginTop={8}>
                    <Avatar >
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form>
                        <TextField
                            variant='outlined'
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            value={this.state.username}
                            label="username"
                            name="username"
                            onChange={e => this.handleChange(e)}
                            disabled={this.state.auth}

                        />
                        <TextField
                            variant='outlined'
                            margin="normal"
                            required
                            fullWidth
                            value={this.state.password}
                            id="password"
                            type='password'
                            label="Password"
                            autoComplete='password'
                            onChange={e => { this.handleChange(e) }}
                            disabled={this.state.auth}
                        />
                    </form>
                    {this.state.auth ?
                        <Button
                            disabled
                        >
                            Logged In
                        </Button>

                        : <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.login}
                        >
                            Sign In
                    </Button>}

                    <Typography color={this.state.isError ? 'error' : 'textPrimary'}>
                        {this.state.message}
                    </Typography>
                </Box>
            </Container >
        )
    }
}
