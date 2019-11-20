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
            this.$store.dispatch('user/setactnickname', '昵称: 秦始皇');
            this.$store.dispatch('setactnickname', 'productId: 121d4sd414sd4s4d4sd4s4dfffgasa')
        }
    }
};
</script>

