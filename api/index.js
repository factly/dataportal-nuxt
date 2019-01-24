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
            url:'http://0.0.0.0:5000/api/3/action/organization_list?all_fields=true'
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
                url:'http://0.0.0.0:5000/api/3/action/organization_autocomplete?q='+req.query['filter']
            })
            var organisationNames = []
            filteredOrganisations.data.result.forEach((item)=>organisationNames.push(item.name))
            console.log(organisationNames)
            const organisations= await axios({
                method:'get',
                url:'http://0.0.0.0:5000/api/3/action/organization_list',
                data:{
                    all_fields:true,
                    organizations:organisationNames
                }
            })
            res.json(organisations.data)

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