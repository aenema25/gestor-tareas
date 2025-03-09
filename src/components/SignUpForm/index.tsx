import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Eye, EyeClosed, FilePenLine } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { userSignUpService } from "../../services/auth.api";
import NotificationAlert from "../NotificationAlert";
import { SignupFormPropsInterface } from "../../types/props.types";
import { LoginFormErrorsInterface } from "../../types/login.types";
import { NotificationAlertSeverityType } from "../../types/misc.types";

const SignUpForm: FC<SignupFormPropsInterface> = ({ setloginPageStep, setEmailForConfirmation }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<LoginFormErrorsInterface>({});

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [openNotification, setOpenNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationSeverity, setNotificationSeverity] = useState<NotificationAlertSeverityType>("success")
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Maneja el envío del formulario de registro de usuario.
     *
     * @async
     * @function handleSubmit
     * @returns {Promise<void>} - No retorna ningún valor explícito.
     * 
     * @description
     * * - Verifica si hay errores en los datos antes de proceder.
     * - Llama al servicio de registro (`userSignUpService`) con los datos del usuario.
     * - Muestra notificaciones en caso de error o éxito.
     * - Si el registro es exitoso, cambia el estado para solicitar la confirmación del correo.
     */

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);

        if (Object.keys(errors).length > 0 || !formData.email || !formData.password || !formData.confirmPassword) {
            setIsSubmitting(false);
            return;
        }

        const response = await userSignUpService(formData.email, formData.password)

        if (response?.status === 'error') {
            setNotificationMessage(response.message)
            setNotificationSeverity(response.status)
            setOpenNotification(true)
        }

        if (response?.status === 'success') {
            setloginPageStep('confirm')
            setEmailForConfirmation(formData.email)
        }

        setIsSubmitting(false);
    };

    /**
     * Efecto que valida los datos del formulario en cada cambio.
     * Verifica que el correo tenga un formato válido, que la contraseña tenga al menos un número,
     * que tenga una longitud mínima de 6 caracteres y que coincida con la confirmación de contraseña.
     *
     * @function
     * @name useEffect
     * @param {void} - No recibe parámetros directamente, pero depende de `formData`.
     * @returns {void} - No retorna ningún valor directamente.
     */

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d).+$/;
        const newErrors: LoginFormErrorsInterface = {};

        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Correo electrónico inválido";
        }

        if (formData.password && !passwordRegex.test(formData.password)) {
            newErrors.password = "La contraseña debe tener al menos 1 numero";
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
    }, [formData]); 

    return (
        <div className="login-form-content">
            <TextField
                name='email'
                value={formData.email}
                onChange={handleChange}
                size="small"
                type="email"
                label='Correo'
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                name='password'
                value={formData.password}
                onChange={handleChange}
                label="Contraseña"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                size="small"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
                slotProps={{
                    input: {
                        endAdornment: <IconButton size="small" onClick={() => setShowPassword(!showPassword)}> {showPassword ? <Eye /> : <EyeClosed />}</IconButton>
                    }
                }}

            />
            <TextField
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                label="Confirmar contraseña"
                variant="outlined"
                type={showConfirmPassword ? "text" : "password"}
                size="small"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                slotProps={{
                    input: {
                        endAdornment: <IconButton size="small" onClick={() => setShowConfirmPassword(!showConfirmPassword)}> {showConfirmPassword ? <Eye /> : <EyeClosed />}</IconButton>
                    }
                }}
            />
            <Button
                color="primary"
                variant="contained"
                endIcon={<FilePenLine />}
                loading={isSubmitting}
                loadingPosition="end"
                fullWidth
                disabled={Object.keys(errors).length > 0 || !formData.email || !formData.password || !formData.confirmPassword}
                onClick={handleSubmit}
            >
                <Typography textTransform={"capitalize"}>
                    Registrarse
                </Typography>
            </Button>
            {
                openNotification &&
                <NotificationAlert open={openNotification} setOpen={setOpenNotification} severity={notificationSeverity} message={notificationMessage} />
            }
        </div>
    )
}

export default SignUpForm