const express = require("express");
const cors = require('cors')

const bodyParser = require("body-parser");
const errorHandler = require('./middleware/ErrorHandler')
const databaseConnect = require('./Database/DatabaseConnect');

// const taskAPI = require('./APIs/TaskAPI');
const userAPI = require('./APIs/UsersAPI');
const updatedTasksAPI = require('./APIs/TasksAPI')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
databaseConnect();

// app.use('/tasks',taskAPI);
app.use('/user',userAPI);
app.use('/tasks',updatedTasksAPI);

app.use(errorHandler);


const port = process.env.port || 5000

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})