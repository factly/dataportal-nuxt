<template>
    <section>
         <div class="columns">
            <b-field class="column is-11">
                <b-autocomplete 
                    ref="autocomplete"
                    v-model="name"
                    :data="data"
                    placeholder="Search"
                    field="title"
                    :loading="isFetching"
                    @keyup.enter.native="search"
                    @keyup.native="getAsyncData"
                    @select="select">
                </b-autocomplete>
            </b-field>
            <div class="column is-1" >
                <button class="button is-primary" v-on:click="search">Search</button>
            </div>
         </div>
        <div class="columns">
            <div class="column is-one-quarter box">
                <div v-for="(category,index) in parameters" 
                class="column is-full"
                :key="index">
                    {{index}}
                    <hr/>
                    <div v-for="(value,key) in category"
                     class="column is-multiline button is-white filter-item"
                     :key="key"
                     v-on:click="changeFilter($event,index,key)"
                     >
                        <div class="has-badge-inline" :data-badge="value">{{key}}</div>
                    </div>
                </div>
            </div>
            <div class="column box">
              <div class="box" v-for="(dataset,index) in datasets" :key="index">
                  {{dataset.name}}<br>
                    <div v-for="(group,groupIndex) in dataset.groups" :key="'Group'+groupIndex" class="tag">
                        <b-tag type="is-primary">{{group.display_name}}</b-tag>
                    </div>
                    <div v-for="(tag,tagIndex) in dataset.tags" :key="'Tag'+tagIndex" class="tag">
                        <b-tag type="is-info">{{tag.name}}</b-tag>
                    </div>
              </div>
            </div>
        </div>
    </section>                                                                                                                                                                
</template>
<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import GroupCard from '~/components/GroupCard';
export default {
     components :{
        GroupCard
    },
    created() {
        console.log("page created")
    },
    mounted() {
        console.log("page mounted")
        this.calculateFilters();
        console.log(this.datasets)
        console.log(this.parameters)
    },
    fetch (context) {
        console.log("page fetch")
    },
    validate (context) {
        console.log("page validate")
        return true
    },
   
    data() {
            return {
                data: [],
                name: '',
                selected: null,
                isFetching: false,
                datasets:null,
                title:"some-title",
                count:0,
                parameters:null,
                filters:null,
                
            }
    },
    async asyncData(){
        console.log("async data")
    return axios
      .get(`http://localhost:3000/api/datasets`)
      .then(response => {
          console.log(response.data);
          
        return {
                datasets : response.data ,
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
                axios.get(`http://localhost:3000/api/datasets?filter=`+this.name)
                    .then(response =>{
                        this.data =[]
                        console.log("search",response)
                        if(response.data)
                        response.data.results.forEach((item)=>this.data.push(item))
                        
                        this.datasets = this.data;
                        this.calculateFilters();
                        console.log("data",this.datasets)
                        this.$refs.autocomplete.isActive = false;
                    })
                    .catch((error) => {
                        this.data = []
                        throw error
                    })   
            }
            else{
                return axios
                    .get(`http://localhost:3000/api/datasets`)
                    .then(response => {
                        console.log(response.data);
                        this.datasets = response.data;
                        this.calculateFilters();
                        console.log(this.datasets)
                    })
                    .catch(error => console.log(error))
                }
        },
        changeFilter(event,category,filterItem){
            console.log(category,filterItem);
        },
        getAsyncData(){
            console.log(name)
            if (!this.name.length) {
                    this.data = []
                    return
            }
            this.isFetching = true;
            name=this.name;
            axios.get(`http://localhost:3000/api/datasets?search=`+name)
            .then(response =>{
                this.data =[]
                debugger;
                console.log(response)
                if(response.data)
                    response.data.results.forEach((item)=>this.data.push(item))
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
        calculateFilters(){
            this.parameters = {};
            this.parameters["Organisations"] = {};
            this.parameters["Groups"] = {};
            this.parameters["Tags"] = {};
            this.parameters["Formats"] = {};
            this.parameters["Licenses"] = {};
            this.datasets.forEach(dataset=>{
                console.log(dataset);
                if(this.parameters["Organisations"][dataset.organization]){
                     if(this.parameters["Organisations"][dataset.organization.name])
                        this.parameters["Organisations"][dataset.organization.name]++;
                    else
                        this.parameters["Organisations"][dataset.organization.name]=1;
                }
                dataset.groups.forEach(group=>{
                    if(this.parameters["Groups"][group.display_name])
                        this.parameters["Groups"][group.display_name]++;
                    else
                        this.parameters["Groups"][group.display_name]=1;
                })
                dataset.tags.forEach(tag=>{
                    if(this.parameters["Tags"][tag.display_name])
                        this.parameters["Tags"][tag.display_name]++;
                    else
                        this.parameters["Tags"][tag.display_name]=1;
                })
                dataset.resources.forEach(resource=>{
                    if(this.parameters["Formats"][resource.format])
                        this.parameters["Formats"][resource.format]++;
                    else
                        this.parameters["Formats"][resource.format]=1;
                })
                if(this.parameters["Licenses"][dataset.license_title])
                    this.parameters["Licenses"][dataset.license_title]++;
                else
                    this.parameters["Licenses"][dataset.license_title]=1;
            })
        }
        
    }
}
</script>

<style scoped>
.box{
    margin:5px;
}
.filter-item{
    padding-top:2px;
    padding-bottom: 2px;
    padding-left: 5px;
    padding-right: 25px;
    vertical-align: middle;
    text-align: left;
    height: auto;
    white-space: pre-wrap;      /* CSS3 */   
    white-space: -moz-pre-wrap; /* Firefox */    
    white-space: -pre-wrap;     /* Opera <7 */   
    white-space: -o-pre-wrap;   /* Opera 7 */    
    word-wrap: break-word;      /* IE */
}
hr{
    margin-top: 1px;
    margin-bottom:5px;
    background: rgb(121, 120, 120);
}
.tag{
    display:inline-block;
    padding: 5px;
    font-size: 0.8em;
    margin:auto;
    vertical-align: middle;
    line-height:10px;
   
}
</style>
