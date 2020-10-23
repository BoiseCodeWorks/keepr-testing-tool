<template>
  <div class="bg-dark text-white border-top border-secondary p-2">
    <div class="d-flex align-items-center justify-content-between">
      <h6 class="m-0">
        Authenticated: {{ $auth.isAuthenticated ? $auth.user.name : "false" }}
      </h6>
      <div>
        <button
          class="btn btn-info"
          @click="login"
          v-if="!$auth.isAuthenticated"
        >
          Login
        </button>
        <button class="btn btn-danger" @click="logout" v-else>Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import vue from "vue";
import { loadTests } from "../tests/SuiteLoader";
import ApiTester from "@bcwdev/vue-api-tester";
import { Auth0Plugin } from "@bcwdev/auth0-vue";
export default {
  name: "Auth0Config",
  data() {
    return {
      setupRequired: true
    };
  },
  computed: {
    authReady() {
      return this.$auth;
    }
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWithPopup();
        ApiTester.TestRunner.ClearSuites();
        loadTests();
      } catch (e) {
        console.error(e);
      }
    },
    async logout() {
      await this.$auth.logout({
        returnTo: window.location.origin
      });
      ApiTester.TestRunner.ClearSuites();
    }
  }
};
</script>

<style></style>
