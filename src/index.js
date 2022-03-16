const express=require('express');
const testRoute = require('./routes/test');


const PORT= process.env.PORT || 3000
const app=express()

app.use(express.json())
app.use(testRoute)


app.listen(PORT ,()=>
{
    console.log(`listening on Port ${PORT}`)
})
