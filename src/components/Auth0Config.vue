<template>
  <div>
    <div class="p-2 shadow bg-dark text-white">
      <div class="d-flex align-items-center justify-content-between mx-2">
        <h6 class="m-0">Configure Auth0</h6>
        <h6 class="action m-0" @click="setupRequired = !setupRequired">
          <b>{{ setupRequired ? "&plus;" : "&minus;" }}</b>
        </h6>
      </div>
      <form @submit.prevent="setAuth0" v-show="setupRequired">
        <div class="d-flex">
          <input
            type="text"
            placeholder="Domain"
            class="form-control col m-1"
            v-model="auth0Config.domain"
          />
          <input
            type="text"
            placeholder="ClientId"
            class="form-control col m-1"
            v-model="auth0Config.clientId"
          />
          <input
            type="text"
            placeholder="Audience"
            class="form-control col m-1"
            v-model="auth0Config.audience"
          />
        </div>
        <div class="ml-1 my-2">
          <button class="btn btn-info">Save Auth0 Config</button>
        </div>
      </form>
    </div>
    <authstate v-if="!setupRequired && auth0Config.domain" />
  </div>
</template>

<script>
import vue from "vue";
import { loadTests } from "../tests/SuiteLoader";
import { Auth0Plugin } from "@bcwdev/auth0-vue";
import authstate from "./AuthState";
import ApiTester from "@bcwdev/vue-api-tester";

export default {
  name: "Auth0Config",
  data() {
    return {
      setupRequired: true,
      auth0Config: {
        domain: "",
        clientId: "",
        audience: ""
      }
    };
  },
  mounted() {
    let config = window.localStorage.getItem("auth0:config");
    if (config) {
      this.auth0Config = JSON.parse(config);
      this.startAuth0();
    }
  },
  methods: {
    setAuth0() {
      window.localStorage.setItem(
        "auth0:config",
        JSON.stringify(this.auth0Config)
      );
      this.startAuth0();
    },
    startAuth0() {
      this.setupRequired = false;
      vue.use(Auth0Plugin, this.auth0Config);
      ApiTester.TestRunner.ClearSuites();
      loadTests();
    }
  },
  components: {
    authstate
  }
};
</script>

<style></style>
