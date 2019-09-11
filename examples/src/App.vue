<template>
  <div id="app">
    <div class="wrap">
      ----vuex自动缓存演示----{{
      $store.state.user.name
      }}-------vuex自动缓存演示-------------------
      <h1>localStoreage:一直存在</h1>
      <p>{{ $store.state.user.age }}</p>
      <button @click="ageIncrement">+</button>
      <button @click="ageDecrement" style="margin-left:40px">-</button>
    </div>
    <div class="wrap">
      <h1>sessionStoreage：重启浏览器恢复原样</h1>
      <p>{{ $store.state.productstore.count }}</p>

      <button @click="increment2">+</button>
      <button @click="decrement2" style="margin-left:40px">-</button>
    </div>
    <br>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: 'App',
    methods: {
        ...mapMutations(['ageIncrement', 'ageDecrement', 'increment2', 'decrement2'])
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.wrap {
    text-align: center;
}
</style>
