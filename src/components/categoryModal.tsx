import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Category } from "../types";
import { useEffect, useState } from "react";

interface CategoryModalProps {
    open: boolean;
    mode: "add" | "edit";
    category: Category | null;
    onClose: () => void;
    onSubmit: (category: Partial<Category>) => Promise<void>;
}

export default function CategoryModal({ open, mode, category, onClose, onSubmit }: CategoryModalProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (mode === "edit" && category) {
            setName(category.name);
        } else {
            setName("");
        }
    }, [mode, category]);

    const handleSubmit = async () => {
        const categoryData: Partial<Category> = {
            ...(mode === "edit" ? { id: category?.id } : {}),
            name,
        };

        await onSubmit(categoryData);
        setName("")
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {mode === "edit" ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Kategori Adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>İptal</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {mode === "edit" ? "Güncelle" : "Ekle"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}