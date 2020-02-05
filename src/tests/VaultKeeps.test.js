import { Test } from "@bcwdev/vue-api-tester"
import { UtilitySuite } from "./UtilitySuite"

const PATH = "https://localhost:5001/api/vaults"

let vaultKeepObj = {
  name: "TEST__VAULT",
  description: "VAULT__DESCRIPTION"
}

export class VaultKeepsSuite extends UtilitySuite {
  constructor() {
    super("VaultKeeps Testing", PATH)
    this.addTests(
      new Test({
        name: 'Can Create a VaultKeep',
        path: PATH,
        description: 'POST request. This should create a new vaultkeep relationship in your database. UserId is attached on the server side',
        expected: '',
        payload: 'VaultKeep'
      },
        async () => {
          let vaultKeep
          try {
            let user = await this.CheckUser()
            vaultKeep = await this.create(vaultKeep)
            this.verifyIsSame(vaultKeepObj, vaultKeep)
            if (vaultKeep.userId != user.id) {
              return this.fail("Users can create a vault with any user id.")
            }
            return this.pass("Successfully created a vault!", vault)
          } catch (e) {
            return this.unexpected(vaultObj, this.handleError(e))
          } finally {
            if (vault) {
              let vaults = await this.get()
              if (vaults.length > 1) {
                await this.delete(vault.id)
              }
            }
          }
        }
      ),

    )
  }
}