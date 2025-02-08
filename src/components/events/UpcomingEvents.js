import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { CATEGORY_COLORS } from './eventConstants';

const UpcomingEvents = ({ events = [], onEventEdit, onEventDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Only show future events
  const upcomingEvents = sortedEvents.filter(event => 
    new Date(event.date) >= new Date()
  );

  const handleMenuOpen = (event, eventItem) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mt: 3,
        border: '1px solid #eee',
        borderRadius: 2
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6">
          Upcoming Events
        </Typography>
      </Box>
      
      <List>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <React.Fragment key={event.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  borderLeft: `4px solid ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other}`,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {event.title}
                      </Typography>
                      <Chip 
                        label={event.category}
                        size="small"
                        sx={{ 
                          bgcolor: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other,
                          color: 'white',
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {event.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.location.venue}
                      </Typography>
                      {event.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {event.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <IconButton edge="end" onClick={(e) => handleMenuOpen(e, event)}>
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText
              secondary="No upcoming events"
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        )}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          onEventEdit(selectedEvent);
          handleMenuClose();
        }}>
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => {
            onEventDelete(selectedEvent);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default UpcomingEvents; 