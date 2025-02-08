import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CATEGORY_COLORS } from '../events/eventConstants';
import { useNavigate } from 'react-router-dom';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');
      const snapshot = await getDocs(eventsRef);
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (event) => {
    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        status: 'approved',
        approvedAt: new Date(),
        // approvedBy: currentAdmin.uid
      });
      fetchEvents();
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (event) => {
    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        status: 'rejected',
        rejectedAt: new Date(),
        // rejectedBy: currentAdmin.uid
      });
      fetchEvents();
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/admin')}
        >
          Admin Dashboard
        </Link>
        <Typography color="text.primary">Events</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" component="h1">
          Event Management
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Event</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow 
                  key={event.id}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle2">{event.title}</Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {event.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.category}
                      size="small"
                      sx={{
                        bgcolor: CATEGORY_COLORS[event.category],
                        color: 'white',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {event.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {event.time}
                  </TableCell>
                  <TableCell>{event.location.venue}</TableCell>
                  <TableCell>
                    <Chip
                      label={event.status || 'pending'}
                      color={
                        event.status === 'approved' ? 'success' :
                        event.status === 'rejected' ? 'error' : 'default'
                      }
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<CheckIcon />}
                        color="success"
                        size="small"
                        variant="outlined"
                        onClick={() => handleApprove(event)}
                        disabled={event.status === 'approved'}
                      >
                        Approve
                      </Button>
                      <Button
                        startIcon={<CloseIcon />}
                        color="error"
                        size="small"
                        variant="outlined"
                        onClick={() => handleReject(event)}
                        disabled={event.status === 'rejected'}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default EventManager; 