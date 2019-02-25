<template>                                                                                                                                                              
    <section>
        <div class="columns">
            <div class="column is-one-quarter box">
                <div class="columns " verticalAlignment="center">
                    <div class="column is-one-third">
                        <img width="64" :src="imageUrl"/>
                    </div>
                    <div class="column center" style="vertical-align:middle">
                        {{name}}
                    </div>
                </div>
                <div v-if="description" class="column">
                    {{ description}}
                </div>
                <div class="columns">
                    <div class="column is-half is-mobile ">
                        <div class="columns is-multiline">
                            <div class="column is-full value">
                            {{numFollowers}}
                            </div>
                            <div class="column is-full label">
                            Followers
                            </div>
                        </div>
                    </div>
                    <div class="column is-half ">
                        <div class="columns is-multiline">
                            <div class="column is-full value">
                            {{packageCount}}
                            </div>
                            <div class="column is-full label">
                            Datasets
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <button class="button is-fullwidth is-primary is-rounded" :click="follow">Follow</button>
                </div>
            </div>
            <div class="column box">
                <b-tabs v-model="activeTab">
                    <b-tab-item label="Datasets">
                        <div class="columns">
                            <div v-for="(dataset,index) in packages" 
                            class="column box is-one-quarter"
                            :key="index">
                                <div class=columns>
                                    <div class="column" style="text-align:center">
                                    {{dataset.name}}
                                    </div>
                                    <!-- <div class="column">
                                        <div class="columns is-multiline">
                                            <div class="column is-full value">
                                                {{dataset.num_resources}}
                                            </div>
                                            <div class="column is-full label">
                                                Resources
                                            </div>
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </b-tab-item>
                    <b-tab-item label="Activity Stream">
                        Lorem <br>
                        ipsum <br>
                        dolor <br>
                        sit <br>
                        amet.
                    </b-tab-item>

                    <b-tab-item label="About">
                        What light is light, if Silvia be not seen? <br>
                        What joy is joy, if Silvia be not by— <br>
                        Unless it be to think that she is by <br>
                        And feed upon the shadow of perfection? <br>
                        Except I be by Silvia in the night, <br>
                        There is no music in the nightingale.
                    </b-tab-item>
                </b-tabs>
            </div>
        </div>
    </section>                                                                                                                                                                
</template> 
<script>
import Vue from 'vue';
import axios from 'axios';
export default {
    data() {
            return {
                activeTab:0,
                id:null,
                name:null,
                imageUrl:null,
                numFollowers:null,
                packageCount:null,
                description:null,
                packages:null,
            }
    },
    async asyncData({store,params}){
    let id=params.id;
    return axios.get("http://localhost:3000/api/organisations/"+id)
                .then((response)=>{
                    console.log("response",response);
                    if(response.status == "200" )
                        return {
                            id:id,
                            name:response.data.name,
                            imageUrl:response.data.image_url,
                            numFollowers:response.data.num_followers,
                            packageCount:response.data.package_count,
                            description:response.data.description,
                            packages:response.data.packages
                        }
                    return null
                })
    },
    computed: {
    token () {
      return this.$store.state.user.token
    }
  },
    methods:{
        follow(){

        }  
    }
}
</script>
<style scoped>
.center{
    margin-top:auto;
    margin-bottom:auto;
}
.value{
  text-align: center;
  font-size: 1em;
  color: darkslateblue;
  padding-bottom:0px;
}
.label{
  text-align: center;
  font-size: 0.8em;
  font-weight: 100;
  color:black;
}
.box{
    margin:5px;
}
</style>
