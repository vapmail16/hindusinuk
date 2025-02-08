import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const KidsActivitiesSection = () => {
  const navigate = useNavigate();

  return (
    <Box component="section">
      {/* Header */}
      <Box sx={{ 
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        mb: 4
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
          Kids Corner
        </Typography>
      </Box>

      {/* Activity Cards */}
      <Grid container spacing={4} justifyContent="center">
        {/* Quiz Box */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              position: 'relative',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/images/quiz-icon.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.1,
                zIndex: 0
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <Typography variant="h5" gutterBottom align="center">
                Quiz
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                Level 1
              </Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={38}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#E3F2FD',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#2196f3'
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  38% Complete
                </Typography>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="contained"
                onClick={() => navigate('/kids')}
                sx={{ 
                  bgcolor: '#2196f3',
                  borderRadius: 2,
                  px: 4
                }}
              >
                START QUIZ
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Story Box */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              position: 'relative',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/images/story-icon.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.1,
                zIndex: 0
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <Typography variant="h5" gutterBottom align="center">
                Story
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary">
                Loading...
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="contained"
                onClick={() => navigate('/kids')}
                sx={{ 
                  bgcolor: '#2196f3',
                  borderRadius: 2,
                  px: 4
                }}
              >
                READ STORY
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Video Box */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              position: 'relative',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/images/video-icon.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.1,
                zIndex: 0
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <Typography variant="h5" gutterBottom align="center">
                Video
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary">
                Loading...
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="contained"
                onClick={() => window.open('https://www.youtube.com/@HinduInUK', '_blank')}
                sx={{ 
                  bgcolor: '#2196f3',
                  borderRadius: 2,
                  px: 4
                }}
              >
                WATCH VIDEO
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KidsActivitiesSection; 