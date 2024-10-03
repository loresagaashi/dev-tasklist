// src/app/create/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button as MuiButton, ButtonGroup, Typography, Paper, Box } from '@mui/material'; 
import ReplayIcon from '@mui/icons-material/Replay'; 
import { Input } from '../controls';

const CreateBooking: React.FC = () => {
    const [doctorName, setDoctorName] = useState('');
    const [service, setService] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString(); 
    };
    function formatDateTimeToISO(dateTimeString: string) {
        const date = new Date(dateTimeString);
        return date.toISOString(); 
    }
    
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const formattedStartTime = formatDateTimeToISO(startTime);
        const formattedEndTime = formatDateTimeToISO(endTime);
    
        const bookingData = { 
            doctor_name: doctorName, 
            service, 
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            date: formattedStartTime.split('T')[0]
        };

        try {
            const res = await fetch('http://host.docker.internal:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (res.ok) {
                router.push('/'); 
            } else {
                throw new Error('Failed to create booking');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Create a New Booking
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                    <Box mb={2} width="100%" maxWidth="400px">
                        <Input
                            label="Doctor Name"
                            name="doctorName"
                            value={doctorName}
                            onChange={(e) => setDoctorName(e.target.value)}
                            required
                            fullWidth
                        />
                    </Box>
                    <Box mb={2} width="100%" maxWidth="400px">
                        <Input
                            label="Service"
                            name="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            required
                            fullWidth
                        />
                    </Box>
                    <Box mb={2} width="100%" maxWidth="400px">
                        <Typography variant="body1" align="left" style={{ marginBottom: '0.5rem' }}>
                            Start Time
                        </Typography>
                        <Input
                            label=""
                            name="startTime"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            fullWidth
                        />
                    </Box>
                    <Box mb={2} width="100%" maxWidth="400px">
                        <Typography variant="body1" align="left" style={{ marginBottom: '0.5rem' }}>
                            End Time
                        </Typography>
                        <Input
                            label=""
                            name="endTime"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            fullWidth
                        />
                    </Box>
                    <ButtonGroup>
                    <MuiButton variant="contained"  sx={{ backgroundColor: '#1976d2', color: 'white' }} type="submit" style={{ marginRight: '1rem' }}>
                            Create Booking
                        </MuiButton>
                        <MuiButton
                            variant="outlined"
                            color="secondary"
                            onClick={() => { 
                                setDoctorName(''); 
                                setService(''); 
                                setStartTime(''); 
                                setEndTime(''); 
                            }} 
                            startIcon={<ReplayIcon />}
                        >
                            Reset
                        </MuiButton>
                    </ButtonGroup>
                    <MuiButton 
                        variant="outlined" 
                        color="inherit" 
                        onClick={() => router.push('/')} 
                        style={{ marginTop: '1rem' }}
                    >
                        Back to Home
                    </MuiButton>
                </Box>
            </form>
        </Paper>
    );
};
export default CreateBooking;
