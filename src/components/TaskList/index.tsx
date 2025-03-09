import { FC, useEffect, useState } from "react";
import TaskCard from "../TaskCard";
import "../../styles/tasklist.style.css"
import { getTasksByUserIdService } from "../../services/data.api";
import { CircularProgress, Typography } from "@mui/material";
import { TaskListPropsInterface } from "../../types/props.types";

const TaskList: FC<TaskListPropsInterface> = ({ taskList, setTaskList }) => {

    const [isLoading, setIsLoading] = useState(false)
    const getAllTaskByUserId = async () => await getTasksByUserIdService()

    useEffect(() => {
        setIsLoading(true)
        getAllTaskByUserId()
            .then((data) => {
                if (data && typeof (data) !== "string") {
                    setTaskList(data)
                }
                setIsLoading(false)
            })
            .catch(() => {
                setTaskList([])
                setIsLoading(false)
            })
    }, [])

    return (
        <div className="tasklist-container">
            {
                isLoading &&
                <div className="loading">
                    <Typography variant="h4" color="white">
                        Cargando ...
                    </Typography>
                    <CircularProgress color="primary" />
                </div>
            }
            {
                taskList.length > 0 ?
                    taskList.map((taskData, idx) =>
                        <TaskCard taskData={taskData} setTaskList={setTaskList} key={idx} />
                    )
                    :
                    <div>
                        <Typography variant="h6" color="white">
                            Aun no hay tareas agregadas
                        </Typography>
                    </div>
            }
        </div>
    )
}

export default TaskList