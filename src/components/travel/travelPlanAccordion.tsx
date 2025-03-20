import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Stack, Button, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MyTravelPlan, Place } from '../../types';

interface TravelPlanAccordionProps {
    day: string;
    plan: { id: string; date: string; place: Partial<Place>; }[];
    onDelete: (id: string) => void;
    onUpdateDate: () => void;
    handleOpenModal: (place: Partial<Place>, existingPlan?: MyTravelPlan) => void;
}

const TravelPlanAccordion: React.FC<TravelPlanAccordionProps> = ({ day, plan, onDelete, onUpdateDate, handleOpenModal }) => {

    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{day.split('-').reverse().join('.')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {plan.length > 0 ? (
                    plan.map((item, index) =>
                        item.place ? ( // place tanımlı mı kontrol et
                            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography>
                                    📍 {item.place.name} - {item.place.city} - {item.place.categoryName}
                                </Typography>
                                <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleOpenModal(item.place)}
                                    >
                                        Tarih Değiştir
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => onDelete(item.id)}
                                    >
                                        Çıkart
                                    </Button>
                                </Stack>
                            </Stack>
                        ) : (
                            <Typography key={index} sx={{ mb: 1, color: 'red' }}>
                                ⚠️ Geçersiz veri, mekan bulunamadı.
                            </Typography>
                        )
                    )
                ) : (
                    <Typography>Bu gün için mekan bulunmamaktadır.</Typography>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default TravelPlanAccordion;
