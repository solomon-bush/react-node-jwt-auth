import axios from 'axios'
import qs from 'qs'
import { BehaviorSubject, Subject } from 'rxjs'

const api = 'http://localhost:3001/api'

const getTime = () => {
    return new Date().toTimeString().split(' ')[0]
}

const storeData = () => {

}
const wipeData = () => {

}


class SessionMaster {

    constructor() {
        this.isLoggedIn = new BehaviorSubject(false)
        this.message = new Subject(null)
    }

    login = (username, password) => {
        axios.post(`${api}/login`, qs.stringify({ username, password }))
            .then(results => {
                this.isLoggedIn.next(true)
                this.message.next(`${getTime()} : Successfully loged in`)
            }).catch(err => {
                this.message.next(`${getTime()} : Invalid Login`)
            })
    }

    refresh = () => {
        axios.post(`${api}/refresh`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(results => {

        }).catch(err => {

        })
    }
    logout = () => {

    }
}

let SM = new SessionMaster()
export default SM 