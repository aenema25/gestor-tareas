import { Avatar, Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FC } from "react";
import { Outlet, useNavigate } from "react-router";
import "../../styles/dashboard.layout.styles.css"
import { deepPurple, green, grey, red } from "@mui/material/colors";
import { CalendarClock, Circle, LogOut } from "lucide-react";
import { signOut } from 'aws-amplify/auth';

const DashboardLayout: FC = () => {

    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate("/")
    }

    return (
        <div className="dashboard-layout-container">
            <div className="dashboard-layout-sidebar">
                <div className="dashboard-layout-sidebar-header">
                    <Avatar sx={{ bgcolor: deepPurple[300], width: "36px", height: "36px" }}>
                        <Typography variant="body1" fontWeight={600}>
                            OU
                        </Typography>
                    </Avatar>
                    <div className="dashboard-layout-sidebar-header-title">
                        <Typography variant="caption" fontWeight={500} sx={{ color: grey[700] }}>
                            Tareas de:
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: deepPurple[300] }}>
                            Oscar Uribe
                        </Typography>
                    </div>

                </div>
                <Divider sx={{ bgcolor: deepPurple[200], height: "3px", borderRadius: "2px" }} />
                <List>
                    <ListItemButton sx={{ padding: '0 10px', gap: '10px' }}>
                        <ListItemIcon sx={{ minWidth: 'unset' }}>
                            <CalendarClock stroke={deepPurple[300]} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" fontWeight={400} sx={{ color: grey[700] }}>
                            Tareas
                        </Typography>} />
                    </ListItemButton>
                    <List component="div" disablePadding >
                        <ListItemButton sx={{ gap: '10px', paddingLeft: "24px" }}>
                            <ListItemIcon sx={{ minWidth: 'unset' }}>
                                <Circle width={12} stroke={green[500]} fill={green[500]} />
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography variant="body2" fontWeight={400} sx={{ color: grey[700] }}>
                                    Completadas
                                </Typography>
                            } />
                        </ListItemButton>
                        <ListItemButton sx={{ gap: '10px', paddingLeft: "24px" }}>
                            <ListItemIcon sx={{ minWidth: 'unset' }}>
                                <Circle width={12} stroke={red[500]} fill={red[500]} />
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography variant="body2" fontWeight={400} sx={{ color: grey[700] }}>
                                    Incompletas
                                </Typography>
                            } />
                        </ListItemButton>

                    </List>
                </List>
                <div className="dashboard-layout-sidebar-footer">
                    <Button variant="contained" color="secondary" endIcon={<LogOut />} onClick={handleSignOut}>
                        <Typography variant="body2" textTransform="capitalize">
                            Cerrar Sesion
                        </Typography>
                    </Button>
                </div>
            </div>
            <div className="dashboard-layout-content">
                <Outlet />
            </div>

        </div>
    )
}

export default DashboardLayout