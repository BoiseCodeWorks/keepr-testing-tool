import { Suite, Test } from "@bcwdev/vue-api-tester"
import Axios from "axios"

const PATH = "https://localhost:5001/account"

let userObject = {

}

export class UsersSuite extends Suite {
  constructor() {
    super("AccountController", PATH)
    this.addTests(
      new Test({
        name: "Can register a new user",
        path: PATH + '/register',
        description: 'Post request. This should create a new user.',
        expected: `{
          username: "D$",
          email: "dmoney@momoney.com",
        }`
      },
        async () => {
          let newUser
          let user
          try {
            let users = []
            let data = localStorage.getItem('users')
            if (!data) {
              let res = await Axios.get("https://uinames.com/api/?amount=500&region=united states&ext")
              users = res.data
              localStorage.setItem('users', JSON.stringify(users))
            } else {
              users = JSON.parse(data)
            }
            let index = Math.floor(Math.random() * users.length)
            if (users.length > 0) {
              newUser = users[index]
              newUser["username"] = `${newUser.name} ${newUser.surname}`
            }
            user = await this.create(newUser, PATH + '/register')
            users.splice(index, 1)
            localStorage.setItem('users', JSON.stringify(users))
            localStorage.setItem('user', JSON.stringify(newUser))
          } catch (e) {
            return this.handleError(e)
          }
          return this.pass("Able to register a new user.", { NewUser: { username: newUser.username, email: newUser.email, password: newUser.password }, RegisteredUser: user })
        }
      ),
      new Test({
        name: "Can login as a user",
        path: PATH + '/login',
        description: 'Post request. This should login a registered user.',
        expected: `{
          username: "D$",
          email: "dmoney@momoney.com"
        }`
      },
        async () => {
          let user
          let currentUser = localStorage.getItem('user')
          let UserCredentials
          try {
            if (!currentUser) {
              this.fail("Run the register test first.")
            } else {
              UserCredentials = JSON.parse(currentUser)
              user = await this.create(UserCredentials, PATH + '/login')
            }
          } catch (e) {
            return this.unexpected("user object", e.response.data)
          }
          return this.pass("Able to login a registered user.", { UserCredentials, LoggedInUser: user })
        }
      ),
      new Test({
        name: "Can logout a user",
        path: PATH + '/logout',
        description: 'Delete request. This should logout a signed in user.',
        expected: `true`
      },
        async () => {
          try {
            let user
            try {
              user = await this.get(PATH + '/authenticate')
            } catch (e) {
              return this.fail('Run the login test first')
            }
            try {
              await this.delete('logout', PATH)
            } catch (e) {
              return this.fail('DELETE request to logout failed')
            }
            try {
              user = await this.get(PATH + '/authenticate')
              return this.fail('User is still logged in.')
            } catch (e) {
              return this.pass('Users able to logout.')
            }
          } catch (e) {
            return this.unexpected("user should be able to logout.", e)
          }
        }
      ),
      new Test({
        name: "Can Authenticate a user",
        path: PATH + '/authenticate',
        description: 'Get request. This should get a previously signed in user.',
        expected: `{
          username: "D$",
          email: "dmoney@momoney.com"
        }`
      },
        async () => {
          let user
          try {
            user = await this.get(PATH + '/authenticate')
          } catch (e) {
            let currentUser = localStorage.getItem('user')
            let UserCredentials
            try {
              if (!currentUser) {
                this.fail("Run the register test first.")
              } else {
                UserCredentials = JSON.parse(currentUser)
                await this.create(UserCredentials, PATH + '/login')
                user = await this.get(PATH + '/authenticate')
                return this.pass('Able to authenticate a user.')
              }
            } catch (e) {
              return this.unexpected("user object", e.response.data)
            }
            return this.fail("Cant authenticate a user")
          }
        }
      )
    )
  }

  handleError(e) {
    if (e.response.status == 404) {
      return this.fail(`${e.response.data} 404: ${(e.response.config.method).toUpperCase()} request to ${e.response.config.url} `)
    }
    return this.unexpected({}, e.response.data)
  }
}