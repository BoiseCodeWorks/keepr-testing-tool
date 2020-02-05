<template>
  <div class="home container-fluid">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->

    <div class="row">
      <div class="col-12 mb-3">
        <h1>Keepr Testing Tool</h1>
        <button @click="readMe = !readMe" class="clickable btn btn-danger my-2 mx-1">Read Me</button>
        <div v-if="readMe" class="card border-warning">
          <div class="card-body readMeSection text-left">
            <h3>
              <span @click="openTests">Welcome</span> to the Keepr Testing Tool.
            </h3>
            <p>
              This tool is designed to test very specific routes in your application's backend.
              <strong>
                If your
                routes are different these tests will not work.
              </strong>
            </p>
            <p>
              Each test will tell you what pathway it is testing, what data (if any) should be sent to your API,
              and what the response should be from your database. Once the test passes, it will turn green, and the next
              test will be called. Each section of tests will correspond to a controller in your backend. It is designed
              so that you can test one controller at a time
            </p>
            <p>Please read the following directions before beginning your tests:</p>
            <ul class="text-left">
              <li class="my-2">
                <strong>OPEN YOUR INSPECTOR TOOLS</strong>
              </li>
              <li
                class="my-2"
              >Create a user. When you create a user, it will test all of your auth routes.</li>
              <li class="my-2">
                After you create your first user successfully, you will be able to use the "test an
                existing account"
                option
              </li>
              <li class="my-2">
                Next, test your Keep controller. When you press 'run tests' it will create a waterfall
                effect. Each
                time
                a
                test is successful, it will invoke the next test.
                <strong>
                  If a test fails, the next tests will not
                  run.
                </strong> This means that if you pass the first test and the remaining tests stay red, that does
                not
                mean that all of them are broken; it means that the next test in the line did not pass so the remaining
                tests were not run.
              </li>
              <li>
                When you are ready to view the tests and begin testing, click on the word "Welcome" in the upper left
                corner of this box and then be sure to scroll down.
              </li>
              <li
                class="my-2"
              >Be sure to read your error messages in the console if a test does not pass.</li>
            </ul>
            <div class="card-footer text-center">
              <button @click="readMe = false" class="btn btn-info mx-2">Close</button>
            </div>
          </div>
        </div>

        <button @click="seeUrl = !seeUrl" class="btn btn-danger my-2">View Base URLs</button>
        <div class="card urls border-warning" v-if="seeUrl">
          <div class="card-body">
            <p>
              Auth Base URL:
              <em>/account</em>
            </p>
            <p>
              All Other Tests Base URL:
              <em>/api</em>
            </p>
            <button @click="seeUrl = false" class="btn btn-info">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="actuallyReadDirections" class="row">
      <div class="col-10 col-lg-6 mx-auto">
        <div v-if="!user.email">
          <form v-if="newAccount" @submit.prevent="register">
            <input type="text" v-model="newUser.username" placeholder="name" class="form-control" />
            <input type="email" v-model="newUser.email" placeholder="email" class="form-control" />
            <input
              type="password"
              v-model="newUser.password"
              placeholder="password"
              class="form-control"
            />
            <button type="submit" class="btn btn-info my-2">Create Account</button>
          </form>
          <form v-if="!newAccount" @submit.prevent="login">
            <input type="email" v-model="newUser.email" placeholder="email" class="form-control" />
            <input
              type="password"
              v-model="newUser.password"
              placeholder="password"
              class="form-control"
            />
            <button type="submit" class="btn btn-info">Login</button>
          </form>
          <a @click="newAccount = false" class="mx-2">Test an existing account</a>
          <a @click="newAccount = true" class="mx-2">Create and test a new account</a>
        </div>
      </div>
      <div class="col-6 offset-lg-3 my-3" v-if="user.email">
        <h1 class="mb-2 welcome">Welcome, {{user.username}}</h1>
        <button @click="logout" class="btn btn-info">Logout</button>
      </div>
    </div>-->
    <!-- <div v-if="actuallyReadDirections" class="row">
      <div class="col-12">
        <h1>Auth Tests</h1>
        <p>These tests use the following base URL: /account</p>
      </div>
      <tests :tests="authTests"></tests>
    </div>
    <div v-if="actuallyReadDirections" class="row">
      <div class="col-12">
        <h1 class="mb-2">Test Keep Controller</h1>
        <p>All of the remaining tests use the following base URL: /api</p>
        <button class="btn btn-info mb-2" @click="testKeeps">Run Tests</button>
      </div>
      <tests :tests="keepTests"></tests>
    </div>
    <div v-if="actuallyReadDirections" class="row">
      <div class="col-12">
        <h1 class="mb-2">Test Vault Controller</h1>
        <button class="btn btn-info mb-2" @click="testVaults">Run Tests</button>
      </div>
      <tests :tests="vaultTests"></tests>
    </div>
    <div v-if="actuallyReadDirections" class="row">
      <div class="col-12">
        <h1 class="mb-2">Test Vault Keep Controller</h1>
        <button class="btn btn-info mb-2" @click="testVaultKeeps">Run Tests</button>
      </div>
      <tests :tests="vaultKeepTests"></tests>
    </div>-->
  </div>
</template>

<script>
// @ is an alias to /src
import tests from "@/components/tests.vue";
export default {
  mounted() {
    this.$store.dispatch("authenticate");
  },
  name: "home",
  data() {
    return {
      readMe: true,
      seeUrl: true,
      actuallyReadDirections: false,
      newAccount: true,
      newUser: {
        email: "",
        password: "",
        username: ""
      },
      keepOne: {
        img:
          "https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/2248/s300/cw-logo-square-black-outline.jpg",
        description: "Boise codeworks logo testing one",
        name: "testing one",
        isPrivate: true
      },
      testVault: {
        name: "test vault",
        description: "for testing purposes"
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    keepTests() {
      return this.$store.state.keeps.tests;
    },
    authTests() {
      return this.$store.state.auth.tests;
    },
    vaultTests() {
      return this.$store.state.vaults.tests;
    },
    vaultKeepTests() {
      return this.$store.state.vaultKeeps.tests;
    }
  },
  methods: {
    register() {
      this.$store.dispatch("register", this.newUser);
    },
    login() {
      let test = {
        email: this.newUser.email,
        password: this.newUser.password
      };
      this.$store.dispatch("login", test);
    },
    testKeeps() {
      this.$store.dispatch("createKeep", this.keepOne);
    },
    testVaults() {
      this.$store.dispatch("createVault", this.testVault);
    },
    testVaultKeeps() {
      this.$store.dispatch("getKeep");
    },
    logout() {
      this.$store.dispatch("logout");
      this.$store.dispatch("removeUser");
    },
    openTests() {
      this.$router.push({ name: "testRunner" });
      this.actuallyReadDirections = true;
      this.readMe = false;
    }
  },
  components: {
    tests
  }
};
</script>
<style>
body {
  font-family: "Alice", serif;
}

a,
.clickable {
  cursor: pointer;
}

.welcome {
  font-weight: bold;
  /* color: rgb(70, 69, 66); */
  text-shadow: -1px -1px black;
}
</style>