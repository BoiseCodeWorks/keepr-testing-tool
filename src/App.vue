<template>
  <div id="app">
    <auth0config />
    <router-view />
  </div>
</template>

<script>
import auth0config from "./components/Auth0Config";
export default {
  name: "App",
  components: {
    auth0config
  }
};
</script>

<style>
html,
body {
  background: whitesmoke;
}
.action {
  cursor: pointer;
  user-select: none;
}
</style>
