<template>
<div>
    <section>
        <div class="columns">
        <b-field class="column is-11">
            <b-autocomplete 
                ref="autocomplete"
                v-model="name"
                :data="data"
                placeholder="Search Organisations"
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
            <Card 
                class="column is-one-quarter-desktop is-full-mobile" 
                v-for="(organisation,index) in organisations" 
                :key="index" 
                :title="organisation.title" 
                :imageSrc="organisation.image_display_url"
                :followers="organisation.num_followers"
                :datasets="organisation.package_count" />
        </div>
    </section>
</div>
</template>
<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import Card from '~/components/Card';
export default {
    components :{
        Card
    },
    data() {
            return {
                data: [],
                name: '',
                selected: null,
                isFetching: false,
                title:"some-title"
            }
    },
    async asyncData(){
    return axios
      .get(`http://localhost:3000/api/organisations`)
      .then(response => {
          console.log(response.data);
        return {organisations : response.data.result }
      })
      .catch(error => console.log(error))
    },
    methods:{
        select:function(option){
            if(option)
                this.name = option.display_name
                this.search();
        },
        search:function(event = null){
            if(this.name){
                axios.get(`http://localhost:3000/api/organisations?filter=`+this.name)
                    .then(response =>{
                        this.data =[]
                        console.log(response)
                        response.data.result.forEach((item)=>this.data.push(item))
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
                    .get(`http://localhost:3000/api/organisations`)
                    .then(response => {
                        console.log(response.data);
                        this.organisations = response.data.result
                    })
                    .catch(error => console.log(error))
                }
        },
        getAsyncData:debounce(function(){
            console.log(name)
            if (!this.name.length) {
                    this.data = []
                    return
            }
            this.isFetching = true;
            axios.get(`http://localhost:3000/api/organisations?filter=`+this.name)
            .then(response =>{
                this.data =[]
                console.log(response)
                response.data.result.forEach((item)=>this.data.push(item))
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

