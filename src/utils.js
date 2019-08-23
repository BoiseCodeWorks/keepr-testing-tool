import axios from 'axios'

let api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  withCredentials: true
})

let auth = axios.create({
  baseURL: '/account',
  timeout: 5000,
  withCredentials: true
})

let user = {}


export default { api, auth, user }