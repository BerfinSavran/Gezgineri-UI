import { useState, useEffect } from "react";
import { Container, TextField, Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import categoryService from "../services/categoryService";

export default function ApprovalPlacesPage() {
    const [categories, setCategories] = useState<any[]>([]); // Kategorileri tutacak state
    const [categoryName, setCategoryName] = useState<string>(""); // Kategori ismini tutacak state

    // Sayfa yüklendiğinde kategorileri çekme
    useEffect(() => {
        async function fetchCategories() {
            try {
                const fetchedCategories = await categoryService.GetAllCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Kategoriler alınırken hata oluştu:", error);
            }
        }

        fetchCategories();
    }, []); 

    // Kategori ekleme
    const handleAddCategory = async () => {
        if (categoryName.trim() === "") {
            alert("Kategori adı boş olamaz");
            return;
        }

        try {
            const newCategory = await categoryService.AddOrUpdateCategory({ name: categoryName });
            setCategories([...categories, newCategory]); // Yeni kategoriyi listeye ekle
            setCategoryName(""); // Inputu temizle
        } catch (error) {
            console.error("Kategori eklenirken hata oluştu:", error);
        }
    };

    return (
        <Container maxWidth="xl">
            <h1>Kategoriler</h1>

            {/* Kategori ekleme formu */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        label="Kategori Adı"
                        variant="outlined"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleAddCategory}
                    >
                        Kategori Ekle
                    </Button>
                </Grid>
            </Grid>

            {/* Kategoriler Listesi */}
            <List>
                {categories.map((category, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={category.name} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}
