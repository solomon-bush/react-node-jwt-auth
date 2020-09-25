import axios from 'axios'
import qs from 'qs'
import { BehaviorSubject, Subject } from 'rxjs'
import jwt from 'jsonwebtoken'

const api = 'http://localhost:3001/api'

const getTime = () => {
    return new Date().toTimeString().split(' ')[0]
}

// in milliseconds
const calculateTimeRemaining = (exp) => {
    return ((exp - Math.floor(Date.now() / 1000)) * 1000)
}

const storeData = (data) => {
    if (data != null) {
        for (let i of Object.keys(data)) {
            if (i === 'roles') {
                localStorage.setItem(i, data[i].toString())
            }
            else if ((typeof data[i]) === 'object') {
                storeData(data[i])
            }
            else {
                localStorage.setItem(i, data[i])
            }
        }
    }
}
const wipeData = () => {
    window.localStorage.clear()
}


class SessionMaster {

    constructor() {
        this.isLoggedIn = new BehaviorSubject(false)
        this.message = new Subject(null)
        this.timeRemaining = new Subject(null)
        this.refreshes = new Subject(0)
        this.onLoad()
    }

    onLoad = () => {
        if (localStorage.getItem('token')) {
            this.validate().then(
                isValid => {
                    if (isValid === true) {
                        this.message.next(`${getTime()} : Token Validated from Local Storage`)
                        this.resumeSession()
                    } else {
                        this.message.next(`${getTime()} : Token Expired - Local Storage Wiped `)
                        wipeData()
                    }
                }
            ).catch(err => {
                console.log(err)
            })
        }
    }

    startSession = (authData) => {
        authData.refreshes = 0
        storeData(authData)
        this.isLoggedIn.next(true)
        this.setTimer()
    }
    resfreshSession = (authData) => {
        let refreshes = Number(localStorage.getItem('refreshes'))
        authData.refreshes = refreshes + 1
        wipeData()
        storeData(authData)
        this.refreshes.next(authData.refreshes)
        this.isLoggedIn.next(true)
        this.setTimer()
        this.message.next(`${getTime()} : Session Refreshed`)
    }
    resumeSession = () => {
        this.isLoggedIn.next(true)
        this.refreshes.next(localStorage.getItem('refreshes'))
        this.setTimer()
    }

    setTimer = () => {
        let timer = calculateTimeRemaining((jwt.decode(localStorage.getItem('token'))).exp)
        this.timeRemaining.next(timer)
        setTimeout(
            () => {
                this.isLoggedIn.next(false)
            }, (timer))
    }

    login = (username, password) => {
        axios.post(`${api}/login`, qs.stringify({ username, password }))
            .then(results => {
                this.startSession(results.data)
                this.message.next(`${getTime()} : Successfully loged in`)
            }).catch(err => {
                this.message.next(`${getTime()} : Invalid Login`)
            })
    }
    logout = () => {
        this.isLoggedIn.next(false)
        this.message.next(`${getTime()} : User Logged Out`)
        wipeData()
        this.refreshes.next(0)
        this.message.next(`${getTime()} : Local Storage Wiped `)
    }


    validate = () => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: `${api}/validate`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(results => {
                resolve(results.data)
            }).catch(err => {
                reject(err);
            })
        })

    }

    refresh = () => {
        axios.post(`${api}/refresh`, null, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(results => {
            this.resfreshSession(results.data)
        }).catch(err => {

        })
    }

}

let SM = new SessionMaster()
export default SM 