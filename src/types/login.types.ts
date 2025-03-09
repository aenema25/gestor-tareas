export type LoginStepsType = "signUp" | "logIn" | "confirm"

export interface LoginFormErrorsInterface {
    email?: string;
    password?: string,
    confirmPassword?: string
}