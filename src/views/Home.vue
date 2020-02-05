<template>
  <div class="home container-fluid">
    <div class="row">
      <div class="col-12 mb-3 mt-3">
        <div class="card shadow">
          <div class="card-body readMeSection text-left">
            <h3>
              <span @click="openTests">Welcome</span> to the Keepr Testing Tool.
            </h3>
            <p>
              This tool is designed to test very specific routes in your
              application's backend.
              <strong>
                If your routes are different these tests will not work.
              </strong>
            </p>
            <p>
              Each test will tell you what pathway it is testing, what data (if
              any) should be sent to your API, and what the response should be
              from your database. Once the test passes, it will turn green, and
              the next test will be called. Each section of tests will
              correspond to a controller in your backend. It is designed so that
              you can test one controller at a time
            </p>
            <p>
              Please read the following directions before beginning your tests:
            </p>
            <ul class="text-left">
              <li class="my-2">
                <strong>OPEN YOUR INSPECTOR TOOLS</strong>
              </li>
              <li class="my-2">
                Create a user. When you create a user, it will test all of your
                auth routes.
              </li>
              <li class="my-2">
                After you create your first user successfully, you will be able
                to use the "test an existing account" option
              </li>
              <li class="my-2">
                Next, test your Keep controller. When you press 'run tests' it
                will create a waterfall effect. Each time a test is successful,
                it will invoke the next test.
                <strong>
                  If a test fails, the next tests will not run.
                </strong>
                This means that if you pass the first test and the remaining
                tests stay red, that does not mean that all of them are broken;
                it means that the next test in the line did not pass so the
                remaining tests were not run.
              </li>
              <li>
                When you are ready to view the tests and begin testing, click on
                the word "Welcome" in the upper left corner of this box and then
                be sure to scroll down.
              </li>
              <li class="my-2">
                Be sure to read your error messages in the console if a test
                does not pass.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vue from "vue";
import { Auth0Plugin } from "@bcwdev/auth0-vue";
export default {
  name: "home",
  methods: {
    openTests() {
      this.$router.push({ name: "testRunner" });
    }
  }
};
</script>
<style></style>
