import { Test } from "@bcwdev/vue-api-tester";
import { UtilitySuite } from "./UtilitySuite";

const PATH = "https://localhost:5001/api/vaults";

let keepObj = {
  name: "TEST__KEEP",
  description: "KEEP__DESCRIPTION",
  img: "//placehold.it/200x200",
  shares: 0,
  views: 0,
  keeps: 0
};
let vaultObj = {
  name: "TEST__VAULT",
  description: "VAULT__DESCRIPTION"
}

export class VaultKeepsSuite extends UtilitySuite {
  constructor() {
    super("Vault Keeps Testing", PATH);
    this.addTests(
      this.canCreateVaultKeep(),
      this.canGetVaultKeepsByVaultId(),
      this.canDeleteVaultKeep()
    );
  }

  canCreateVaultKeep() {
    return new Test({
      name: 'Can Create a Vault Keep',
      path: "https://localhost:5001/api/vaultkeeps",
      description: 'POST request. This should create a new vault keep relationship.',
      expected: 'VaultKeep',
      payload: 'Vault object { keepId, vaultId }'
    },
      async () => {
        let vaultKeeps = [];
        let vaults = [];
        let keep = {}
        let vault = {}
        let vaultKeep;
        try {
          keep = await this.create({ ...keepObj }, "https://localhost:5001/api/keeps");
          vault = vaults = await this.create({ ...vaultObj }, "https://localhost:5001/api/vaults");
        } catch (e) {
          return this.unexpected("Unable to create vault or", this.handleError(e));
        }
        try {
          let created = await this.create({ keepId: keep.id, vaultId: vault.id, userId: "dont trust the front end" }, "https://localhost:5001/api/vaultkeeps");
          vaultKeeps = await this.get(`https://localhost:5001/api/vaults/${vault.id}/keeps`);
          vaultKeep = vaultKeeps.find(vk => vk.vaultKeepId == created.id);
          if (vaultKeep) {
            return this.pass("Successfully created a vault keep!");
          }
          return this.fail("Couldnt create a vault keep.");
        } catch (e) {
          return this.unexpected("VaultKeep", this.handleError(e));
        }
      }
    );
  }

  canGetVaultKeepsByVaultId() {
    return new Test({
      name: 'Can get vaultkeeps by a vault id',
      path: PATH + "/:id/keeps",
      description: 'GET request. This should get an array of keeps inside a vault.',
      expected: 'VaultKeepViewModel[]',
      payload: ``
    },
      async () => {
        let vaults = [];
        let vaultKeeps;
        let keep = {};
        let vault = {}
        try {
          keep = await this.create({ ...keepObj }, "https://localhost:5001/api/keeps");
          vault = vaults = await this.create({ ...vaultObj }, "https://localhost:5001/api/vaults");
        } catch (e) {
          return this.unexpected("Unable to create vault or", this.handleError(e));
        }
        try {
          await this.create({ keepId: keep.id, vaultId: vault.id, userId: "dont trust the front end" }, "https://localhost:5001/api/vaultkeeps");
          vaultKeeps = await this.get(`https://localhost:5001/api/vaults/${vault.id}/keeps`);
          if (vaultKeeps.length < 1) {
            return this.fail('Couldnt find any vault keeps by a vault Id.');
          }
          return this.pass("Able to get vaultkeeps by vault Id.", vaultKeeps.splice(0, 3));
        } catch (e) {
          return this.unexpected("Keeps[]", this.handleError(e));
        }
      }
    );
  }


  canDeleteVaultKeep() {
    return new Test({
      name: 'Can delete a vault keep',
      path: "https://localhost:5001/api/vaultkeeps/:id",
      description: 'DELETE request. This should delete a vaultkeep relationship.',
      expected: '',
      payload: ''
    },
      async () => {
        let vaultKeeps = [];
        let vaults = [];
        let vaultKeep;
        let keep = {};
        let vault = {}
        try {
          keep = await this.create({ ...keepObj }, "https://localhost:5001/api/keeps");
          vault = vaults = await this.create({ ...vaultObj }, "https://localhost:5001/api/vaults");
        } catch (e) {
          return this.unexpected("Unable to create vault or", this.handleError(e));
        }
        try {

          let vk = await this.create({ keepId: keep.id, vaultId: vault.id, userId: "dont trust the front end" }, "https://localhost:5001/api/vaultkeeps");
          await this.delete(vk.id, "https://localhost:5001/api/vaultkeeps");
          vaultKeeps = await this.get(`https://localhost:5001/api/vaults/${vault.id}/keeps`);
          vaultKeep = vaultKeeps.find(vkeep => vk.vaultKeepId == vkeep.vaultKeepId);
          if (vaultKeep) {
            return this.fail("Couldn't remove keep from vault.");
          }
          return this.pass("Able to delete a vault keep relationship.");
        } catch (e) {
          return this.unexpected("VaultKeep", this.handleError(e));
        }
      });
  }

}