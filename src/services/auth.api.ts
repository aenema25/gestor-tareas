import { confirmSignUp, getCurrentUser, GetCurrentUserOutput, signIn, signUp } from "aws-amplify/auth"

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

const userLoginService = async (email: string, password: string) => {

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
        if((e as Error).message === "Incorrect username or password."){
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

const userSignUpService = async (email: string, password: string) => {

    if (!email || !password) {
        return {
            status: "error",
            message: "El campo correo y/o contraseña no puede estar vacio"
        }
    } else {
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
            }
        } catch (error) {
            console.error(error)
            return {
                status: "error",
                message: "Ocurrio un error en el registro, intenta nuevamente"
            }
        }

    }

}

const userConfirmSignUpService = async (email: string, confirmationCode: string) => {

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