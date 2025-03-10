import { Typography } from "@mui/material";
import { FC, useState } from "react";
import "../styles/home.page.styles.css"
import { AddTask, TaskList } from "../components";

const Home: FC = () => {

    const [taskList, setTaskList] = useState<{
        userId: string;
        title: string;
        completed: boolean;
        createdAt: string;
        readonly id: string;
        readonly updatedAt: string;
    }[]>([])

    return (
        <div className="home-container">
            <div>
                <Typography variant="h5" fontWeight={300}>
                    Hoy es un gran día para:
                </Typography>
            </div>
            <div>
                <AddTask taskList={taskList} setTaskList={setTaskList} />
            </div>
            <div>
                <TaskList taskList={taskList} setTaskList={setTaskList} />
            </div>
        </div>
    )
}

export default Home