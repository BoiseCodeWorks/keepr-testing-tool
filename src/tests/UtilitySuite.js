import { getInstance } from "@bcwdev/auth0-vue";
import { Suite } from "@bcwdev/vue-api-tester";

export class UtilitySuite extends Suite {
  constructor(name, path) {
    super(name, path);
    this.setCleanup(() => { });
  }
  async CheckUserAsync() {
    try {
      let authInstance = await getInstance();
      if (!authInstance.isAuthenticated) {
        throw new Error("Not logged in, try running the login test first");
      }
      return authInstance.userInfo;
    } catch (e) {
      throw new Error("Not logged in, try running the login test first");
    }
  }

  verifyIsSame(comparedTo, compare) {
    return Object.keys(comparedTo).every(key => compare.hasOwnProperty(key));
  }

  handleError(e) {
    return e.response && e.response.data != "" ? e.response.data : e;
  }

  // FIXME this will be based on user ID
  async getUserKeepsAsync() {
    let keeps = await this.get("https://localhost:5001/api/keeps/user");
    if (keeps.length == 0) {
      return this.fail("Please create at least one keep with this user.");
    }
  }

  async getPublicKeepsAsync() {
    let user = this.CheckUserAsync();
    let keeps = await this.get("https://localhost:5001/api/keeps");
    if (keeps.length == 0) {
      return this.fail("Please create at least one keep.");
      // @ts-ignore
    } else if (!keeps.every(k => !k.isPrivate || k.userId == user.id)) {
      return this.fail(
        "Able to retrieve private keeps that do not belong to the user."
      );
    }
    return keeps;
  }
}
