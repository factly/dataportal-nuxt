const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const baseUrl ="http://0.0.0.0:5000"
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
                url:'http://0.0.0.0:5000/api/3/action/group_autocomplete?q='+req.query['filter']
            })
            var groupNames = []
            console.log(groupNames)
            filteredGroups.data.result.forEach((item)=>groupNames.push(item.name))
            console.log(filteredGroups)
            console.log("groupNames",groupNames)
            if(groupNames.length>0){
                const groups= await axios({
                    method:'get',
                    url:'http://0.0.0.0:5000/api/3/action/group_list',
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
    res.send(organisation.data.result);
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
            url:'http://0.0.0.0:5000/api/3/action/user_create',
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
            url:'http://0.0.0.0:5000/api/3/action/user_show',
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

// export the server middleware
module.exports = {
  path: '/api',
  handler: app
}