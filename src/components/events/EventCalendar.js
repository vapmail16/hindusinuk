import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  Tab,
  Tabs
} from '@mui/material';
import { Add as AddIcon, ViewList, CalendarMonth } from '@mui/icons-material';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import EventList from './EventList';
import CalendarView from './CalendarView';
import EventForm from './EventForm';
import UpcomingEvents from './UpcomingEvents';

const EventCalendar = () => {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [openForm, setOpenForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate() // Convert Firestore Timestamp to Date
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    fetchEvents(); // Refresh events after form closes
  };

  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setOpenForm(true);
  };

  const handleEventDelete = async (event) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const eventRef = doc(db, 'events', event.id);
        await deleteDoc(eventRef);
        fetchEvents(); // Refresh the list
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Event
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={view} onChange={(e, newValue) => setView(newValue)}>
          <Tab 
            icon={<CalendarMonth />} 
            label="Calendar" 
            value="calendar"
            iconPosition="start"
          />
          <Tab 
            icon={<ViewList />} 
            label="List" 
            value="list"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {view === 'calendar' ? (
        <>
          <CalendarView 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            events={events}
            onEventEdit={handleEventEdit}
            onEventDelete={handleEventDelete}
          />
          <UpcomingEvents 
            events={events}
            onEventEdit={handleEventEdit}
            onEventDelete={handleEventDelete}
          />
        </>
      ) : (
        <EventList 
          selectedDate={selectedDate}
          events={events}
          onEventEdit={handleEventEdit}
          onEventDelete={handleEventDelete}
        />
      )}

      <Dialog
        open={openForm}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <EventForm 
          event={editingEvent}
          onClose={() => {
            handleFormClose();
            setEditingEvent(null);
          }}
          selectedDate={selectedDate}
        />
      </Dialog>
    </Container>
  );
};

export default EventCalendar; 