import { FC, useState } from "react";
import "../../styles/taskcard.style.css"
import { Circle, CircleCheck, Trash } from "lucide-react";
import { ButtonGroup, Divider, IconButton, Typography } from "@mui/material";
import { deepPurple, green, grey, red } from "@mui/material/colors";
import { changeCompletedStatusByIdService, deleteTaskByIdService } from "../../services/data.api";
import NotificationAlert from "../NotificationAlert";
import { TaskCardPropsInterface } from "../../types/props.types";
import { NotificationAlertSeverityType } from "../../types/misc.types";

const TaskCard: FC<TaskCardPropsInterface> = ({ taskData, setTaskList }) => {

    const [openNotification, setOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationSeverity, setNotificationSeverity] = useState<NotificationAlertSeverityType>("success")
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
    const [isSubmittingCompletedChange, setIsSubmittingCompletedChange] = useState(false);

    const { id, createdAt, title, completed } = taskData

    /**
     * Maneja la eliminación de una tarea.
     *
     * @async
     * @function handleDeleteTask
     * @returns {Promise<void>} - No retorna ningún valor explícito.
     * 
     * @description
     * * - Llama al servicio `deleteTaskByIdService` para eliminar una tarea específica.
     * - Muestra una notificación en caso de éxito o error.
     * - Si la eliminación es exitosa, actualiza la lista de tareas eliminando la tarea correspondiente.
     */

    const handleDeleteTask = async (): Promise<void> => {
        setIsSubmittingDelete(true)
        const response = await deleteTaskByIdService(id)

        if (response?.status === 'error') {
            setNotificationMessage(response.message ?? "Error inesperado")
            setNotificationSeverity(response.status)
            setOpenNotification(true)
        }

        if (response?.status === 'success' && response.data) {
            setNotificationSeverity(response.status)
            setNotificationMessage(response.message)
            setOpenNotification(true)
            setTaskList((prev) => {
                const filteredTaskList = prev.filter((task) => task.id !== response.data.id)
                return filteredTaskList
            })
        }
        setIsSubmittingDelete(false)
    }

    /**
     * Cambia el estado de completado de una tarea específica.
     *
     * @async
     * @function handleChangeToCompleteTask
     * @returns {Promise<void>} - No retorna ningún valor explícito.
     * 
     * @description
     * * - Llama al servicio `changeCompletedStatusByIdService` para actualizar el estado de la tarea.
     * - Muestra una notificación en caso de éxito o error.
     * - Si la actualización es exitosa, reemplaza la tarea en la lista con la versión actualizada.
     */

    const handleChangeToCompleteTask = async (): Promise<void> => {
        setIsSubmittingCompletedChange(true)
        const response = await changeCompletedStatusByIdService(id, !completed)

        if (response?.status === 'error') {
            setNotificationMessage(response.message ?? "Error inesperado")
            setNotificationSeverity(response.status)
            setOpenNotification(true)
        }

        if (response?.status === 'success' && response.data) {
            setNotificationSeverity(response.status)
            setNotificationMessage(response.message)
            setOpenNotification(true)
            setTaskList((prev) => {
                const filteredTaskList = prev.filter((task) => task.id !== response.data.id)
                return [...filteredTaskList, response.data]
            })
            
        }
        setIsSubmittingCompletedChange(false)
    }


    return (
        <div className="taskcard-container" key={id}>
            <Circle stroke={completed ? green[500] : red[500]} fill={completed ? green[500] : red[500]} width={16} />
            <Typography sx={{ color: grey[700] }} fontWeight={500}>
                {title}
            </Typography>
            <Typography sx={{ color: grey[700], marginLeft: 'auto', paddingRight: '16px' }} fontWeight={500}>
                {new Date(createdAt).toLocaleString()}
            </Typography>
            <ButtonGroup size="small" sx={{ gap: '4px' }}>
                <IconButton onClick={handleChangeToCompleteTask} loading={isSubmittingCompletedChange} disabled={isSubmittingCompletedChange}>
                    {
                        completed ?
                            <CircleCheck color={deepPurple[300]} />
                            :
                            <Circle stroke={grey[400]} />
                    }

                </IconButton>
                <Divider orientation="vertical" sx={{ bgcolor: grey[400] }} variant="middle" flexItem />
                <IconButton onClick={handleDeleteTask} loading={isSubmittingDelete} disabled={isSubmittingDelete}>
                    <Trash color={red[500]} />
                </IconButton>
            </ButtonGroup>
            {
                openNotification &&
                <NotificationAlert open={openNotification} setOpen={setOpenNotification} severity={notificationSeverity} message={notificationMessage} />
            }
        </div>
    )
}

export default TaskCard