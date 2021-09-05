const mongoose = require('mongoose');

//conexion a mongoDB
mongoose.connect(process.env.MONGO_DB_URI_TEST ,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
       console.error(err);
    })
