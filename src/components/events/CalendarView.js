import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import isSameMonth from 'date-fns/isSameMonth';
import isSameDay from 'date-fns/isSameDay';
import { CATEGORY_COLORS } from './eventConstants';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EventDot = ({ event }) => (
  <Tooltip 
    title={
      <Box>
        <Typography variant="subtitle2">{event.title}</Typography>
        <Typography variant="body2">{event.time}</Typography>
        <Typography variant="body2">{event.location.venue}</Typography>
      </Box>
    }
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        bgcolor: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other,
        display: 'inline-block',
        mx: 0.5
      }}
    />
  </Tooltip>
);

const CalendarView = ({ selectedDate, onDateSelect, events = [], onEventEdit, onEventDelete }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = Array(monthStart.getDay()).fill(null);
  const endPadding = Array(6 - monthEnd.getDay()).fill(null);
  const allDays = [...startPadding, ...daysInMonth, ...endPadding];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid #eee',
        borderRadius: 2,
      }}
    >
      {/* Month Navigation */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'rgb(255, 237, 213)',
        p: 2,
      }}>
        <IconButton onClick={handlePreviousMonth} sx={{ color: '#666' }}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#333' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: '#666' }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ p: 2 }}>
        {/* Days Header */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            mb: 1
          }}
        >
          {DAYS_OF_WEEK.map(day => (
            <Typography 
              key={day}
              align="center"
              sx={{ 
                fontSize: '0.875rem',
                color: '#666',
                py: 1
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Days Grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            bgcolor: '#eee',
          }}
        >
          {allDays.map((day, index) => {
            const eventsForDay = day ? events.filter(event => 
              isSameDay(new Date(event.date), day)
            ) : [];

            return (
              <Box
                key={day ? day.toISOString() : `empty-${index}`}
                onClick={() => day && onDateSelect(day)}
                sx={{
                  bgcolor: day && isSameDay(day, selectedDate) ? 'rgb(255, 237, 213)' : 'white',
                  p: 1,
                  minHeight: '80px',
                  cursor: day ? 'pointer' : 'default',
                  position: 'relative',
                  '&:hover': day && {
                    bgcolor: 'rgb(255, 245, 235)',
                  }
                }}
              >
                {day && (
                  <>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: !isSameMonth(day, currentMonth) ? '#ccc' : '#333',
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    {eventsForDay.length > 0 && (
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        right: 4,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5
                      }}>
                        {eventsForDay.map(event => (
                          <EventDot key={event.id} event={event} />
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarView; 