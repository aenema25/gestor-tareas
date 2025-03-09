import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { getUserDataService } from './auth.api';

const client = generateClient<Schema>()

/**
 * Servicio para agregar una nueva tarea al sistema.
 * 
 * @param {string} title - El título o descripción de la nueva tarea.
 * @param {string} [customTimestamp] - El timestamp personalizado para la tarea, en formato ISO 8601. Si no se proporciona,
 *                                      se utilizará la fecha y hora actual.
 * 
 * @returns {Promise<{ status: string, data: any, message: string }>} Un objeto con el estado de la operación (`success` o `error`),
 * y un mensaje indicando el resultado de la operación. Si la tarea se crea con éxito, el objeto de tarea se incluye en `data`.
 * Si ocurre un error, se devuelve un mensaje adecuado.
 * 
 * @throws {Error} Si ocurre algún error al intentar agregar la tarea, el error se captura y se maneja, devolviendo un mensaje de error.
 * 
 * @description
 *  * Esta función permite agregar una nueva tarea, asociada al usuario actual, con un título y un timestamp de creación. Si no se
 * proporciona un `customTimestamp`, se utiliza la fecha y hora actuales como el timestamp. Si el título de la tarea está vacío,
 * o si el usuario no está autenticado, se retornará un error. La tarea se crea a través de una llamada a un modelo en el cliente
 * de la base de datos (client.models.Task.create).
 * 
 */

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

/**
 * Servicio para obtener las tareas asociadas al usuario actual.
 * 
 * @returns {Promise<any[] | string | null>} Un array con las tareas del usuario si la consulta es exitosa, un mensaje de error si el usuario no está autenticado,
 *         o `null` si ocurrió un error durante la consulta a la base de datos.
 * 
 * @description
 * 
 *  * Esta función obtiene las tareas de un usuario específico a partir de su `userId`. Primero, obtiene los datos del usuario actual
 * a través de la función `getUserDataService`. Si el usuario está autenticado, realiza una consulta a la base de datos utilizando
 * el `userId` para obtener las tareas asociadas a ese usuario. Si ocurre un error durante la consulta o si el usuario no está autenticado,
 * se maneja y devuelve el resultado apropiado.
 * 
 */

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

/**
 * Servicio para eliminar una tarea por su ID.
 * 
 * @param {string} taskId - El ID de la tarea a eliminar.
 * @returns {Promise<Object>} Un objeto con el estado de la operación. Puede ser un objeto de éxito con los datos de la tarea eliminada,
 *         o un objeto de error con el mensaje de error correspondiente.
 * 
 * @description
 * 
 *  * Esta función elimina una tarea específica mediante su `taskId`. Se verifica si el `taskId` es válido antes de realizar la consulta a la base de datos
 * para eliminar la tarea correspondiente. Si ocurre un error durante el proceso de eliminación, se maneja y se devuelve el mensaje adecuado.
 * 
 */

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

/**
 * Servicio para cambiar el estado de completado de una tarea por su ID.
 * 
 * @param {string} taskId - El ID de la tarea cuyo estado de completado se desea actualizar.
 * @param {boolean} completedStatus - El nuevo estado de completado de la tarea (true o false).
 * @returns {Promise<Object>} Un objeto que contiene el estado de la operación. Puede ser un objeto de éxito con los datos actualizados de la tarea,
 *         o un objeto de error con el mensaje de error correspondiente.
 * 
 * @description
 * 
 *  * Esta función permite actualizar el estado de completado (`completed`) de una tarea específica identificada por su `taskId`.
 * Si el `taskId` no se proporciona o si hay algún error durante la actualización, se manejan adecuadamente los errores y se devuelve un mensaje informativo.
 * 
 */


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