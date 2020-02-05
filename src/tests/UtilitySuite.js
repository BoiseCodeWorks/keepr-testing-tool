import { Suite } from "@bcwdev/vue-api-tester"

export class UtilitySuite extends Suite {
  async CheckUser() {
    try {
      let user = await this.get('https://localhost:5001/account/authenticate')
      if (!user) {
        throw new Error("Bad user, try running the login test first")
      }
      return user
    } catch (e) {
      throw new Error("Bad user, try running the login test first")
    }
  }

  async switchUser() {
    let users
    let usersData = localStorage.getItem('users')
    try {
      if (!usersData) {
        throw new Error("Run the register test first.")
      } else {
        users = JSON.parse(usersData)
        if (users.length < 1) {
          throw new Error("Run the register test first")
        }
      }

      let index = Math.floor(Math.random() * users.length)
      let UserCredentials = users[index]
      UserCredentials["username"] = `${UserCredentials.name} ${UserCredentials.surname}`
      let user = await this.create(UserCredentials, 'https://localhost:5001/account/register')
      users.splice(index, 1)
      localStorage.setItem('users', JSON.stringify(users))
      debugger
      localStorage.setItem('user', JSON.stringify(UserCredentials))
    } catch (e) {
      this.fail(e)
    }
  }

  verifyIsSame(comparedTo, compare) {
    return Object.keys(comparedTo).every(key => compare.hasOwnProperty(key))
  }

  handleError(e) {
    return e.response && e.response.data != "" ? e.response.data : e
  }
}