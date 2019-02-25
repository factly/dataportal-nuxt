<template>
<div>
    <section>
        <div class="columns">
        <b-field class="column is-11">
            <b-autocomplete 
                ref="autocomplete"
                v-model="name"
                :data="data"
                :placeholder="'Search from'+count+' Groups'"
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
    <section v-if="groups">
        <div class="columns .is-variable is-3 is-multiline is-mobile is-centered">
            <GroupCard 
                class="column is-one-quarter-desktop is-full-mobile" 
                v-for="(group,index) in groups" 
                :key="index" 
                :title="group.title" 
                :imageSrc="group.image_display_url"
                :followers="group.num_followers"
                :datasets="group.package_count" />
        </div>
    </section>
</div>
</template>
<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import GroupCard from '~/components/GroupCard';
export default {
    components :{
        GroupCard
    },
    data() {
            return {
                data: [],
                name: '',
                selected: null,
                isFetching: false,
                groups:null,
                title:"some-title",
                count:0,
            }
    },
    async asyncData(){
    return axios
      .get(`http://localhost:3000/api/groups`)
      .then(response => {
          console.log(response.data);
        return {
                groups : response.data ,
                count: response.data.length
            }
      })
      .catch(error => console.log(error))
    },
    created() {
        this.getAsyncData = debounce(this.getAsyncData, 500);
    },
    methods:{
        select:function(option){
            if(option)
                this.name = option.display_name
                this.search();
        },
        search(event = null){
            if(this.name){
                axios.get(`http://localhost:3000/api/groups?filter=`+this.name)
                    .then(response =>{
                        this.data =[]
                        console.log("search",response)
                        if(response.data)
                        response.data.forEach((item)=>this.data.push(item))
                        
                        this.groups = this.data;
                        console.log("data",this.groups)
                        this.$refs.autocomplete.isActive = false;
                    })
                    .catch((error) => {
                        this.data = []
                        throw error
                    })   
            }
            else{
                return axios
                    .get(`http://localhost:3000/api/groups`)
                    .then(response => {
                        console.log(response.data);
                        this.groups = response.data
                        console.log(this.groups)
                    })
                    .catch(error => console.log(error))
                }
        },
        getAsyncData(){
            console.log(name)
            if (!this.name.length) {
                    this.data = []
                    return
            }
            this.isFetching = true;
            name=this.name;
            axios.get(`http://localhost:3000/api/groups?filter=`+name)
            .then(response =>{
                this.data =[]
                debugger;
                console.log(response)
                if(response.data)
                    response.data.forEach((item)=>this.data.push(item))
                debugger;
                console.log(this.data)
            })
            .catch((error) => {
                this.data = []
                throw error
            })
            .finally(() => {
                this.isFetching = false
            })
        },
        
    }
}
</script>

