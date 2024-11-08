const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config')
const rjwt = require("restify-jwt-community")
// const cors = require('cors');
const corsMiddleware = require('restify-cors-middleware')




const server = restify.createServer();
const cors = corsMiddleware({
    origins: ['http://localhost:8080'], // allow access from your React app
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization'],
    credentials: true
  });
  
  server.pre(cors.preflight);
  server.use(cors.actual);

//middleware
server.use(restify.plugins.bodyParser());

//protect routes
// server.use(rjwt({secret:config.JWT_SECRET}).unless({path: ['auth']})) 

server.listen(config.PORT, () =>{
    mongoose.connect(config.MONGODB_URI, 
    );
});


const db = mongoose.connection;

db.on('error',(err) => console.log(err)) //logs out error

db.once('open', () => {
    require('./routes/customers')(server);
    require('./routes/users')(server);
    require('./routes/post')(server);
    console.log(`Server started on port ${config.PORT}`)
})