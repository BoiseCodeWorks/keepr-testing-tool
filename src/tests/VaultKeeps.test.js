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
            let user = await this.CheckUserAsync()
            let vaults = await this.getVaultsAsync()
            let keeps = await this.getPublicKeepsAsync()
            vaultKeep = await this.create(vaultKeep)
            this.verifyIsSame(vaultKeepObj, vaultKeep)
            if (vaultKeep.userId != user.id) {
              return this.fail("Users can create a vault with any user id.")
            }
            return this.pass("Successfully created a VaultKeep!", vaultKeep)
          } catch (e) {
            return this.unexpected(vaultKeepObj, this.handleError(e))
          } finally {
            if (vaultKeep) {
              let vaults = await this.get()
              if (vaults.length > 1) {
                // @ts-ignore
                await this.delete(vaultKeep.id)
              }
            }
          }
        }
      ),

    )
  }
}