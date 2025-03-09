import { IconButton, TextField } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Plus } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import "../../styles/addtask.style.css";
import { addNewTaskService } from "../../services/data.api";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import NotificationAlert from "../NotificationAlert";
import { AddTaskPropsInterface } from "../../types/props.types";

const AddTaskActions: FC<AddTaskPropsInterface> = ({ taskTitle, setTaskList, setTaskTitle }) => {

    const [dateTimestamp, setDateTimestamp] = useState(dayjs(new Date().toISOString()))

    const [openNotification, setOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationSeverity, setNotificationSeverity] = useState<"success" | "error">("success")
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Maneja la creación de una nueva tarea y la agrega en el listado (si es que se genera correctamente).
     * 
     * @async
     * @function handleAddNewTask
     * @returns {Promise<void>} No retorna un valor, pero actualiza el estado del componente.
     * 
     * @description 
     * - Cambia el estado `isSubmitting` a `true` para indicar que la acción está en curso.
     * - Llama a `addNewTaskService` con el título de la tarea y la fecha en formato JSON.
     * - Si la respuesta es un error, muestra una notificación con el mensaje de error.
     * - Si la respuesta es exitosa y hay datos, agrega la nueva tarea a la lista y muestra una notificación.
     * - Finalmente, restablece el estado del formulario y desactiva `isSubmitting`.
     */

    const handleAddNewTask = async (): Promise<void> => {
        setIsSubmitting(true)
        const response = await addNewTaskService(taskTitle, dateTimestamp.toJSON())

        if (response?.status === 'error') {
            setNotificationMessage(response.message ?? "Error inesperado")
            setNotificationSeverity(response.status)
            setOpenNotification(true)
        }

        if (response?.status === 'success' && response.data) {
            setTaskList((prev) => [...prev, response.data])
            setNotificationSeverity(response.status)
            setNotificationMessage(response.message)
            setOpenNotification(true)
        }
        setTaskTitle("")
        setIsSubmitting(false)
    }

    return (
        <div className="addtask-actions-container">
            <DateTimePicker
                value={dateTimestamp}
                onChange={(value) => setDateTimestamp(dayjs(value))}
                slotProps={{
                    textField: {
                        color: 'secondary',
                        variant: 'standard',
                        size: 'small',
                        sx: {
                            paddingRight: "10px",
                            minWidth: "205px"
                        }
                    }
                }}
            />
            <IconButton size="small" onClick={handleAddNewTask} disabled={isSubmitting} loading={isSubmitting}>
                {
                    !isSubmitting &&
                    <Plus stroke={deepPurple[300]} />
                }
            </IconButton>
            {
                openNotification &&
                <NotificationAlert open={openNotification} setOpen={setOpenNotification} severity={notificationSeverity} message={notificationMessage} />
            }
        </div>
    )
}

const AddTask: FC<{
    taskList: {
        userId: string;
        title: string;
        completed: boolean;
        createdAt: string;
        readonly id: string;
        readonly updatedAt: string;
    }[],
    setTaskList: Dispatch<SetStateAction<{
        userId: string;
        title: string;
        completed: boolean;
        createdAt: string;
        readonly id: string;
        readonly updatedAt: string;
    }[]>>
}> = ({ taskList, setTaskList }) => {

    const [taskTitle, setTaskTitle] = useState("")

    return (
        <div>
            <TextField
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="¿Que tarea hay para hoy?"
                helperText="Recuerda seleccionar la fecha y hora de tu tarea usando el icono del calendario"
                color="secondary"
                fullWidth
                size="small"
                type="text"
                variant="outlined"
                slotProps={{
                    input: {
                        sx: {
                            backgroundColor: 'white',
                            borderRadius: "16px",
                            padding: '4px'
                        },
                        endAdornment: <AddTaskActions taskTitle={taskTitle} setTaskTitle={setTaskTitle} setTaskList={setTaskList} taskList={taskList} />
                    },
                    formHelperText: {
                        sx: {
                            color: "white"
                        }
                    }
                }}

            />
        </div>
    )
}

export default AddTask