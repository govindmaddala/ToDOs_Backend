const Task = require('../Database/TasksSchema');
const CatchAsyncErrors = require('../utils/CatchAsyncErrors');
const ErrorHandle = require('../utils/ErrorHandle');
const User = require('../Database/UserSchema');

const createNewTask = CatchAsyncErrors(async (req, res, next) => {
    const { userID, taskDate: payloadTaskDate, taskHeading, taskDetails } = req.body;
    var userPresent = await User.findById(userID);
    if (userPresent) {
        var userTasksPresent = await Task.find({ userID: userID });
        if (userTasksPresent.length === 0) {
            const userTaskForFirstTime = {
                userID: userID,
                usersAllTasks: [
                    {
                        taskDate: payloadTaskDate,
                        tasks: [
                            {
                                taskHeading,
                                taskDetails
                            }
                        ]
                    }
                ]
            }
            // console.log(userTaskForFirstTime);
            var createdTask = await Task.create(userTaskForFirstTime)
            // console.log(createdTask.usersAllTasks);
            return res.status(200).json({
                success: true,
                message: createdTask.usersAllTasks[0]
            })
        } else if (userTasksPresent.length !== 0) {
            const { _id, usersAllTasks } = userTasksPresent[0];
            var tasksToBeModified = usersAllTasks.filter((eachDatedTasks) => {
                const { taskDate, tasks } = eachDatedTasks;
                if (taskDate === payloadTaskDate) {
                    return tasks;
                }
            });
            if (tasksToBeModified.length !== 0) {
                const [{ tasks }] = tasksToBeModified;
                tasks.unshift(
                    {
                        taskHeading,
                        taskDetails
                    }
                );
            } else {
                const newDatedTask = {
                    taskDate: payloadTaskDate,
                    tasks: [
                        {
                            taskHeading,
                            taskDetails
                        }
                    ]
                };
                usersAllTasks.push(newDatedTask);
            }
            await Task.findByIdAndUpdate(_id, { usersAllTasks }, { new: true, runValidators: true, useFindAndModify: false })
            var allTasksAfterUpdate = await Task.findById(_id);
            const allTasksAfterUpdateFinish = allTasksAfterUpdate.usersAllTasks;
            var datedTasksAfterFinishAdd = allTasksAfterUpdateFinish.filter((eachDateTasks) => {
                let { taskDate, tasks } = eachDateTasks;
                if (taskDate === payloadTaskDate) {
                    return tasks;
                }
            });
            var [finalTasks] = datedTasksAfterFinishAdd;
            return res.status(200).json({
                success: true,
                message: finalTasks
            })
        }
    } else {
        return next(new ErrorHandle("User not found", 404));
    }

});

const getTodayAllTasks = CatchAsyncErrors(async (req, res, next) => {
    const { userID } = req.body;
    var userPresent = await User.findById(userID);
    if (userPresent) {
        var userTasksPresent = await Task.find({ userID: userID });
        if (userTasksPresent.length !== 0) {
            let { usersAllTasks } = userTasksPresent[0];
            var todayTasks = usersAllTasks.filter((eachDateTasks) => {
                let { taskDate, tasks } = eachDateTasks;
                if (taskDate === new Date().toLocaleDateString().toString()) {
                    return tasks;
                }
            })
            return res.status(200).json({
                success: true,
                message: todayTasks
            })
        } else {
            return res.status(200).json({
                success: true,
                message: []
            })
        }
    } else {
        return next(new ErrorHandle("User not found", 404));
    }
})

const getAllTasksByDate = CatchAsyncErrors(async (req, res, next) => {
    const { userID } = req.body;
    var userPresent = await User.findById(userID);
    if (userPresent) {
        var userTasksPresent = await Task.find({ userID: userID });
        if (userTasksPresent.length !== 0) {
            let { usersAllTasks } = userTasksPresent[0];
            var datedTasks = usersAllTasks.filter((eachDateTasks) => {
                let { taskDate, tasks } = eachDateTasks;
                if (taskDate === req.query.date) {
                    return tasks;
                }
            })
            return res.status(200).json({
                success: true,
                message: datedTasks
            })
        } else {
            return res.status(200).json({
                success: true,
                message: []
            })
        }
    } else {
        return next(new ErrorHandle("User not found", 404));
    }

})

const updateTaskStatusByID = CatchAsyncErrors(async (req, res, next) => {
    var taskID = req.params.id;
    const { userID } = req.body;
    var userTasksPresent = await Task.find({ userID: userID });
    if (userTasksPresent.length !== 0) {
        let { usersAllTasks } = userTasksPresent[0];
        var datedTasks = usersAllTasks.map((eachDateTasks) => {
            let { taskDate, tasks } = eachDateTasks;
            let [{ _id, status, taskDetails, taskHeading }] = tasks;
            if (taskDate === req.query.date) {
                return tasks;
            } else {
                return eachDateTasks;
            }
        })
        return res.status(200).json({
            success: true,
            message: datedTasks
        })
    } else {
        return next(new ErrorHandle("User not found", 404));
    }

    // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false
    // });
    // res.status(200).json({
    //     msg: updatedTask
    // });
});

const deleteTask = CatchAsyncErrors(async (req, res, next) => {
    var taskID = req.params.id;
    var userID = req.params.userID;
    var userPresent = await User.findById(userID);
    if (userPresent) {
        var userTasksPresent = await Task.find({ userID: userID });
        if (userTasksPresent.length !== 0) {
            var taskDeletedDate;
            var { _id, usersAllTasks } = userTasksPresent[0];
            for (let eachDate of usersAllTasks) {
                var { taskDate, tasks } = eachDate;
                var tasksAfterDeletion = tasks.filter((eachTask) => {
                    if (eachTask._id.toString() === taskID) {
                        taskDeletedDate = taskDate;
                    }
                    return eachTask._id.toString() !== taskID;
                });
                if (tasksAfterDeletion.length !== tasks.length) {
                    eachDate.tasks = tasksAfterDeletion;
                    break;
                }
            }
            await Task.findByIdAndUpdate(_id, { usersAllTasks }, { new: true, runValidators: true, useFindAndModify: false });
            var { usersAllTasks } = await Task.findById(_id);
            var finalTasksAfterDeletion = usersAllTasks.filter((eachDate) => {
                const { taskDate: currentTaskDate } = eachDate;
                return taskDate === currentTaskDate;
            });
            res.status(200).json({
                message: finalTasksAfterDeletion,
                success: true
            })
        }
    } else {
        return next(new ErrorHandle("User not found", 404));
    }

})

module.exports = { createNewTask, getTodayAllTasks, getAllTasksByDate, updateTaskStatusByID, deleteTask }