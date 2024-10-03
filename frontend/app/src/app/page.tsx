"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Typography, Button, List, ListItem, ListItemText, Paper } from '@mui/material';

async function getBookings() {
    const res = await fetch('http://host.docker.internal:5000/api/bookings', { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

const Home: React.FC = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const bookingsData = await getBookings();
            setBookings(bookingsData);
        };
        fetchBookings();
    }, []);

    const extractTime = (timeString: string) => {
        console.log("Raw Start Time:", timeString); 

        if (!timeString) return 'Invalid Time'; 

        let date;

        if (timeString.includes('T')) {
            date = new Date(timeString);
        } else {
            const currentDate = new Date().toLocaleDateString('en-US'); 
            const dateTimeString = `${currentDate} ${timeString}`;
            date = new Date(dateTimeString);
        }

        if (isNaN(date.getTime())) {
            return 'Invalid Time';
        }

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Current Booking Count: {bookings.length}
            </Typography>
            <Link href="/create" passHref>
                <Button 
                    variant="contained" 
                    color="secondary"
                    fullWidth 
                    style={{ marginBottom: '1rem' }}
                >
                    Create a New Booking
                </Button>
            </Link>
            <Paper elevation={3} style={{ padding: '1rem' }}>
                <List>
                    {bookings.map((booking) => (
                        <ListItem component="a" href={`/booking/${booking.id}`} key={booking.id}>
                            <ListItemText 
                                primary={`A Booking on ${new Date(booking.date).toLocaleDateString()}`} 
                                secondary={`Starting at ${extractTime(booking.start_time)} with ${booking.doctor_name}`} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Home;

