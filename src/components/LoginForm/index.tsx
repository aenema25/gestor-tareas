import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import { FC, useState } from "react";
import { userLoginService } from "../../services/auth.api";
import { useNavigate } from "react-router";
import NotificationAlert from "../NotificationAlert";
import { NotificationAlertSeverityType } from "../../types/misc.types";



const LoginForm: FC = () => {

    const [showPassword, setShowPassword] = useState(false)

    const [openNotification, setOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationSeverity, setNotificationSeverity] = useState<NotificationAlertSeverityType>("success")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * Realiza la autenticación del usuario y muestra notificaciones según el resultado.
     *
     * @async
     * @function handleLoginSubmit
     * @returns {Promise<void>} No retorna ningún valor directamente.
     * 
     * @description 
     * - Cambia el estado `isSubmitting` a `true` para indicar que la acción está en curso.
     * - Llama a `userLoginService` con email y password.
     * - Si la respuesta es un error, muestra una notificación con el mensaje de error.
     * - Si la respuesta es exitosa, se muestra la notificacion y se redirige a pagina `home`.
     * - Finalmente, desactiva `isSubmitting`.
     */

    const handleLoginSubmit = async (): Promise<void> => {
        setIsSubmitting(true)
        const response = await userLoginService(email, password)

        if (response.status === 'error') {
            setNotificationMessage(response.message)
            setNotificationSeverity(response.status)
            setOpenNotification(true)
        }

        if (response.status === "success") {
            setNotificationMessage(response.message)
            setNotificationSeverity(response.status)
            setOpenNotification(true)
            setTimeout(() => {
                navigate("/home")
            }, 2000)

        }
        setIsSubmitting(false)
    }
    return (
        <div className="login-form-content">
            <TextField
                size="small"
                label='Usuario'
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Contraseña"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                size="small"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: <IconButton size="small" onClick={() => setShowPassword(!showPassword)}> {showPassword ? <Eye /> : <EyeClosed />}</IconButton>
                    }
                }}
            />
            <Button
                color="primary"
                variant="contained"
                endIcon={<LogIn />}
                fullWidth
                onClick={handleLoginSubmit}
                loading={isSubmitting}
                loadingPosition="end"
                disabled={!email || !password}
            >
                <Typography textTransform={"capitalize"}>
                    Iniciar sesion
                </Typography>
            </Button>
            {
                openNotification &&
                <NotificationAlert open={openNotification} setOpen={setOpenNotification} message={notificationMessage} severity={notificationSeverity} />
            }
        </div>
    )
}

export default LoginForm