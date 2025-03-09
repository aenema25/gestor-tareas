import { Button, TextField, Typography } from "@mui/material";
import { UserRoundCheck } from "lucide-react";
import { FC, useState } from "react";
import { userConfirmSignUpService } from "../../services/auth.api";
import NotificationAlert from "../NotificationAlert";
import { ConfirmSignupFormPropsInterface } from "../../types/props.types";
import { NotificationAlertSeverityType } from "../../types/misc.types";

const ConfirmSignUpForm: FC<ConfirmSignupFormPropsInterface> = ({ emailForConfirmation, setloginPageStep }) => {

    const [confirmationCode, setConfirmationCode] = useState("")

    const [openNotification, setOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationSeverity, setNotificationSeverity] = useState<NotificationAlertSeverityType>("success")
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Maneja la confirmación del codigo de verificacion para la creacion de la cuenta con AWS Cognito.  
     * 
     * @async
     * @function handleConfirmAccount
     * @returns {Promise<void>} No retorna un valor, pero actualiza el estado del componente.  
     * 
     * @description  
     * - Cambia `isSubmitting` a `true` para indicar que la acción está en curso.  
     * - Llama a `userConfirmSignUpService` con el correo electrónico y el código de confirmación.  
     * - Si la respuesta es un error, muestra una notificación con el mensaje de error.  
     * - Si la respuesta es exitosa, muestra un mensaje de éxito y cambia a la pantalla de inicio de sesión después de un segundo.  
     * - Finalmente, desactiva `isSubmitting`.  
     */

    const handleConfirmAccount = async (): Promise<void> => {
        setIsSubmitting(true)

        const response = await userConfirmSignUpService(emailForConfirmation, confirmationCode)

        if (response?.status === 'error') {
            setNotificationMessage(response.message)
            setNotificationSeverity(response.status)
            setOpenNotification(true)
        }

        if (response?.status === 'success') {

            setNotificationMessage(response.message)
            setOpenNotification(true)
            setTimeout(() => {
                setloginPageStep('logIn')
            }, 1000)
        }

        setIsSubmitting(false)

    }



    return (
        <div className="login-form-container">
            <div className="login-form-header">
                <Typography variant="h4" fontWeight={600}>
                    Confirmar cuenta
                </Typography>
                <Typography variant="body2" fontWeight={400}>
                    Se envio un codigo de confirmacion a su correo,
                </Typography>
                <Typography variant="body2" fontWeight={400}>
                    por favor ingreselo a continuacion para terminar su registro
                </Typography>
                <Typography variant="body2" fontWeight={400}>

                </Typography>
            </div>
            <div className="login-form-content">
                <TextField
                    size="small"
                    label='Codigo de confirmacion'
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <Button
                    color="primary"
                    variant="contained"
                    endIcon={<UserRoundCheck />}
                    loading={isSubmitting}
                    loadingPosition="end"
                    onClick={handleConfirmAccount}
                    fullWidth
                    disabled={!confirmationCode}
                >
                    <Typography textTransform={"capitalize"}>
                        Confirmar registro
                    </Typography>
                </Button>
            </div>
            {
                openNotification &&
                <NotificationAlert open={openNotification} setOpen={setOpenNotification} severity={notificationSeverity} message={notificationMessage} />
            }
        </div>
    )
}

export default ConfirmSignUpForm