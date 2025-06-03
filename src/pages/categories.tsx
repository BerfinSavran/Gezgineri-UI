import { useEffect, useState } from "react"
import { Category } from "../types";
import categoryService from "../services/categoryService";
import { Button, Container, Stack } from "@mui/material";
import Board from "../components/board";
import Card from "../components/card";
import CategoryModal from "../components/categoryModal";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    useEffect(() => {
        fetchCategories();
    }, [categories]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.GetAllCategories();
            setCategories(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Kategori alınırken hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    const handleAdd = () => {
        setOpenModal(true);
        setModalMode("add");
        setSelectedCategory(null);
    };

    const handleEdit = (category: Category) => {
        setOpenModal(true);
        setModalMode("edit");
        setSelectedCategory(category);
    };

    const handleDelete = async (category: Category) => {
        try {
            await categoryService.DeleteCategory(category.id);
            showSuccessToast("Kategori silme başarılı.");
            await fetchCategories();
        } catch (err) {
            let errorMessage = "Kategori silinemedi. Lütfen daha sonra tekrar deneyin.";

            if (err instanceof AxiosError) {
                if (err.response?.status === 500) {
                    errorMessage = "Bu kategoriye bağlı mekanlar bulunduğu için silinemez.";
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            showErrorToast(errorMessage);
        }
    };


    const handleSubmit = async (category: Partial<Category>) => {
        try {
            await categoryService.AddOrUpdateCategory(category)
                .then(() => { showSuccessToast("Kategori ekleme/güncelleme başarılı.") })
                .catch((err) => { showErrorToast(err) });
            await fetchCategories();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Kategori kaydetme sırasında hata oluştu.";
            showErrorToast(errorMessage);
        }
    };

    return (
        <Container maxWidth="xl">
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Card title={"Kategoriler"}>
                    <Board
                        items={categories}
                        columnNames={{ name: "Category Name" }}
                        hasNewRecordButton
                        newRecordButtonOnClick={handleAdd}
                        hiddenColumns={["id"]}
                        customElementOfActions={(item) => (
                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleEdit(item)}
                                >
                                    Düzenle
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(item)}
                                >
                                    Sil
                                </Button>
                            </Stack>
                        )}

                    />
                </Card>
            </Container>
            <CategoryModal
                open={openModal}
                mode={modalMode}
                category={selectedCategory}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
            />
        </Container>
    )
}