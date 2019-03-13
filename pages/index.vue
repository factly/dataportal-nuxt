<template>

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
