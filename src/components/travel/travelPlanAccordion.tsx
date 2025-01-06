import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TravelPlanAccordionProps {
    day: number;
    handleOpenModal: () => void;
    selectedPlace: string[];
}

const TravelPlanAccordion: React.FC<TravelPlanAccordionProps> = ({ day, handleOpenModal, selectedPlace }) => {
    

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Gün {day}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>Bu gün için mekanlarınızı ekleyin.</Typography>
                {selectedPlace.map((location, index) => (
                    <Typography key={index} sx={{ mb: 1 }}>{location}</Typography>
                ))}
                <Button variant="contained" onClick={handleOpenModal}>Ekle</Button>
            </AccordionDetails>
        </Accordion>
    );
};

export default TravelPlanAccordion;
