<template>
  <button class="button is-fullwidth is-primary is-rounded" v-on:click="getToken">Test</button>

</template>

<script>
import { getData, setData } from 'nuxt-storage/local-storage';
export default {
  name: 'HomePage',
  data(){
    return {

    }
  },
  methods:{
    getToken(){
          console.log(getData("token"));
    }
  }
}
</script>
