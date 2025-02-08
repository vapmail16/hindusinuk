import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Link,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton
} from '@mui/material';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'events'),
        orderBy('date', 'asc'),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      })).filter(event => {
        return event.date >= now;
      });
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="section">
      {/* Header with line and centered title */}
      <Box sx={{ 
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        mb: 2
      }}>
        <Typography 
          variant="h4" 
          component="h2"
          sx={{ 
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 500,
            color: '#2196f3',
            textAlign: 'center',
            bgcolor: 'white',
            px: 3,
            position: 'relative',
            top: '50%',
            transform: 'translateY(50%)'
          }}
        >
          Upcoming Events
        </Typography>
      </Box>

      {/* VIEW ALL link */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/events')}
          sx={{ 
            color: '#2196f3',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          VIEW ALL
        </Link>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {loading ? (
          [...Array(5)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))
        ) : events.length > 0 ? (
          events.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  }
                }}
                onClick={() => navigate('/events')}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={event.category}
                      size="small"
                      sx={{ 
                        bgcolor: '#FF6B00',
                        color: 'white'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(event.date, 'EEEE, MMMM d, yyyy')} at {event.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location.venue}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No upcoming events
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UpcomingEventsSection; 