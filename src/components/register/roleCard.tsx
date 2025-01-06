import { Card, Stack, SxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

export const RoleCard = ({ title, children, sx = {}, onClick }: { title: string, children: ReactNode, sx?: SxProps, onClick: () => void }) => {
    return (
        <Card sx={{
            width: "300px",
            height: "230px",
            padding: "20px",
            paddingTop: "10px",
            alignContent: "center",
            border: "1px solid",
            ":hover": {
                color: "#1378bf",
                borderColor: "#1378bf"
            },
            ...sx
        }}
            onClick={onClick}
        >
            <Stack direction={"column"} spacing={"3px"} alignItems={"center"} justifyContent={"center"}>
                {children}
                <Typography variant="h5">{title}</Typography>
                <Typography variant="subtitle1">olarak kayıt olun</Typography>
            </Stack>
        </Card>
    );
};

export default RoleCard;
