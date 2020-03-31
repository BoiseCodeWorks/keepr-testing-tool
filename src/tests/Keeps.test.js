import { Test } from "@bcwdev/vue-api-tester";
import { UtilitySuite } from "./UtilitySuite";
import { SetAuth } from "./AuthUtility";
import { getInstance } from "@bcwdev/auth0-vue";

const PATH = "https://localhost:5001/api/keeps";

let keepObj = {
  name: "TEST__KEEP",
  description: "KEEP__DESCRIPTION",
  img: "//placehold.it/200x200",
  isPrivate: false,
  shares: 0,
  views: 0,
  keeps: 0
};

export class KeepsSuite extends UtilitySuite {
  constructor() {
    super("Keeps Testing", PATH);
    SetAuth(this.request);
    this.addTests(
      this.canCreatePublicKeep(),
      this.canCreatePrivateKeep(),
      this.canGetPublicKeeps(),
      this.canGetKeepById(),
      this.canEditKeepById(),
      // REVIEW do we want this?
      // this.cantEditViewsKeepsSharesUserId(),
      this.canDeleteKeepById()
    );
  }

  canCreatePublicKeep() {
    return new Test(
      {
        name: "Can Create a Public Keep",
        path: PATH,
        description:
          "POST request. This should create a new public keep in your database.",
        expected: "Keep",
        payload: "Keep object {name, description, img, isPrivate}"
      },
      async () => {
        let keep;
        try {
          keep = await this.create({
            ...keepObj,
            userId: "dont trust the front end"
          });
          this.verifyIsSame(keepObj, keep);
          return this.pass("Successfully created a keep!", keep);
        } catch (e) {
          return this.unexpected(keepObj, this.handleError(e));
        } finally {
          if (keep) {
            await this.delete(keep.id);
          }
        }
      }
    );
  }

  canCreatePrivateKeep() {
    return new Test(
      {
        name: "Can create Private keeps",
        path: PATH,
        description: "POST request. This should create a new public keep in your database.",
        expected: "Keep"
      },
      async () => {
        let keep;
        try {
          keep = await this.create({
            name: "TEST__KEEP__PRIVATE",
            description: "KEEP__SHOULD_BE_PRIVATE",
            img: "//placehold.it/200x200",
            isPrivate: true
          });
          if (!keep.isPrivate) {
            return this.fail("Could not make a private keep");
          }
          return this.pass("Able to create a private keep", keep);
        } catch (e) {
          return this.unexpected(keep, this.handleError(e));
        }
      }
    );
  }


  canGetPublicKeeps() {
    return new Test(
      {
        name: "Can Get Public Keeps",
        path: PATH,
        description: "GET request. This should get a list of public keeps.",
        expected: "Keep[]"
      },
      async () => {
        let keeps;
        try {
          let user = await this.CheckUserAsync();
          keeps = await this.get();
          if (keeps.length == 0) {
            try {
              let keep = await this.create({
                ...keepObj,
                userId: "dont trust the front end"
              });
              keeps.push(keep);
            } catch (e) {
              return this.fail("Unable to test getting public keeps because none exist, Also unable to create a public keep to test against.");
            }
            if (keeps.length == 0) {
              return this.fail(
                "Please add at least one keep to test this route."
              );
            }
          } else if (!keeps.every(k => !k.isPrivate || k.userId == user.sub)) {
            return this.fail(
              "Able to retrieve private keeps that do not belong to the user."
            );
          } else if (!this.verifyIsSame(keepObj, keeps[0])) {
            return this.fail(
              "Array does not contain objects that match the given Keep model."
            );
          }
          return this.pass("Able to get keeps", keeps.splice(0, 3));
        } catch (e) {
          return this.unexpected([keepObj], this.handleError(e));
        }
      }
    );
  }

  canGetKeepById() {
    return new Test(
      {
        name: "Can Get keep by Id",
        path: PATH + "/:id",
        description: "GET request. This should get one keep by its id.",
        expected: "Keep"
      },
      async () => {
        try {
          let keeps = await this.get();
          if (keeps.length < 1) {
            return this.fail(
              "Please add at least one keep to test this route."
            );
          }
          let keep = await this.getById(keeps[0].id);
          if (keeps[0].id != keep.id) {
            return this.fail("Could not retrieve the keep by its Id.");
          }
          return this.pass("Retrieved Keep by Id", keep);
        } catch (e) {
          return this.unexpected(keepObj, this.handleError(e));
        }
      }
    );
  }

  canEditKeepById() {
    return new Test(
      {
        name: "Can Edit keep by Id",
        path: PATH + "/:id",
        description: "PUT request. This should update one keep by its id.",
        expected: "Keep",
        payload: "Keep"
      },
      async () => {
        let keep;
        let updatedKeep;
        try {
          await this.CheckUserAsync();
          let newKeep = { ...keepObj };
          keep = await this.create(newKeep);
          let editedKeep = { ...keep };
          editedKeep.name = "edited keep";
          await this.update(editedKeep);
          updatedKeep = await this.getById(editedKeep.id);
          if (updatedKeep.name != editedKeep.name) {
            return this.fail("Could not edit the keep.");
          }
          return this.pass("Successfully edited the keep!", updatedKeep);
        } catch (e) {
          return this.unexpected(keepObj, this.handleError(e));
        } finally {
          if (keep) {
            await this.delete(keep.id);
          }
        }
      }
    );
  }

  canDeleteKeepById() {
    return new Test(
      {
        name: "Can delete keep by Id",
        path: PATH + "/:id",
        description: "DELETE request. This should delete one keep by its id.",
        expected: "Keep"
      },
      async () => {
        let keep;
        try {
          keep = await this.create({
            name: "TEST__KEEP__DELETABLE",
            description: "KEEP__DESCRIPTION_SHOULD_GET_DELETED",
            img: "//placehold.it/200x200",
            isPrivate: false
          });
        } catch (e) {
          return this.unexpected(keep, e.response.data);
        }

        try {
          await this.delete(keep.id);
        } catch (e) {
          return this.fail(e.message);
        }

        try {
          await this.getById(keep.id);
          return this.fail("Unable to delete keep by its Id");
        } catch (e) {
          return this.pass("Sucessfully removed keep by it's Id", keep);
        }
      }
    );
  }

  cantEditViewsKeepsSharesUserId() {
    return new Test({
      name: "Cant edit shares, views, keeps, or userId",
      path: PATH + "/:id",
      description: "PUT request. Cant edit shares, views, keeps, or userId from the front end on a keep.",
      expected: "Keep",
      payload: "Keep"
    },
      async () => {
        let keep;
        let updatedKeep;
        try {
          let newKeep = { ...keepObj };
          keep = await this.create(newKeep);
          let editedKeep = { ...keep };

          editedKeep.shares = 10;
          editedKeep.views = 10;
          editedKeep.keeps = 10;
          editedKeep.userId = "Oops. You allowed the front end to change your userId";

          await this.update(editedKeep);
          updatedKeep = await this.getById(editedKeep.id);
          console.log(updatedKeep);
          for (let key in updatedKeep) {
            if (updatedKeep[key] != keep[key]) {
              return this.fail(`Was able to edit the field ${key} on the keep.`);
            }
          }
          return this.pass("Couldn't edit the shares, views, keeps, or userId.", updatedKeep);
        } catch (e) {
          return this.unexpected(keepObj, this.handleError(e));
        } finally {
          if (keep) {
            await this.delete(keep.id);
          }
        }
      }
    );
  }
}
