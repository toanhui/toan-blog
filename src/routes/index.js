const newsRoutes = require('./news');
const siteRoutes = require('./site');

 
 function route(app) {
    
    app.use('/login',siteRoutes)
    app.use('/news',newsRoutes)
    app.use('/',siteRoutes)
      
 }

 module.exports = route;