import { Suite } from "@bcwdev/vue-api-tester"

export class UtilitySuite extends Suite {
  async CheckUserAsync() {
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

  async switchUserAsync() {
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

  async getVaultsAsync() {
    let vaults = await this.get("https://localhost:5001/api/vaults")
    if (vaults.length == 0) {
      return this.fail("Please create at least one vault with this user.")
    }
    return vaults
  }

  async getUserKeepsAsync() {
    let keeps = await this.get("https://localhost:5001/api/keeps/user")
    if (keeps.length == 0) {
      return this.fail("Please create at least one keep with this user.")
    }
  }

  async getPublicKeepsAsync() {
    let user = this.CheckUserAsync()
    let keeps = await this.get("https://localhost:5001/api/keeps")
    if (keeps.length == 0) {
      return this.fail("Please create at least one keep.")
      // @ts-ignore
    } else if (!keeps.every(k => !k.isPrivate || k.userId == user.id)) {
      return this.fail("Able to retrieve private keeps that do not belong to the user.")
    }
    return keeps
  }
}