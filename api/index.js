const express = require('express')
const app = express()
const bodyParser = require('body-parser');
// const baseUrl ="http://0.0.0.0:5000"
const baseUrl = "http://demo.ckan.org"
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/organisations', async (req, res, next) => {
    const axios = require('axios')
    if(!req.query.filter){
        try
        {
            const organisations= await axios({
            method:'get',
            url:baseUrl+'/api/3/action/organization_list?all_fields=true'
        })
        console.log(organisations.data.result)
        res.json(organisations.data.result)

        }catch(err){
            console.log(err);
            res.json({error:err})
        }
    }
    else{
        console.log(req.query)
        try{
            const filteredOrganisations = await axios({
                method:'get',
                url:baseUrl+'/api/3/action/organization_autocomplete?q='+req.query['filter']
            })
            var organisationNames = []
            filteredOrganisations.data.result.forEach((item)=>organisationNames.push(item.name))
            console.log(organisationNames)
            if(organisationNames.length>0){
                const organisations= await axios({
                    method:'get',
                    url:baseUrl+'/api/3/action/organization_list',
                    data:{
                        all_fields:true,
                        organizations:organisationNames
                    }
                })
                res.json(organisations.data.result)
            }

            else{
                res.json([])
            }
            

        }catch(err){
            console.log(err);
            res.json({error:err})
        }
        
    }
    

})

app.get('/groups', async (req, res, next) => {
    const axios = require('axios')
    if(!req.query.filter){
        try
        {
            const groups= await axios({
            method:'get',
            url:baseUrl+'/api/3/action/group_list?all_fields=true'
        })
        res.json(groups.data.result)

        }catch(err){
            console.log(err);
            res.json({error:err})
        }
    }
    else{
        console.log(req.query)
        try{
            const filteredGroups = await axios({
                method:'get',
                url:baseUrl+'/api/3/action/group_autocomplete?q='+req.query['filter']
            })
            var groupNames = []
            console.log(groupNames)
            filteredGroups.data.result.forEach((item)=>groupNames.push(item.name))
            console.log(filteredGroups)
            console.log("groupNames",groupNames)
            if(groupNames.length>0){
                const groups= await axios({
                    method:'get',
                    url:baseUrl+'/api/3/action/group_list',
                    data:{
                        all_fields:true,
                        groups:groupNames
                    }
                })
                console.log(groups)
                res.json(groups.data.result)
            }
            else{
                res.json([])
            }
            

        }catch(err){
            console.log(err);
            res.json({error:err})
        }
        
    }
    

})

app.get('/datasets',async (req,res,next)=>{
    const axios = require('axios')
    if(!req.query.search && !req.query.filter){
        try
        {
            const packages= await axios({
            method:'get',
            url:baseUrl+'/api/3/action/current_package_list_with_resources?limit=10'
        })
        res.json(packages.data.result)

        }catch(err){
            console.log(err);
            res.json({error:err})
        }
    }
    else{
        console.log(req.query)
        let searchUrl,filterUrl;
        let url = baseUrl+"/api/3/action/package_search"
        if(req.query.search){
            searchUrl="q="+req.query["search"]
        }
        if(req.query.filter){
            filterUrl="fq="+req.query["filter"]
        }
        if(searchUrl && filterUrl)
            url+="?"+searchUrl+"&"+filterUrl;
        else if(searchUrl)
            url+="?"+searchUrl;
        else if(filterUrl)
            url+="?"+filterUrl;
        url+="&limit=10"
        try{
            const filteredPackages = await axios({
                method:'get',
                url:url
            })
            var packageNames = []
            console.log(filteredPackages)
            res.json(filteredPackages.data.result)
            //console.log(packageNames)
            //filteredPackages.data.result.forEach((item)=>packageNames.push(item.name))
            // console.log(filteredPackages)
            // console.log("packageNames",packageNames)
            // if(packageNames.length>0){
            //     const packages= await axios({
            //         method:'get',
            //         url:baseUrl+'/api/3/action/package_list',
            //         data:{
            //             all_fields:true,
            //             packages:packageNames
            //         }
            //     })
            //     console.log(packages)
            //     res.json(packages.data.result)
            // }
            // else{
            //     res.json([])
            // }
            

        }catch(err){
            console.log(err);
            res.json({error:err})
        }
        
    }
})

app.get('/organisations/:id',async (req,res,next) =>{
    console.log(req.params.id);
    const axios = require('axios')

    const organisation = await axios({
        method:'get',
        url:baseUrl+'/api/3/action/organization_show?id='+req.params.id+"&include_datasets=true"
    })
    console.log(organisation.data.result.packages.filter((item)=>{
        return !item.private
    }))
    res.send(organisation.data);
})

app.get('/groups/:id',async (req,res,next) =>{
    console.log(req.params.id);
    const axios = require('axios')

    const group = await axios({
        method:'get',
        url:baseUrl+'/api/3/action/group_show?id='+req.params.id+"&include_datasets=true"
    })
    console.log(group.data.result.packages.filter((item)=>{
        return !item.private
    }))
    res.send(group.data);
})

app.post('/user/signUp',async (req,res,next) =>{
    const axios = require('axios')
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var fullname=req.body.fullname;
    var about=req.body.about;
    console.log(name,email,password,fullname,about);
    try{
        const createUser = await axios({
            method:'post',
            url:baseUrl+'/api/3/action/user_create',
            data:{
                'name':name,
                'email':email,
                'password':password,
                'fullname':fullname,
                'about':about,
            },
            headers:{
                'Authorization':'5c0aff68-9358-4ae3-b842-5d35e1a3a09c'
            }
        })
        res.end(JSON.stringify(createUser.data))
    }catch(err){
        console.log(err);
        res.json({"error":err})
    }
})

app.post('/user/login',async(req,res,next)=>{
    const axios=require("axios");
    const passwordHash = require('password-hash');
    const spawn = require("child_process").spawn;
    var userId=req.body.userId;
    var password=req.body.password
    try{
        const  getUser  = await axios({
            method:'get',
            url:baseUrl+'/api/3/action/user_show',
            data:{
                "id":userId,
                "include_password_hash":true
            },
            headers:{
                'Authorization':'5c0aff68-9358-4ae3-b842-5d35e1a3a09c'
            }
        })
        const pythonProcess = spawn('python',["./verifyHash.py",password,getUser.data.result.password_hash]);
        pythonProcess.stdout.on('data', (data) => {
            if(data.toString()){
                let user = {};
                user["auth_token"] = getUser.data.result.apikey;
                user["user_id"] = getUser.data.result.name;
                user["full_name"] = getUser.data.result.fullname;
                user["email"] = getUser.data.result.email;
                user["packages_created"] = getUser.data.result.number_created_packages;
                user["sysadmin"] = getUser.data.result.sysadmin;
                let response = {
                    "success":true,
                    "result":user
                }
	            res.end(JSON.stringify(response));
            }
            else{
                res.end({"success":"false","error":"Invalid Credentials"});
            }
        });
        pythonProcess.stderr.on('data',(data)=>{
            console.log(data.toString())
            res.end({"success":"false","error":"Unknown"})
        }) 
    }catch(err){
        console.log(err)
        res.end(JSON.stringify({"success":"false","error":"Unknown"}))
    }
})


app.post('/activities/html/organisation',async (req,res,next) => {
    const axios = require('axios')
    let id = req.body.id;
    console.log(id)
    try{
        const activityHtml = await axios({
            method:'get',
            url:baseUrl+'/api/3/action/organization_activity_list_html?id='+id,

        })
        console.log(activityHtml.data.result)
        res.end(JSON.stringify(activityHtml.data))
    }
    catch(err){
        console.log("error",err)

        res.end(JSON.stringify(err.config))
    }
    //console.log(activityHtml.data.error)
    
})

app.post('/activities/html/group',async (req,res,next) => {
    const axios = require('axios')
    let id = req.body.id;
    console.log(id)
    try{
        const activityHtml = await axios({
            method:'get',
            url:baseUrl+'/api/3/action/group_activity_list_html?id='+id,

        })
        console.log(activityHtml.data.result)
        res.end(JSON.stringify(activityHtml.data))
    }
    catch(err){
        console.log("error",err)

        res.end(JSON.stringify(err.config))
    }
    //console.log(activityHtml.data.error)
    
})

app.post('/follow_status',async (req,res,next)=>{
    //console.log("passing")
    const axios = require('axios')
    let token = req.body.token;
    let id = req.body.id;
    //console.log("id",req)
    try{
        const follow_status = await axios({
            method:'get',
            url:baseUrl+'/api/3/action/am_following_group',
            data:{
                id:id
            },
            headers:{
                Authorization:token
            }
        })
        //console.log("follow_status",follow_status)
        res.end(JSON.stringify(follow_status.data));
    }
    catch(err){
        //console.log(err)
        res.end(JSON.stringify({"success":"false","error":"Unknown"}))
    }
        
})


app.post('/follow_organisation_or_group',async(req,res,next)=>{
    const axios = require('axios')
    let token = req.body.token;
    let id = req.body.id;
    console.log(id,token)
    try{
        const follow = await axios({
            method:'post',
            url:baseUrl+'/api/3/action/follow_group',
            data:{
                id:id
            },
            headers:{
                Authorization:token
            }
        })
        console.log("follow",follow)
        res.end(JSON.stringify(follow.data));
    }
    catch(err){
        console.log(err)
        res.end(JSON.stringify({"success":"false","error":"Unknown"}))
    }
})

app.post('/unfollow_organisation_or_group',async(req,res,next)=>{
    const axios = require('axios')
    let token = req.body.token;
    let id = req.body.id;
    console.log(id,token)
    try{
        const unfollow = await axios({
            method:'post',
            url:baseUrl+'/api/3/action/unfollow_group',
            data:{
                id:id
            },
            headers:{
                Authorization:token
            }
        })
        console.log("unfollow",unfollow)
        res.end(JSON.stringify(unfollow.data));
    }
    catch(err){
        console.log(err)
        res.end(JSON.stringify({"success":"false","error":"Unknown"}))
    }
})
// export the server middleware
module.exports = {
  path: '/api',
  handler: app
}