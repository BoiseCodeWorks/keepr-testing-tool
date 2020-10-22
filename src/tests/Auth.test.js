import { Test } from "@bcwdev/vue-api-tester";
import { SetAuth } from "./AuthUtility";
import { UtilitySuite } from "./UtilitySuite";

const PATH = "https://localhost:5001/api";
const KEEPS = PATH + "/keeps";
const VAULTS = PATH + "/vaults";
const VAULTKEEPS = PATH + "/vaultkeeps";

let privateKeep = {};
let publicKeep = {};
let vault = {};
let vaultKeep = {};

export class UsersSuite extends UtilitySuite {
  constructor() {
    super("Auth Checks", PATH);
    SetAuth(this.request);
    this.addTests(
      this.setupAuthChecks(),
      // SECTION No Auth Tests
      this.startNoAuthTests(),

      this.GET_PrivateVault(),
      this.GET_Vault(),
      this.GET_VaultKeeps(),
      this.GET_PublicKeep(),
      this.GET_PublicKeeps(),

      this.CREATE_VaultKeep(),

      this.EDIT_PublicKeep(),
      this.EDIT_Vault(),

      this.DELETE_PublicKeep(),
      this.DELETE_Vault(),
      this.DELETE_VaultKeep(),
      // SECTION Wrong Auth Tests
      this.startWrongAuthTests(),

      this.GET_PrivateVault(),
      this.GET_Vault(),
      this.GET_VaultKeeps(),
      this.GET_PublicKeep(),
      this.GET_PublicKeeps(),

      this.CREATE_VaultKeep(),

      this.EDIT_PublicKeep(),
      this.EDIT_Vault(),

      this.DELETE_PublicKeep(),
      this.DELETE_Vault(),
      this.DELETE_VaultKeep()
    );
  }

  setupAuthChecks() {
    return new Test(
      {
        name: "Setup Auth Data",
        path: "NONE",
        description: "Creates all of the data necessary to test auth",
        expected: "Creates Keep, Vault, VaultKeep"
      },
      async () => {
        let publicKeep = {
          name: "PUBLIC__KEEP",
          description: "MY__PUBLIC__KEEP",
          img: "//placehold.it/200x200",
          isPrivate: false
        };
        let vault = {
          name: "MY__VAULT",
          description: "MY__VAULT__DESCRIPTION"
        };
        let privateVault = {
          name: "MY__VAULT",
          description: "MY__VAULT__DESCRIPTION",
          isPrivate: true
        };
        try {
          this.publicKeep = await this.create(publicKeep, KEEPS);
          this.vault = await this.create(vault, VAULTS);
          this.privateVault = await this.create(privateVault, VAULTS);
        } catch (e) {
          return this.unexpected(
            { privateKeep, publicKeep, vault },
            this.handleError(e)
          );
        }
        let vaultKeep = {
          vaultId: this.vault.id,
          keepId: this.publicKeep.id
        };
        try {
          this.vaultKeep = await this.create(vaultKeep, VAULTKEEPS);
        } catch (e) {
          return this.unexpected({ vaultKeep }, this.handleError(e));
        }
        return this.pass("Auth Check data setup correctly");
      }
    );
  }

  startNoAuthTests() {
    return new Test(
      {
        name: "Start No Auth Tests",
        path: "NONE",
        description: "Removes Auth token from requests",
        expected: "Auth to function correctly"
      },
      async () => {
        delete this.request.defaults.headers.Authorization;
        return this.pass("Auth Removed");
      }
    );
  }

  startWrongAuthTests() {
    return new Test(
      {
        name: "Start Wrong User Auth Tests",
        path: "NONE",
        description: "Uses the Api Test Token to validate bad user access"
      },
      async () => {
        try {
          let config = JSON.parse(window.localStorage.getItem("auth0:config"));
          if (!config.apiTestToken) {
            return this.fail("Please set you Api Test Token");
          }
          this.request.defaults.headers.Authorization =
            "Bearer " + config.apiTestToken;

          return this.pass("Ready to check wrong auth");
        } catch (e) {
          this.fail(e.message);
        }
      }
    );
  }

  GET_Vault() {
    return new Test(
      {
        name: "Get Vault",
        path: "api/vaults/:id",
        description:
          "The server should send back a vault, even if it is not yours",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.getById(this.vault.id, VAULTS);
        } catch (e) {
          return this.fail("Should be able to get vaults");
        }
        return this.pass("can get vaults that don't belong to you");
      }
    );
  }
  GET_PrivateVault() {
    return new Test(
      {
        name: "Get Private Vault",
        path: "api/vaults/:id",
        description:
          "The server should send back an error when attempting to get a private vault",
        expected: "ERROR"
      },
      async () => {
        let res;
        try {
          res = await this.getById(this.privateVault.id, VAULTS);
        } catch (e) {
          return this.pass("not able to get private vaults");
        }
        return this.unexpected("Should not be able to get private vaults", res);
      }
    );
  }

  GET_VaultKeeps() {
    return new Test(
      {
        name: "Get VaultKeeps",
        path: "api/vaults/:id/keeps",
        description:
          "The server should send back an error when attempting to get a vaultkeep from a private vault",
        expected: "ERROR"
      },
      async () => {
        try {
          let vks = await this.request.get(`${VAULTS}/${this.privateVault.id}/keeps`);
          if (vks.data.length) {
            return this.fail("Should not be able to get vaultkeeps");
          } else {
            throw new Error("GOOD JOB!");
          }
        } catch (e) {
          return this.pass("can not get vault keeps that don't belong to you");
        }
      }
    );
  }
  GET_PublicKeeps() {
    return new Test(
      {
        name: "Get Keeps",
        path: "api/keeps",
        description: "the server should allow you to get keeps",
        expected: this.publicKeep
      },
      async () => {
        try {
          await this.get(KEEPS);
          return this.pass("can get public keeps regardless of auth");
        } catch (e) {
          return this.unexpected(this.publicKeep, this.handleError(e));
        }
      }
    )
  }

  GET_PublicKeep() {
    return new Test(
      {
        name: "Get Keep By Id",
        path: "api/keeps/:id",
        description: "the server should allow you to get public keeps",
        expected: this.publicKeep
      },
      async () => {
        try {
          await this.getById(this.publicKeep.id, KEEPS);
          return this.pass("can get public keeps regardless of auth");
        } catch (e) {
          return this.unexpected(this.publicKeep, this.handleError(e));
        }
      }
    );
  }

  CREATE_VaultKeep() {
    return new Test(
      {
        name: "CREATE vaultkeep",
        path: "api/vaultkeeps",
        description:
          "The server should send back an error when attempting to add a keep to a vault you do not own",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.create({ keepId: this.publicKeep.id, vaultId: this.vault.id }, VAULTKEEPS);
        } catch (e) {
          return this.pass(
            "not be able to add a keep to a vault that doesnt belong to you"
          );
        }
        this.fail(
          "the server should throw an error when attempting to add a keep to a vault that does not belong to you"
        );
      }
    );
  }


  EDIT_PublicKeep() {
    return new Test(
      {
        name: "EDIT keep",
        path: "api/keeps/:id",
        description:
          "The server should send back an error when attempting to edit a keep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.update(this.publicKeep, KEEPS);
        } catch (e) {
          return this.pass(
            "not be able to edit a keep that doesnt belong to you"
          );
        }
        this.fail(
          "the server should throw an error when attempting to edit a keep that does not belong to you"
        );
      }
    );
  }
  EDIT_Vault() {
    return new Test(
      {
        name: "Edit Vault",
        path: "api/vaults/:id",
        description:
          "The server should send back an error when attempting to edit a vault you don't own",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.update(this.vault, VAULTS);
        } catch (e) {
          return this.pass(
            "not be able to edit a vault that doesnt belong to you"
          );
        }
        this.fail(
          "the server should throw an error when attempting to edit a vault that does not belong to you"
        );
      }
    );
  }
  DELETE_PublicKeep() {
    return new Test(
      {
        name: "DELETE Keep",
        path: "api/keeps/:id",
        description:
          "The server should send back an error when attempting to delete a keep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.delete(this.publicKeep.id, KEEPS);
        } catch (e) {
          return this.pass(
            "not be able to delete a keep that doesnt belong to you"
          );
        }
        this.fail(
          "the server should throw an error when attempting to delete a keep that does not belong to you"
        );
      }
    );
  }
  DELETE_Vault() {
    return new Test(
      {
        name: "DELETE Vault",
        path: "api/vaults/:id",
        description:
          "The server should send back an error when attempting to delete a vault",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.delete(this.vault.id, VAULTS);
        } catch (e) {
          return this.pass(
            "not be able to delete a vault that doesnt belong to you"
          );
        }
        this.fail(
          "the server should throw an error when attempting to delete a vault that does not belong to you"
        );
      }
    );
  }
  DELETE_VaultKeep() {
    return new Test(
      {
        name: "DELETE VaultKeep",
        path: "api/vaultkeeps/:vaultKeepId",
        description:
          "The server should send back an error when attempting to delete a vaultkeep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.request.delete(
            `${VAULTKEEPS}/${this.vaultKeep.id}`
          );
        } catch (e) {
          return this.pass(
            "not be able to delete a vaultkeep that doesnt belong to you"
          );
        }
        return this.fail(
          "the server should throw an error when attempting to delete a vaultkeep that does not belong to you"
        );
      }
    );
  }
}
