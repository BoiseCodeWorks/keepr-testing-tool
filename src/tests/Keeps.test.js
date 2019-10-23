import { Suite, Test } from "@bcwdev/vue-api-tester"

const PATH = "/api/keeps"

export class KeepsSuite extends Suite {
  constructor() {
    super("Keeps Testing", PATH)
    this.addTests(
      new Test({
        name: "Can Get keeps",
        path: PATH,
        description: 'GET request. This should get a list of keeps.',
        expected: "Keep[]"
      },
        async () => {
          this.keeps = await this.get()
          if (!Array.isArray(this.keeps)) {
            return this.unexpected([], this.keeps)
          }
          return this.pass("Able to get keeps", this.keeps)
        },
      ),
      new Test({
        name: 'Can Create keeps',
        path: PATH,
        description: 'POST request. This should create a new keep in your database. UserId is attached on the server',
        expected: 'Keep',
        payload: 'Keep object {name, description, img, isPrivate}'
      },
        async () => {
          let result = await this.create({
            name: "TEST__KEEP",
            description: "KEEP__DESCRIPTION",
            img: "//placehold.it/200x200",
            isPrivate: false
          })
          this.TESTKEEP = result
          return this.pass("Successfully created value ", result)
        }
      ),
      new Test({
        name: 'Can Get keep by Id',
        path: PATH + '/:id',
        description: 'GET request. This should get one keep by its id.',
        expected: 'Keep'
      },
        async () => {
          let result = await this.getById(this.TESTKEEP.id)
          if (this.TESTKEEP.id != result.id) {
            return this.unexpected(this.TESTKEEP, result)
          }
          return this.pass("Retrieved Keep by Id", this.TESTKEEP)
        },
      ),
      new Test({
        name: 'Can Edit keep by Id',
        path: PATH + '/:id',
        description: 'PUT request. This should update one keep by its id.',
        expected: 'Keep',
        payload: "Keep"
      },
        async () => {
          this.TESTKEEP.name = "TEST_KEEP_EDITIED"
          let result = await this.update(this.TESTKEEP.id)
          if (this.TESTKEEP.name != result.name) {
            let test = this.unexpected(this.TESTKEEP, result)
            test.message = "Unable to edit keep by id"
            return test
          }
          return this.pass("Keep was edited by id", result)
        },
      ),
      new Test({
        name: 'Can delete keep by Id',
        path: PATH + '/:id',
        description: 'DELETE request. This should delete one keep by its id.',
        expected: 'Keep'
      },
        async () => {
          let keep = await this.create({
            name: "TEST__KEEP__DELETABLE",
            description: "KEEP__DESCRIPTION_SHOULD_GET_DELETED",
            img: "//placehold.it/200x200",
            isPrivate: false
          })
          let deleteRequest = await this.delete(keep.id)
          try {
            let getByIdRequest = await this.getById(keep.id)
          } catch (e) {
            return this.pass("Sucessfully removed keep by it's Id", keep)
          }
        }
      ),
      new Test({
        name: 'Can create Private keeps',
        path: PATH,
        description: 'Create private keeps',
        expected: 'Keep'
      },
        async () => {
          let keep = await this.create({
            name: "TEST__KEEP__PRIVATE",
            description: "KEEP__SHOULD_BE_PRIVATE",
            img: "//placehold.it/200x200",
            isPrivate: true
          })
        }
      )
    )
  }
}