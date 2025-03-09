import { Alert, Dialog, Typography } from "@mui/material";
import { FC } from "react";
import { NotificationAlertPropsInterface } from "../../types/props.types";

const NotificationAlert: FC<NotificationAlertPropsInterface> = ({ severity, message, open, setOpen }) => (
    <Dialog open={open} onClose={() => setOpen(false)}  >
        <Alert severity={severity} variant="outlined" onClose={() => setOpen(false)}>
            <Typography variant="body2">
                {message}
            </Typography>
        </Alert>
    </Dialog>
)


export default NotificationAlert