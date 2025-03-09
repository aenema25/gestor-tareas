import { confirmSignUp, getCurrentUser, GetCurrentUserOutput, signIn, signUp } from "aws-amplify/auth"

/**
 * Obtiene la información del usuario actual.
 * 
 * @returns {Promise<GetCurrentUserOutput | null>} Un objeto con los datos del usuario o `null` si no se pudo obtener.
 * 
 * @throws {Error} Si la función `getCurrentUser` falla o no se puede obtener la información del usuario, se maneja el error
 * y se devuelve `null`.
 * 
 * @description
 *  * Este servicio realiza una llamada a la función `getCurrentUser` para obtener los datos del usuario.
 * Si los datos del usuario están disponibles, los devuelve; si no, devuelve `null`.
 * En caso de error, se captura la excepción y se devuelve `null` también.
 */

const getUserDataService = async (): Promise<GetCurrentUserOutput | null> => {
    try {

        const userData = await getCurrentUser()

        if (userData) {
            return userData
        } else {
            return null
        }
    } catch (e) {
        console.log(e)
        return null

    }
}

/**
 * Servicio de inicio de sesión para autenticar a un usuario con su correo electrónico y contraseña.
 
 * 
 * @param {string} email - El correo electrónico del usuario para iniciar sesión.
 * @param {string} password - La contraseña del usuario para iniciar sesión.
 * 
 * @returns {Promise<{ status: string, message: string }>} Un objeto que contiene el estado de la operación (`success` o `error`)
 * y un mensaje correspondiente al estado.
 * 
 * @throws {Error} Si ocurre algún error durante la ejecución de la función `signIn`, se captura y se maneja
 * adecuadamente, devolviendo un mensaje de error.
 * 
 * @description
 *  * Este servicio recibe un correo electrónico y una contraseña, y realiza el proceso de inicio de sesión utilizando
 * la función `signIn`. Si el inicio de sesión es exitoso, devuelve un mensaje de éxito. Si hay algún error, ya sea por
 * falta de campos, credenciales incorrectas, o cualquier otro problema, se devuelve un mensaje de error adecuado.
 * 
 */

const userLoginService = async (email: string, password: string): Promise<{ status: string; message: string }> => {

    if (!email) {
        return {
            status: "error",
            message: "Correo no puede estar vacio"
        }
    }

    if (!password)
        return {
            status: "error",
            message: "Contraseña no puede estar vacia"
        }

    try {
        const { nextStep } = await signIn({
            username: email,
            password: password,
        })

        if (nextStep.signInStep === 'DONE') {
            return {
                status: "success",
                message: "Inicio de sesion exitoso, en breve seras redirigido a la pagina principal"
            }
        } else {
            return {
                status: "error",
                message: "Ocurrio un error al iniciar sesion, verifica que tu correo y contraseña sean correctos"
            }
        }

    } catch (e) {
        if ((e as Error).message === "Incorrect username or password.") {
            return {
                status: "error",
                message: "Usuario o contraseña incorrecto, intenta nuevamente"
            }
        }
        return {
            status: "error",
            message: "Ocurrio un error al iniciar sesion. intenta nuevamente, consulta con el administrador del sitio si el problema persiste"
        }
    }
}

/**
 * Servicio de registro de usuario para crear una nueva cuenta con correo electrónico y contraseña.
 * 
 * @param {string} email - El correo electrónico del usuario para el registro.
 * @param {string} password - La contraseña del usuario para el registro.
 * 
 * @returns {Promise<{ status: string, message: string }>} Un objeto con el estado de la operación (`success` o `error`)
 * y un mensaje correspondiente al estado. Si el registro es exitoso y se requiere confirmación, el mensaje estará vacío.
 * 
 * @throws {Error} Si ocurre algún error durante el proceso de registro, se captura y se maneja, devolviendo un mensaje de error.
 * 
 * @description
 *  * Este servicio valida que los campos de correo electrónico y contraseña no estén vacíos. Luego, realiza una llamada
 * a la función `signUp` para registrar al usuario. Si el proceso de registro es exitoso, devuelve un mensaje indicando
 * que se necesita confirmar el registro. Si ocurre algún error, se captura y devuelve un mensaje adecuado de error.
 * 
 */

const userSignUpService = async (email: string, password: string): Promise<{ status: string; message: string }> => {

    if (!email || !password) {
        return {
            status: "error",
            message: "El campo correo y/o contraseña no puede estar vacio"
        }
    }

    try {
        const { nextStep } = await signUp({
            username: email,
            password: password,
        });
        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
            return {
                status: "success",
                message: ""
            }
        }else{
            return {
                status: "error",
                message: "Ocurrio un error al registrarse, intenta nuevamente"
            }
        }
    } catch (error) {
        console.error(error)
        return {
            status: "error",
            message: "Ocurrio un error en el registro, intenta nuevamente"
        }
    }



}

/**
 * Servicio de confirmación de registro de usuario, utilizado para completar el proceso de creación de cuenta.
 * 
 * @param {string} email - El correo electrónico del usuario que está confirmando su registro.
 * @param {string} confirmationCode - El código de confirmación enviado al correo del usuario.
 * 
 * @returns {Promise<{ status: string, message: string }>} Un objeto con el estado de la operación (`success` o `error`)
 * y un mensaje correspondiente al estado. Si la confirmación es exitosa, el mensaje indicará un registro exitoso.
 * 
 * @throws {Error} Si ocurre algún error durante el proceso de confirmación, se captura y se maneja, devolviendo un mensaje de error.
 * 
 * @description
 * 
 *  * Esta función permite al usuario confirmar su registro utilizando un código de confirmación que se envía por correo electrónico.
 * Primero valida que el código no esté vacío, luego realiza una llamada a la función `confirmSignUp` para confirmar la cuenta
 * del usuario. Si la confirmación es exitosa, se devuelve un mensaje de éxito; en caso contrario, se captura el error y se
 * devuelve un mensaje adecuado de error.
 * 
 */

const userConfirmSignUpService = async (email: string, confirmationCode: string): Promise<{ status: string; message: string }> => {

    if (!confirmationCode) {
        return {
            status: "error",
            message: "El codigo de confirmacion no debe estar vacio"
        }
    } else {
        try {
            const { nextStep } = await confirmSignUp({
                username: email,
                confirmationCode: confirmationCode
            });
            if (nextStep.signUpStep === "DONE") {
                return {
                    status: "success",
                    message: "Registro existoso !"
                }
            }else{
                return {
                    status: "error",
                    message: "Ocurrio un error al confirmar tu cuenta, intenta nuevamente"
                }
            }
        } catch (error) {
            console.error(error)
            return {
                status: "error",
                message: "Ocurrio un error al confirmar tu cuenta, intenta nuevamente"
            }
        }

    }

}

export {
    getUserDataService,
    userLoginService,
    userSignUpService,
    userConfirmSignUpService
}