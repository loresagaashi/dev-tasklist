"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Typography, Button, Paper, Box } from '@mui/material';

const BookingDetails: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();  

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;  

            try {
                const res = await fetch(`http://host.docker.internal:5000/api/bookings/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch booking details');
                }
                const data = await res.json();
                setBooking(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    if (!booking) return <div>Booking not found</div>;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return 'Invalid Time'; 

        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":");

        if (modifier === "PM" && parseInt(hours, 10) < 12) {
            hours = (parseInt(hours, 10) + 12).toString();
        }
        if (modifier === "AM" && parseInt(hours, 10) === 12) {
            hours = "00"; 
        }

        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));

        const hoursIn12 = date.getHours() % 12 || 12; 
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        const formattedMinutes = date.getMinutes().toString().padStart(2, '0'); 

        return `${hoursIn12}:${formattedMinutes} ${ampm}`;
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Typography variant="h5" gutterBottom>
                        Booking Details
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Doctor:</strong> {booking.doctor_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Service:</strong> {booking.service}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Date:</strong> {formatDate(booking.date)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Time:</strong> {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </Typography>

                    {/* Center the button */}
                    <Box mt={3}>
                        <Link href="/" passHref>
                            <Button variant="contained" color="primary">
                                Back to Homepage
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default BookingDetails;
