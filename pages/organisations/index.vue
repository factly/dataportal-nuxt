<template>
<div>
    <h1></h1>
    <section>
        <div class="columns">
        <b-field class="column is-11">
            <b-autocomplete 
                ref="autocomplete"
                v-model="name"
                :data="data"
                :placeholder="'Search from '+count+' Organisations'"
                field="title"
                :loading="isFetching"
                @keyup.enter.native="search"
                @keyup.native="getAsyncData"
                @select="select">

                <template slot-scope="props">
                    <div class="media">
                        <div class="media-left">
                            <img width="32" :src=props.option.image_display_url>
                        </div>
                        <div class="media-content">
                         {{ props.option.display_name}}
                        </div>
                    </div>
                </template>
            </b-autocomplete>
        </b-field>
        <div class="column is-1" >
            <button class="button is-primary" v-on:click="search">Search</button>
        </div>
        </div>
    </section>
    <br>
    <section v-if="organisations">
        <div class="columns .is-variable is-3 is-multiline is-mobile is-centered">
            <nuxt-link 
                class="card-wrapper column is-one-quarter-desktop is-full-mobile" 
                :to="'organisations/'+organisation.id" v-for="(organisation,index) in organisations" 
                :key="index" >
            <OrganisationCard 
                :title="organisation.title" 
                :imageSrc="organisation.image_display_url"
                :followers="organisation.num_followers"
                :datasets="organisation.package_count" 
                 /></nuxt-link>
        </div>
    </section>
</div>
</template>
<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import OrganisationCard from '~/components/OrganisationCard';
import Vue from 'vue';
export default {
    components :{
        OrganisationCard
    },
    data() {
            return {
                data: [],
                name: '',
                selected: null,
                isFetching: false,
                organisations:null,
                title:"some-title",
                count:0,
            }
    },
    async asyncData({store}){
    console.log(store.state.user.token);
    return axios
      .get(`http://localhost:3000/api/organisations`)
      .then(response => {
        console.log(response.data)
        return {
                organisations : response.data ,
                count: response.data.length
            }
      })
      .catch(error => console.log(error))
    },
    computed: {
    token () {
      return this.$store.state.user.token
    }
  },
    methods:{
        select:function(option){
            if(option)
                this.name = option.display_name
                this.search();
        },
        search:function(event = null){
            console.log(this.token1)
            if(this.name){
                axios.get(`http://localhost:3000/api/organisations?filter=`+this.name)
                    .then(response =>{
                        this.data =[]
                        console.log(response)
                        if(response.data)
                            response.data.forEach((item)=>this.data.push(item))
                        console.log(this.data)
                        this.organisations = this.data;
                        this.$refs.autocomplete.isActive = false;
                    })
                    .catch((error) => {
                        this.data = []
                        throw error
                    })   
            }
            else{
                return axios
                    .get(`http://localhost:3000/api/organisations/`)
                    .then(response => {
                        console.log(response.data);
                        this.organisations = response.data
                    })
                    .catch(error => console.log(error))
                }
        },
        getAsyncData:debounce(function(){
            if (!this.name.length) {
                    this.data = []
                    return
            }
            this.isFetching = true;
            axios.get(`http://localhost:3000/api/organisations?filter=`+this.name)
            .then(response =>{
                this.data =[]
                console.log(response)
                if(response.data)
                response.data.forEach((item)=>this.data.push(item))
                console.log(this.data)
            })
            .catch((error) => {
                this.data = []
                throw error
            })
            .finally(() => {
                this.isFetching = false
            })
        },500),
        
    }
}
</script>
<style scoped>
.card-wrapper{
    padding: 0;
    margin:12px;
}
</style>

