const express = require('express')
const app = express()
const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.get('/organisations', async (req, res, next) => {
    const axios = require('axios')
    if(!req.query.filter){
        try
        {
            const organisations= await axios({
            method:'get',
            url:'http://demo.ckan.org/api/3/action/organization_list?all_fields=true&limit=10'
        })
        res.json(organisations.data)

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
                url:'http://demo.ckan.org/api/3/action/organization_autocomplete?q='+req.query['filter']
            })
            var organisationNames = []
            filteredOrganisations.data.result.forEach((item)=>organisationNames.push(item.name))
            console.log(organisationNames)
            if(organisationNames.length>0){
                const organisations= await axios({
                    method:'get',
                    url:'http://demo.ckan.org/api/3/action/organization_list?limit=10',
                    data:{
                        all_fields:true,
                        organizations:organisationNames
                    }
                })
                res.json(organisations.data)
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
            url:'http://demo.ckan.org/api/3/action/group_list?all_fields=true&limit=10'
        })
        res.json(groups.data)

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
                url:'http://demo.ckan.org/api/3/action/group_autocomplete?q='+req.query['filter']
            })
            var groupNames = []
            console.log(groupNames)
            filteredGroups.data.result.forEach((item)=>groupNames.push(item.name))
            console.log(filteredGroups)
            console.log("groupNames",groupNames)
            if(groupNames.length>0){
                const groups= await axios({
                    method:'get',
                    url:'http://demo.ckan.org/api/3/action/group_list?limit=10',
                    data:{
                        all_fields:true,
                        groups:groupNames
                    }
                })
                console.log(groups)
                res.json(groups.data)
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
// export the server middleware
module.exports = {
  path: '/api',
  handler: app
}