import { Tab, Tabs, Typography } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import LoginImage from "../assets/login_image.svg"
import "../styles/login.styles.css"
import { ConfirmSignUpForm, LoginForm, SignUpForm } from "../components";
import { LoginStepsType } from "../types/login.types";

const Login: FC = () => {
    const [loginPageSteps, setloginPageSteps] = useState<LoginStepsType>("logIn")
    const [emailForConfirmation, setEmailForConfirmation] = useState("")

    const handleLoginPageSteps = (_event: SyntheticEvent, newValue: LoginStepsType) => setloginPageSteps(newValue)


    return (
        <div className='login-page'>
            <div className='login-container'>
                {
                    loginPageSteps === 'confirm' ?
                        <ConfirmSignUpForm emailForConfirmation={emailForConfirmation} setloginPageStep={setloginPageSteps} />
                        :
                        <div className="login-form-container">
                            <div className="login-form-header">
                                <Typography variant="h4" fontWeight={600}>
                                    ¡Hola de nuevo! 👋
                                </Typography>

                                <Tabs value={loginPageSteps} onChange={handleLoginPageSteps} aria-label="login-steps" sx={{ width: '100%' }}>
                                    <Tab
                                        sx={{ width: '50%' }}
                                        label={
                                            <Typography variant="h6" textTransform={'capitalize'} fontWeight={300}>
                                                Iniciar sesion
                                            </Typography>
                                        }
                                        value={'logIn'}
                                    />
                                    <Tab
                                        sx={{ width: '50%' }}
                                        label={
                                            <Typography variant="h6" textTransform={'capitalize'} fontWeight={300}>
                                                Registrarse
                                            </Typography>
                                        }
                                        value={'signUp'}
                                    />
                                </Tabs>
                            </div>
                            {
                                loginPageSteps === 'logIn' &&
                                <LoginForm />
                            }
                            {
                                loginPageSteps === 'signUp' &&
                                <SignUpForm setloginPageStep={setloginPageSteps} setEmailForConfirmation={setEmailForConfirmation} />
                            }

                        </div>
                }

                <div className="login-image-container">
                    <img src={LoginImage} width={"350px"} />
                </div>
            </div>
        </div>
    )
}

export default Login