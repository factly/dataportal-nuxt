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
                     :class="{ selected: selected[index][key] }"
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
                    </div><br>
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
                isFetching: false,
                datasets:null,
                title:"some-title",
                count:0,
                parameters:null,
                filters:{},
                selected:{},
                selectedList:[],
                filterQuery:null
            }
    },
    async asyncData(){
        console.log("async data")
    return axios
      .get(`http://localhost:3000/api/datasets`)
      .then(response => {
          console.log("response",response.data);
          
        return {
                datasets : response.data.result ,
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
                        this.datasets = response.data.results;
                        this.calculateFilters();
                        console.log(this.datasets)
                    })
                    .catch(error => console.log(error))
                }
        },
        changeFilter(event,category,filterItem){
            console.log(category,filterItem);
            //this.$set(this.selected[category], filterItem, true);
            //this.$set(this.selected,category,this.selected[category]);
            if(!this.filters[category])
                this.filters[category] = [];
            let index = this.filters[category].indexOf(filterItem);
            if(index==-1){
                this.filters[category].push(filterItem);
                this.selected[category][filterItem] = true;
                this.selectedList.push(category+":"+filterItem);
            }
            else{
                this.filters[category].splice(index, 1);
                this.selected[category][filterItem] = false;
                let indexToDelete = this.selectedList.indexOf(category+":"+filterItem);
                this.selectedList.splice(indexToDelete,1);
            }
            this.selected = Object.assign({},this.selected)
            let searchQuery = ""
            for(let category in this.selected){
                let queryitems = "";
                for(let filterItem in this.selected[category]){
                    if(this.selected[category][filterItem]){
                        debugger;
                        if(category!="Tags" && category!="Formats" && category!="Licenses")
                            filterItem = filterItem.toLowerCase();
                        queryitems+='"'+filterItem+'"'+"+";
                    }
                }
                if(queryitems!= ""){
                    if(category == "Organisations")
                        category = "organization";
                    if(category == "Formats")
                        category = "res_format";
                    if(category == "Licenses")
                        category = "license_title"
                    searchQuery+=category.toLowerCase()+":"+queryitems+" ";
                }
            }
            this.filterQuery = searchQuery;
            let test = this.getAsyncData(()=>{
                this.datasets = this.data;
            this.calculateFilters();
            
            })
            console.log("datasets",this.datasets)
        },
        getAsyncData(callback=null){
            debugger;
            if (!this.name.length) {
                    this.data = [];
            }
            this.isFetching = true;
            name=this.name;
            let filter= this.filterQuery;
            debugger;
            axios.get(`http://localhost:3000/api/datasets?search=`+name+`&filter=`+filter)
            .then(response =>{
                this.data =[]
                console.log(response)
                debugger;
                if(response.data)
                    if(response.data.result)
                        response.data.result.forEach((item)=>this.data.push(item))
                console.log(this.data)
                if(callback){
                    debugger;
                    callback();
                }
                
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
            this.selected["Organisations"] = {};
            this.selected["Groups"] = {};
            this.selected["Tags"] = {};
            this.selected["Formats"] = {};
            this.selected["Licenses"] = {};
            console.log(this.selected);
            this.datasets.forEach(dataset=>{
                console.log(dataset);
                if(dataset.organization){
                    this.selected["Organisations"][dataset.organization.name] = false;
                    if(this.parameters["Organisations"][dataset.organization.name])
                        this.parameters["Organisations"][dataset.organization.name]++;
                    else
                        this.parameters["Organisations"][dataset.organization.name]=1;
                }
                dataset.groups.forEach(group=>{
                    this.selected["Groups"][group.display_name] = false;
                    if(this.parameters["Groups"][group.display_name])
                        this.parameters["Groups"][group.display_name]++;
                    else
                        this.parameters["Groups"][group.display_name]=1;
                })
                dataset.tags.forEach(tag=>{
                    this.selected["Tags"][tag.display_name] = false;
                    if(this.parameters["Tags"][tag.display_name])
                        this.parameters["Tags"][tag.display_name]++;
                    else
                        this.parameters["Tags"][tag.display_name]=1;
                })
                dataset.resources.forEach(resource=>{
                    this.selected["Formats"][resource.format] = false;
                    if(this.parameters["Formats"][resource.format])
                        this.parameters["Formats"][resource.format]++;
                    else
                        this.parameters["Formats"][resource.format]=1;
                })
                this.selected["Licenses"][dataset.license_title] = false;
                if(this.parameters["Licenses"][dataset.license_title]){
                    this.parameters["Licenses"][dataset.license_title]++;
                }
                else
                    this.parameters["Licenses"][dataset.license_title]=1;
            })
            let newSelectedList = [];
            this.selectedList.forEach(selectedItem=>{
                var selectedItemArray = selectedItem.split(":");
                var category = selectedItemArray[0];
                var filterItem = selectedItemArray[1];
                debugger;   
                console.log(this.selected[category])
                if(this.selected[category]!=null){
                    if(this.selected[category][filterItem]!=null){
                    this.selected[category][filterItem] = true;
                    newSelectedList.push(category+":"+filterItem);
                    debugger;
                    }
                }
            })
            this.selectedList = newSelectedList;
            this.selected = Object.assign({},this.selected);
            console.log("selected",this.selected);
            debugger;

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
    margin: 2px;
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
.selected{
      /* color:#0d47a1; */
      background: #d9dbdf
}
.filter-item .selected :hover{
      background: #d9dbdf
}
</style>
