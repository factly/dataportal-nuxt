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
                    <button v-if="followStatus" class="button is-fullwidth is-primary is-rounded" v-on:click="unFollow()">Unfollow</button>
                    <button v-if="followStatus === false" class="button is-fullwidth is-primary is-rounded" v-on:click="follow">Follow</button>
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
                        <div v-html="activityHtml"></div>
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
                followStatus:null,
            }
    },
    async asyncData({store,params}){
    let id=params.id;
    let data ={ };
    let groupDataPromise = axios(
        {
            method:"get",
            url:"http://localhost:3000/api/groups/"+id,
        }
    );
    let token = store.state.user.token;
    let followStatusPromise = axios(
        {
            method:"post",
            url:"http://localhost:3000/api/follow_status",
            data:{
                id:id,
                token:token
            }
        }
    )
     let activityPromise = axios(
        {
            method:"post",
            url:"http://localhost:3000/api/activities/html/group",
            data:{
                id:id
            }
        }
    )
    let groupData,followStatusData,activityHtml
    [groupData,followStatusData,activityHtml] = [ await groupDataPromise,await followStatusPromise ,await activityPromise];
    followStatusData = await followStatusPromise;
    console.log(groupData.data.result)
    if(groupData.data.success){
        data ={
            id:id,
            name:groupData.data.result.name,
            imageUrl:groupData.data.result.image_display_url,
            numFollowers:groupData.data.result.num_followers,
            packageCount:groupData.data.result.package_count,
            description:groupData.data.result.description,
            packages:groupData.data.result.packages
        }
    }
    if(followStatusData.data.success)
        data["followStatus"] =followStatusData.data.result
    if(activityHtml.data.success)
        data["activityHtml"]=activityHtml.data.result
    return data;
    },
    computed: {
    token () {
      return this.$store.state.user.token
    }
  },
    methods:{
        follow:async function(event){
            console.log("pasing")
            let token = this.token;
            let id = this.id;
            let follow =await axios({
            method:"post",
            url:"http://localhost:3000/api/follow_organisation_or_group",
            data:{
                id:id,
                token:token
            }
            })
            if(follow.data.success){
                this.followStatus = true
                this.numFollowers++;
            }
        },
       unFollow:async function(event){
            let token = this.token;
            let id = this.id;
            let unfollow =await axios({
            method:"post",
            url:"http://localhost:3000/api/unfollow_organisation_or_group",
            data:{
                id:id,
                token:token
            }
            })
            if(unfollow.data.success){
                this.followStatus = false
                this.numFollowers--;
            }
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
