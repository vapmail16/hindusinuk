import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Box,
  Chip
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { CATEGORY_COLORS } from './eventConstants';

const EventList = ({ events = [], onEventEdit, onEventDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleMenuOpen = (event, eventItem) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
    onEventEdit(selectedEvent);
    handleMenuClose();
  };

  const handleDelete = () => {
    onEventDelete(selectedEvent);
    handleMenuClose();
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #eee' }}>
      <List>
        {events.map(event => (
          <ListItem 
            key={event.id}
            sx={{
              borderLeft: `4px solid ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other}`,
              mb: 1,
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
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {event.time}
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
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={(e) => handleMenuOpen(e, event)}>
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default EventList; 