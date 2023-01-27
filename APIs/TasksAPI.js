const express = require('express');
const { createNewTask, getTodayAllTasks, getAllTasksByDate, updateTaskStatusByID, deleteTask } = require('../Controllers/TasksController');
const router = express.Router();
router.route('/new').post(createNewTask);
router.route('/today').post(getTodayAllTasks);
router.route('/').post(getAllTasksByDate);
// router.route('/:id').put('/update',updateTaskStatusByID);
router.route('/:id/update').put(updateTaskStatusByID);
router.route('/:userID/delete/:id').delete(deleteTask);

module.exports = router;