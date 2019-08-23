<template>
  <div class="keepTests col-6 offset-lg-3 my-4">

    <div class="card" v-for="test in tests" :class="[test.success ? 'border-success' : 'border-danger']">
      <h4>{{test.name}}</h4>
      <p v-for="(value, key) in test.routeInfo">{{key.toUpperCase()}}: {{value}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "keepTests",
    props: ["tests"],
    data() {
      return {}
    },
    computed: {
    },
    methods: {},
    components: {}
  }
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