<template>
    <div class="columns is-mobile is-desktop">
        <div class="card column is-one-third-desktop is-full-mobile" >
            <div class="card-content">
                <figure class="image is-64x64">
                    <img src="~/assets/Factly-Logo-min.png"> 
                </figure>
                <p class="control has-icons-left">
                    <input class="input " type="text" v-model="username" placeholder="Username">
                    <b-icon class="icon is-small is-left"
                        pack="fas"
                        icon="user"
                        size="is-small">
                    </b-icon>
                </p>
                <br>
                <p class="control has-icons-left">
                    <input class="input " type="password" v-model="password" placeholder="Password">
                    <b-icon class="icon is-small is-left"
                        pack="fas"
                        icon="lock"
                        size="is-small">
                    </b-icon>
                </p>
                <br>
                <button class="button is-fullwidth is-primary is-rounded" v-on:click="login">
                    LOGIN
                    <b-icon class="icon is-small is-right"
                        pack="fas"
                        icon="fa-sign-in-alt"
                        size="is-small">
                    </b-icon>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Vue from 'vue';
import { state } from '../../store/user'
import { getData, setData } from 'nuxt-storage/local-storage';
export default {
    data(){
        return {
            username:"user0",
            password:"12345678",
        };
    },
    methods:{
        login:async function(event){
            console.log(this.username,this.password)
            const loginReq = await axios({
                method:"POST",
                url:'http://localhost:3000/api/user/login',
                data:{
                    "userId":this.username,
                    "password":this.password
                },

            })
            if(loginReq.data.success){
                console.log(loginReq.data.result)
                Vue.prototype.$auth_token = loginReq.data.result.auth_token;
                this.$store.commit('user/setToken',loginReq.data.result.auth_token);
                setData("username","test");
                console.log("username",getData("username"));
                this.$router.push("/");
            }
        }
    }
}
</script>
<style scoped>
.card{
    margin: auto;
    margin-top:5%;
    margin-bottom:5%;
}
.title{
    text-align: center;
}
.image{
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top:0%;
    margin-bottom:10%;
}
.button{
    background-color: "primary";
}

</style>

