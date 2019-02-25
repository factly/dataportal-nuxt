<template>
    <div class="columns is-mobile is-desktop">
        <div class="card column is-one-third-desktop is-full-mobile" >
            <div class="card-content">
                <figure class="image is-64x64">
                    <img src="~/assets/Factly-Logo-min.png"> 
                </figure>
                <p class="control has-icons-left">
                    <input class="input " type="text" v-model="fullname" placeholder="Full Name">
                    <b-icon class="icon is-small is-left"
                        pack="fas"
                        icon="lock"
                        size="is-small">
                    </b-icon>
                </p>
                <br>
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
                <p class="control has-icons-left">
                    <input class="input " type="password" v-model="confirmPassword" placeholder="Confirm Password">
                    <b-icon class="icon is-small is-left"
                        pack="fas"
                        icon="lock"
                        size="is-small">
                    </b-icon>
                </p>
                <br>
                <p class="control has-icons-left">
                    <input class="input " type="email" v-model="email" placeholder="Email">
                    <b-icon class="icon is-small is-left"
                        pack="fas"
                        icon="lock"
                        size="is-small">
                    </b-icon>
                </p>
                <br>
                
                <p class="control has-icons-left">
                    <input class="input " type="text" v-model="about" placeholder="About">
                    <b-icon class="icon is-small is-left"
                        pack="fas"
                        icon="lock"
                        size="is-small">
                    </b-icon>
                </p>
                <br>
                <button class="button is-fullwidth is-primary is-rounded" v-on:click="signup">
                    SIGN UP
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
export default {
    data(){
        return {
            username:"test0",
            fullname:"John Cena",
            email:"test@gmail.com",
            password:"1234",
            confirmPassword:"1234",
            about:"cnwoendcwakoednmf",
        };
    },
    methods:{
        signup:async function(event){
            console.log(this.username,this.password)
            const signupReq = await axios({
                method:"POST",
                url:'http://localhost:3000/api/user/signup',
                data:{
                    "name":this.username,
                    "fullname":this.fullname,
                    "email":this.email,
                    "about":this.about,
                    "password":this.password,
                },

            })
            console.log(signupReq)
            if(signupReq.data.success){
                console.log(signupReq.data.result);
                this.$store.commit('user/setToken',signupReq.data.result.apikey);
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

