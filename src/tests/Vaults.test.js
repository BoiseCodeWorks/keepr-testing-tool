import { Test } from "@bcwdev/vue-api-tester"
import { UtilitySuite } from "./UtilitySuite"

const PATH = "https://localhost:5001/api/vaults"

let vaultObj = {
  name: "TEST__VAULT",
  description: "VAULT__DESCRIPTION"
}

export class VaultsSuite extends UtilitySuite {
  constructor() {
    super("Vaults Testing", PATH)
    this.addTests(
      new Test({
        name: 'Can Create a vault',
        path: PATH,
        description: 'POST request. This should create a new vault in your database. UserId is attached on the server side',
        expected: 'Vault',
        payload: 'Vault object { name, description }'
      },
        async () => {
          let vault
          try {
            let user = await this.CheckUserAsync()
            vault = await this.create({ ...vaultObj, userId: "dont trust the front end" })
            this.verifyIsSame(vaultObj, vault)
            if (vault.userId != user.id) {
              return this.fail("Users can create a vault with any user id.")
            }
            return this.pass("Successfully created a vault!", vault)
          } catch (e) {
            return this.unexpected(vaultObj, this.handleError(e))
          } finally {
            if (vault) {
              let vaults = await this.get()
              if (vaults.length > 1) {
                // @ts-ignore
                await this.delete(vault.id)
              }
            }
          }
        }
      ),
      new Test({
        name: 'Can get a vault by its id',
        path: PATH,
        description: 'GET request. This should get a single vault by its id, as long as the user owns it.',
        expected: 'Vault',
        payload: `Vault { }`
      },
        async () => {
          try {
            let user = await this.CheckUserAsync()
            let userOne = JSON.parse(localStorage.getItem('user'))
            let userTwo
            let vaults = await this.getVaultsAsync()
            vaults = vaults.filter(v => v.userId == user.id)
            if (vaults.length == 0) {
              return this.fail('Please add at least one vault with this user to test this route.')
            }
            await this.delete('logout', 'https://localhost:5001/account')
            let users = JSON.parse(localStorage.getItem('users'))
            let index = Math.floor(Math.random() * users.length)
            userTwo = users[index]
            userTwo["username"] = `${userTwo.name} ${userTwo.surname}`
            users.splice(index, 1)
            localStorage.setItem('users', JSON.stringify(users))
            await this.create(userTwo, 'https://localhost:5001/account/register')
            try {
              let vault = await this.getById(vaults[0].id)
              return this.fail("Able to retrieve a vault that doesnt belong to the user.")
            } catch (e) { }
            await this.create(userOne, 'https://localhost:5001/account/login')
            let vault = await this.getById(vaults[0].id)
            return this.pass("Able to get a users vault by its id.", vault)
          } catch (e) {
            return this.unexpected([vaultObj], this.handleError(e))
          }
        }
      ),
      new Test({
        name: 'Can get users vaults',
        path: PATH,
        description: 'GET request. This should get all the users vaults',
        expected: 'Vault [ ]',
        payload: ''
      },
        async () => {
          try {
            let user = await this.CheckUserAsync()
            let vaults = await this.get()
            if (vaults.length == 0) {
              return this.fail('Please add at least one vault to test this route.')
            }
            else if (!vaults.every(v => v.userId == user.id)) {
              return this.fail("Able to retrieve vaults that do not belong to the user.")
            }
            else if (!this.verifyIsSame(vaultObj, vaults[0])) {
              return this.fail("Array does not contain objects that match the given Vault model")
            }
            return this.pass("Able to get users vaults", vaults.splice(0, 3))
          } catch (e) {
            return this.unexpected([vaultObj], this.handleError(e))
          }
        }
      ),
      new Test({
        name: 'Can delete a vault',
        path: PATH,
        description: 'DELETE request. This should delete a vault if the user owns it.',
        expected: '',
        payload: ''
      },
        async () => {
          try {
            await this.CheckUserAsync()
            let userOne = JSON.parse(localStorage.getItem('user'))
            let userTwo
            let vault = await this.create(vaultObj)
            await this.delete('logout', 'https://localhost:5001/account')
            let users = JSON.parse(localStorage.getItem('users'))
            let index = Math.floor(Math.random() * users.length)
            userTwo = users[index]
            userTwo["username"] = `${userTwo.name} ${userTwo.surname}`
            users.splice(index, 1)
            localStorage.setItem('users', JSON.stringify(users))
            await this.create(userTwo, 'https://localhost:5001/account/register')
            try {
              await this.delete(vault.id)
              return this.fail("User able to delete a vault they don't own.")
            } catch (e) {
              await this.create(userOne, 'https://localhost:5001/account/login')
              await this.delete(vault.id)
              return this.pass("Able to delete vaults!")
            }
          } catch (e) {
            this.unexpected("Vault deleted", this.handleError(e))
          }
        })
    )
  }
}