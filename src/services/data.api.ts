import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { getUserDataService } from './auth.api';

const client = generateClient<Schema>()

const addNewTaskService = async (title: string, customTimestamp?: string) => {

    const currentUserData = await getUserDataService()
    const timestamp = customTimestamp ? customTimestamp : new Date().toISOString();

    if (title.length === 0) {
        return {
            status: 'error',
            data: null,
            message: 'La tarea debe tener una descripcion'
        }
    }

    if (!currentUserData) {
        return {
            status: 'error',
            data: null,
            Message: "Id usuario no encontrado"
        }
    }

    const { userId } = currentUserData
    try {
        const { data, errors } = await client.models.Taks.create({
            title: title,
            userId: userId,
            completed: false,
            createdAt: timestamp
        })

        if (errors) {
            console.error(errors)
            return {
                status: 'error',
                data: null,
                message: 'Ocurrio un error al agregar la tarea, intenta nuevamente'
            }
        }

        if (data) {
            return {
                status: 'success',
                data: data,
                message: 'Tarea agregada exitosamente'
            }
        }

    } catch (e) {
        console.log(e)
        return {
            status: 'error',
            data: null,
            message: 'Ocurrio un error al intentar agregar la tarea, si el error persiste favor contactar con el administrador del sitio'
        }
    }

}

const getTasksByUserIdService = async () => {
    const currentUserData = await getUserDataService()

    if (currentUserData) {
        const { userId } = currentUserData

        try {
            const { data, errors } = await client.models.Taks.list({
                filter: {
                    userId: {
                        eq: userId
                    }
                }
            });

            if (errors) {
                console.error(errors)
                return null
            }

            if (data) {
                return data
            }
        } catch (e) {
            console.log(e)
            return null
        }

    } else {
        return "Id usuario no encontrado"
    }
}

const deleteTaskByIdService = async (taskId: string) => {

    if (!taskId) {
        return {
            status: 'error',
            data: null,
            message: 'El ID de la tarea es obligatorio'
        }
    }

    try {
        const { data, errors } = await client.models.Taks.delete({ id: taskId })

        if (errors) {
            console.error(errors)
            return {
                status: 'error',
                data: null,
                message: 'Ocurrio un error al eliminar la tarea, intenta nuevamente'
            }
        }

        if (data) {
            return {
                status: 'success',
                data: data,
                message: 'Tarea eliminada exitosamente'
            }
        }

    } catch (e) {
        console.log(e)
        return {
            status: 'error',
            data: null,
            message: 'Ocurrio un error al intentar eliminar la tarea, si el error persiste favor contactar con el administrador del sitio'
        }
    }


}

const changeCompletedStatusByIdService = async (taskId: string, completedStatus: boolean) => {

    if (!taskId) {
        return {
            status: 'error',
            data: null,
            message: 'El ID de la tarea es obligatorio'
        }
    }


    try {
        const { data, errors } = await client.models.Taks.update({
            id: taskId,
            completed: completedStatus
        })

        if (errors) {
            console.error(errors)
            return {
                status: 'error',
                data: null,
                message: 'Ocurrio un error al cambiar el estado de la tarea, intenta nuevamente'
            }
        }

        if (data) {
            return {
                status: 'success',
                data: data,
                message: 'Estado cambiado exitosamente'
            }
        }

    } catch (e) {
        console.log(e)
        return {
            status: 'error',
            data: null,
            message: 'Ocurrio un error al intentar cambiar el estado de la tarea, si el error persiste favor contactar con el administrador del sitio'
        }
    }


}

export {
    addNewTaskService,
    getTasksByUserIdService,
    deleteTaskByIdService,
    changeCompletedStatusByIdService
}