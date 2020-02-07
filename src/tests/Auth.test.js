import { Suite, Test } from "@bcwdev/vue-api-tester";
import Axios from "axios";
import { SetAuth } from "./AuthUtility";
import { UtilitySuite } from "./UtilitySuite";
import { getInstance } from "@bcwdev/auth0-vue";

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

      this.startNoAuthTests(),

      this.GET_PrivateKeep(),
      this.GET_Vault(),
      this.GET_VaultKeep(),
      this.GET_PublicKeep(),

      this.EDIT_PublicKeep(),
      this.EDIT_PrivateKeep(),
      this.EDIT_Vault(),

      this.DELETE_PublicKeep(),
      this.DELETE_PrivateKeep(),
      this.DELETE_Vault(),
      this.DELETE_VaultKeep(),

      this.startWrongAuthTests(),

      this.GET_PrivateKeep(),
      this.GET_Vault(),
      this.GET_VaultKeep(),
      this.GET_PublicKeep(),

      this.EDIT_PublicKeep(),
      this.EDIT_PrivateKeep(),
      this.EDIT_Vault(),

      this.DELETE_PublicKeep(),
      this.DELETE_PrivateKeep(),
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
        let privateKeep = {
          name: "PRIVATE__KEEP",
          description: "MY__PRIVATE__KEEP",
          img: "//placehold.it/200x200",
          isPrivate: true
        };
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
        try {
          this.privateKeep = await this.create(privateKeep, KEEPS);
          this.publicKeep = await this.create(publicKeep, KEEPS);
          this.vault = await this.create(vault, VAULTS);
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
          await this.create(vaultKeep, VAULTKEEPS);
          this.vaultKeep = vaultKeep;
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
        description: "Please login as a different user to validate these tests"
      },
      async () => {
        // let authService = getInstance();
        // try {
        //   alert(
        //     // @ts-ignore
        //     `Please Login with a new user other than ${authService.user.name}`
        //   );
        //   // @ts-ignore
        //   await authService.loginWithPopup();
        //   // @ts-ignore
        //   await authService.getUserData();
        //   this.request.defaults.headers.Authorization = authService.bearer;
        //   return this.pass("Starting Wrong User Tests");
        // } catch (e) {
        //   return this.fail(e.message);
        // }
        this.pass("")
      }
    );
  }

  GET_PrivateKeep() {
    return new Test(
      {
        name: "Get Private Keep",
        path: "api/keeps/:id",
        description:
          "The server should send back an error when attempting to get a private keep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.getById(this.privateKeep.id, KEEPS);
        } catch (e) {
          return this.pass("can not get private keeps");
        }
        return this.fail("Should not be able to get private keeps");
      }
    );
  }
  GET_Vault() {
    return new Test(
      {
        name: "Get Vault",
        path: "api/vaults/:id",
        description:
          "The server should send back an error when attempting to get a vault",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.getById(this.vault.id, VAULTS);
        } catch (e) {
          return this.pass("can not get vaults that don't belong to you");
        }
        return this.fail("Should not be able to get vaults");
      }
    );
  }

  GET_VaultKeep() {
    return new Test(
      {
        name: "Get VaultKeep",
        path: "api/vaults/:id/keeps",
        description:
          "The server should send back an error when attempting to get a vaultkeep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.request.get(`${VAULTS}/${this.vault.id}/keeps`);
        } catch (e) {
          return this.pass("can not get vault keeps that don't belong to you");
        }
        return this.fail("Should not be able to get vaults keep");
      }
    );
  }

  GET_PublicKeep() {
    return new Test(
      {
        name: "Get Public Keep",
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
  EDIT_PublicKeep() {
    return new Test(
      {
        name: "EDIT public keep",
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
  EDIT_PrivateKeep() {
    return new Test(
      {
        name: "EDIT private keep",
        path: "api/keeps/:id",
        description:
          "The server should send back an error when attempting to edit a keep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.update(this.privateKeep, KEEPS);
        } catch (e) {
          return this.pass(
            "not be able to edit a keep that doesnt belong to you regardless of private status"
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
          "The server should send back an error when attempting to edit a vault",
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
          await this.delete(this.publicKeep, KEEPS);
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
  DELETE_PrivateKeep() {
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
          await this.delete(this.privateKeep, KEEPS);
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
          await this.delete(this.vault, VAULTS);
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
        name: "PUT VaultKeep",
        path: "api/vaultskeeps",
        description:
          "The server should send back an error when attempting to delete a vaultkeep",
        expected: "ERROR"
      },
      async () => {
        try {
          await this.request.put(VAULTKEEPS, this.vaultKeep);
        } catch (e) {
          return this.pass(
            "not be able to delete a vaultkeep that doesnt belong to you"
          );
        }
        this.fail(
          "the server should throw an error when attempting to delete a vaultkeep that does not belong to you"
        );
      }
    );
  }
}
