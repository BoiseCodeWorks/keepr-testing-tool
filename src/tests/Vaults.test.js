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
      this.canCreateVault(),
      this.canGetVaultById(),
      this.canDeleteVault()
    )
  }

  canCreateVault() {
    return new Test({
      name: 'Can Create a vault',
      path: PATH,
      description: 'POST request. This should create a new vault.',
      expected: 'Vault',
      payload: 'Vault object { name, description }'
    },
      async () => {
        let vault
        try {
          vault = await this.create({ ...vaultObj, userId: "dont trust the front end" })
          this.verifyIsSame(vaultObj, vault)
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
    )
  }

  canGetVaultById() {
    return new Test({
      name: 'Can get a vault by its id',
      path: PATH,
      description: 'GET request. This should get a single vault by its id.',
      expected: 'Vault',
      payload: `Vault { }`
    },
      async () => {
        try {
          let vaults = await this.get("https://localhost:5001/api/vaults");
          if (vaults.length < 1) {
            return this.fail('Please create at least one vault to test this route.')
          }
          let vault = await this.getById(vaults[0].id)
          return this.pass("Able to get a users vault by its id.", vault)
        } catch (e) {
          return this.unexpected([vaultObj], this.handleError(e))
        }
      }
    )
  }


  canDeleteVault() {
    return new Test({
      name: 'Can delete a vault',
      path: PATH,
      description: 'DELETE request. This should delete a vault.',
      expected: '',
      payload: ''
    },
      async () => {
        try {
          let vault = await this.create(vaultObj)
          await this.delete(vault.id)
        } catch (e) {
          return this.unexpected("Vault deleted", this.handleError(e))
        }
        try {
          await this.getById(vault.id)
          return this.fail("Vault was not deleted from the database.")
        } catch (e) {
          return this.pass("Vault was deleted!")
        }
      })
  }

}