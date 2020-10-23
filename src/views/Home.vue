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
            <ul class="text-left container">
              <li class="my-2">
                <strong>OPEN YOUR INSPECTOR TOOLS</strong>
              </li>
              <li class="my-2">
                Create a user in an incognito window (ex: Jimmy Tester, J@j.com,
                Testing123) with the same Auth0 Config you are using (you should
                be able to do this from the start of the application after
                adding your auth0 credentials). Grab the token from the network
                tab to add to the "Configure Auth0" at the top of this page.
              </li>
              <li class="my-2">
                After adding all your credentials to this page as well, login
                with a user other than the one you created the first token with.
              </li>
              <li class="my-2">
                When you press 'run tests' it will create a waterfall effect.
                Each time a test is successful, it will invoke the next test. If
                a test fails, the next test may pass, however this is not a
                certainty as some tests are checking to insure failure (Auth
                Tests)
              </li>
              <li class="my-2">
                It is encouraged to work on one collection at a time, try to not
                spend an excessive amount of time on one or two tests, this can
                slow you down and cost you important time.
              </li>
              <li>
                When you are ready to view the tests and begin testing, click on
                the word "Welcome" in the upper left corner of this box and then
                be sure to scroll down.
              </li>
              <li class="my-2">
                Be sure to read your error messages in the console if a test
                does not pass. Again some tests will pass with errors, this is
                intentional as there are times your server should throw an error
                ex: Trying to delete data you did not create.
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
