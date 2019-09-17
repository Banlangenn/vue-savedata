/* eslint-disable */
<template>
  <div id="app">
    <button @click="setnickname">设置昵称</button>
    <div>{{ this.$store.state.user.nickname }}</div>
    <div>{{ this.$store.state.product.products }}</div>
  </div>
</template>

<script>
export default {
    created() {
        console.log(this.$store.state.product.products)
    },
    data() {
        return {
            iaclinkman: ''
        };
    },
    methods: {
        setnickname() {
            this.$store.dispatch('user/setactnickname', '昵称12123');
            this.$store.dispatch('setactnickname', 'product昵称12123')
        }
    }
};
</script>

