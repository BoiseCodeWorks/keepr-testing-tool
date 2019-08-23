<template>
  <div class="keepTests col-10 col-lg-6 mx-auto p-1 rounded mb-2">
    <div
      class="card mb-1"
      v-for="test in tests"
      :class="[test.success ? 'border-success' : 'border-danger']"
      :key="test.name"
    >
      <div class="card-header text-light" :class="[test.success ? 'bg-success' : 'bg-danger']">
        <h4>{{test.name}}</h4>
      </div>
      <div class="card-body">
        <p v-for="(value, key) in test.routeInfo" :key="key">{{key.toUpperCase()}}: {{value}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "keepTests",
  props: ["tests"],
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {}
};
</script>

<style>
/* .red {
    /* background-color: #ff8b54; */
/* } */

/* .green {
    /* background-color: #50cf61; */
/* }  */

.card {
  font-weight: bold;
}
</style>