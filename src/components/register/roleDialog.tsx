import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

interface RoleDialogProps{
    open: boolean;
    onClose: () => void;
    title: string;
    formFields: { label: string; type?: string;} [];
    onSubmit: (formValues: Record<string, string>) => void;
}

export default function RoleDialog({open, onClose, title, formFields, onSubmit}: RoleDialogProps){
    const [formValues, setFormValues] = useState<Record<string,string>>({});

    const handleChange = (field: string, value: string) => {
        setFormValues(prev => ({...prev, [field]:value}));
    }

    const handleSubmit = () => {
        onSubmit(formValues);
        onClose();
    }

    const roleTitles: Record<string, string> = {
        traveler: "Gezgin",
        agency: "Seyahat Acentası",
        owner: "İşletme Sahibi"
    };
    
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle textAlign={"center"}>{roleTitles[title]}</DialogTitle>
            <DialogContent>
                {formFields.map((field, idx) => 
                    <TextField
                    key={idx}
                    label={field.label}
                    type={field.type || "text"}
                    fullWidth
                    margin="normal"
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </DialogActions>
        </Dialog>
    );
}