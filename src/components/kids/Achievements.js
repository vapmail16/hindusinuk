import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  Grid, Paper, Typography, Box
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const ACHIEVEMENTS = [
  {
    id: 'first_quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    color: '#4CAF50'
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: <StarIcon sx={{ fontSize: 40 }} />,
    color: '#FFC107'
  },
  {
    id: 'level_master',
    title: 'Level Master',
    description: 'Complete all questions in a level',
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    color: '#2196F3'
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Answer 3 questions correctly in a row',
    icon: <WhatshotIcon sx={{ fontSize: 40 }} />,
    color: '#FF5722'
  }
];

const Achievements = ({ open, onClose, userAchievements }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Your Achievements</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {ACHIEVEMENTS.map((achievement) => (
            <Grid item xs={12} sm={6} key={achievement.id}>
              <Paper 
                sx={{ 
                  p: 2,
                  opacity: userAchievements?.includes(achievement.id) ? 1 : 0.5,
                  filter: userAchievements?.includes(achievement.id) ? 'none' : 'grayscale(1)'
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ color: achievement.color }}>
                    {achievement.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{achievement.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default Achievements; 