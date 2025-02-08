import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Grid, Paper, 
  Button, CircularProgress, Dialog, 
  DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, LinearProgress, Card, CardMedia, CardContent
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { 
  doc, getDoc, updateDoc, setDoc,
  collection, query, where, getDocs, orderBy
} from 'firebase/firestore';
import Quiz from './Quiz';
import Achievements from './Achievements';
import Leaderboard from './Leaderboard';
import { styled } from '@mui/material/styles';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '@mui/material/Pagination';
import VideosSection from './VideosSection';

const LEVELS = [
  { level: 1, name: "Beginner", requiredScore: 0 },
  { level: 2, name: "Intermediate", requiredScore: 70 },
  { level: 3, name: "Advanced", requiredScore: 140 },
  { level: 4, name: "Expert", requiredScore: 210 },
  { level: 5, name: "Master", requiredScore: 280 }
];

// Add level images
const LEVEL_IMAGES = {
  intro: '/images/om-symbol.png', // Add these images to your public/images folder
  1: '/images/ganesha.png',
  2: '/images/krishna.png',
  3: '/images/hanuman.png',
  4: '/images/shiva.png',
  5: '/images/durga.png'
};

// First, update the INITIAL_LEVEL_STATE
const INITIAL_LEVEL_STATE = {
  1: { 
    unlocked: true,
    score: 0,
    completedQuestions: [],
    status: 'active'
  },
  2: { unlocked: true, score: 0, completedQuestions: [], status: 'active' },
  3: { unlocked: true, score: 0, completedQuestions: [], status: 'active' },
  4: { unlocked: true, score: 0, completedQuestions: [], status: 'active' },
  5: { unlocked: true, score: 0, completedQuestions: [], status: 'active' }
};

// Create a styled component for the level card
const LevelCard = styled(Paper)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1
  }
}));

const KidsSection = ({ onLoginClick }) => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState({
    levels: INITIAL_LEVEL_STATE // Set default state for non-logged in users
  });
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const storiesPerPage = 5;
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyDialogOpen, setStoryDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('User authenticated:', user.uid);
      loadUserProgress();
    } else {
      setLoading(false); // Stop loading if no user
    }
  }, [user]);

  useEffect(() => {
    if (userProgress && !userProgress.levels[1]?.unlocked) {
      // Ensure level 1 is always unlocked
      const progressRef = doc(db, 'userProgress', user.uid);
      updateDoc(progressRef, {
        'levels.1.unlocked': true,
        'levels.1.status': 'active'
      });
      
      setUserProgress(prev => ({
        ...prev,
        levels: {
          ...prev.levels,
          1: {
            ...prev.levels[1],
            unlocked: true,
            status: 'active'
          }
        }
      }));
    }
  }, [userProgress, user]);

  useEffect(() => {
    if (userProgress) {
      // Ensure level 1 is always accessible
      const level1NotAccessible = !userProgress.levels?.[1]?.unlocked;
      if (level1NotAccessible) {
        setUserProgress(prev => ({
          ...prev,
          levels: {
            ...prev.levels,
            1: {
              ...INITIAL_LEVEL_STATE[1],
              unlocked: true,
              status: 'active'
            }
          }
        }));
      }
    }
  }, [userProgress]);

  useEffect(() => {
    fetchStories();
  }, [page]);

  const loadUserProgress = async () => {
    try {
      console.log('Loading user progress...');
      const progressRef = doc(db, 'userProgress', user.uid);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const data = progressDoc.data();
        // Always ensure the levels structure exists with level 1 unlocked
        const updatedData = {
          ...data,
          levels: {
            ...INITIAL_LEVEL_STATE,  // Start with the initial state
            ...data.levels,  // Override with any existing data
            1: {  // Always ensure level 1 is unlocked
              ...(data.levels?.[1] || INITIAL_LEVEL_STATE[1]),
              unlocked: true,
              status: 'active'
            }
          }
        };
        console.log('Updated user progress:', updatedData);
        setUserProgress(updatedData);
      } else {
        console.log('Initializing new user progress');
        const initialProgress = {
          userId: user.uid,
          totalScore: 0,
          levels: INITIAL_LEVEL_STATE,
          achievements: [],
          lastPlayed: null
        };
        await setDoc(progressRef, initialProgress);
        setUserProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Initialize with default state even on error to ensure functionality
      const fallbackProgress = {
        userId: user.uid,
        totalScore: 0,
        levels: INITIAL_LEVEL_STATE,
        achievements: [],
        lastPlayed: null
      };
      setUserProgress(fallbackProgress);
      setMessage({ 
        text: 'Error loading progress, using default settings: ' + error.message, 
        type: 'warning' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (level) => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }

    console.log('handleStartQuiz called with level:', level);
    try {
      setLoading(true);
      console.log('Fetching questions...');
      const quiz = await fetchQuizQuestions(level);
      
      if (!quiz) {
        // Quiz is null means level is completed
        return;
      }

      setCurrentQuiz(quiz);
      setQuizOpen(true);
      console.log('Quiz dialog opened');
    } catch (error) {
      console.error('Error starting quiz:', error);
      setMessage({ 
        text: error.message || 'Unable to start quiz. Please try again later.', 
        type: 'info' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = (level) => {
    if (!userProgress) return 0;
    const levelData = userProgress.levels[level];
    const totalQuestions = 100; // Total questions per level
    const completedQuestions = levelData?.completedQuestions?.length || 0;
    return (completedQuestions / totalQuestions) * 100; // Actual percentage of completed questions
  };

  const fetchQuizQuestions = async (level) => {
    try {
      console.log('Fetching questions for level:', level);
      const q = query(
        collection(db, 'quizQuestions'),
        where('level', '==', parseInt(level)),
        where('approved', '==', true)
      );
      
      const snapshot = await getDocs(q);
      console.log('Found questions:', snapshot.docs.length);
      
      if (snapshot.empty) {
        console.log('No questions found in database');
        throw new Error('Questions for this level are being prepared. Please try another level.');
      }

      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter out completed questions
      const completedQuestions = userProgress?.levels[level]?.completedQuestions || [];
      const availableQuestions = questions.filter(q => !completedQuestions.includes(q.id));

      if (availableQuestions.length === 0) {
        setMessage({ 
          text: '🎉 Congratulations! You have completed all questions in this level. Try another level!', 
          type: 'success' 
        });
        return null;
      }

      // Randomly select from available questions
      const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
      return {
        level: parseInt(level),
        questions: shuffled.slice(0, Math.min(10, shuffled.length))
      };
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  };

  const handleQuizComplete = async (score) => {
    try {
      const progressRef = doc(db, 'userProgress', user.uid);
      const updates = {
        [`levels.${currentQuiz.level}.score`]: Math.max(userProgress.levels[currentQuiz.level]?.score || 0, score),
        [`levels.${currentQuiz.level}.completedQuestions`]: [
          ...(userProgress.levels[currentQuiz.level]?.completedQuestions || []),
          ...currentQuiz.questions.map(q => q.id)
        ],
        totalScore: (userProgress.totalScore || 0) + score,
        lastPlayed: new Date()
      };

      // Check if user unlocked next level (if score is 70% or higher)
      if (score >= 70 && currentQuiz.level < 5) {
        updates[`levels.${currentQuiz.level + 1}.unlocked`] = true;
      }

      // Check and update achievements
      const achievements = [...(userProgress.achievements || [])];
      
      // First quiz achievement
      if (!achievements.includes('first_quiz')) {
        achievements.push('first_quiz');
      }

      // Perfect score achievement
      if (score === 100) {
        achievements.push('perfect_score');
      }

      // Level master achievement
      if (score >= 90) {
        achievements.push(`level_master_${currentQuiz.level}`);
      }

      if (achievements.length > 0) {
        updates.achievements = achievements;
      }

      await updateDoc(progressRef, updates);
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        totalScore: (prev.totalScore || 0) + score,
        levels: {
          ...prev.levels,
          [currentQuiz.level]: {
            ...prev.levels[currentQuiz.level],
            score: Math.max(prev.levels[currentQuiz.level].score || 0, score)
          },
          ...(score >= 70 && currentQuiz.level < 5 ? {
            [currentQuiz.level + 1]: {
              ...prev.levels[currentQuiz.level + 1],
              unlocked: true
            }
          } : {})
        },
        achievements: achievements
      }));

      // Show completion message
      setMessage({ 
        text: `Quiz completed! Score: ${score}${achievements.length > (userProgress.achievements?.length || 0) ? ' 🏆 New Achievement!' : ''}`, 
        type: 'success' 
      });

      // Close quiz dialog
      setQuizOpen(false);
      setCurrentQuiz(null);

    } catch (error) {
      console.error('Error updating progress:', error);
      setMessage({ 
        text: 'Error saving progress: ' + error.message, 
        type: 'error' 
      });
    }
  };

  const handleCloseQuiz = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmExit = () => {
    setConfirmDialogOpen(false);
    setQuizOpen(false);
    setCurrentQuiz(null);
  };

  const fetchStories = async () => {
    try {
      setStoriesLoading(true);
      const storiesRef = collection(db, 'stories');
      const snapshot = await getDocs(storiesRef);
      
      const allStories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Shuffle the stories array
      const shuffledStories = [...allStories].sort(() => Math.random() - 0.5);
      
      setTotalPages(Math.ceil(allStories.length / storiesPerPage));
      
      // Get current page stories
      const startIndex = (page - 1) * storiesPerPage;
      const endIndex = startIndex + storiesPerPage;
      setStories(shuffledStories.slice(startIndex, endIndex));
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    setSelectedStory(story);
    setStoryDialogOpen(true);
  };

  const handleCloseStoryDialog = () => {
    setStoryDialogOpen(false);
    setSelectedStory(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 4,
        position: 'relative'
      }}>
        {/* Move achievement and leaderboard buttons to top */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3
        }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<EmojiEventsIcon />}
            onClick={() => setAchievementsOpen(true)}
            sx={{ px: 4, py: 1 }}
          >
            Achievements
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<LeaderboardIcon />}
            onClick={() => setLeaderboardOpen(true)}
            sx={{ px: 4, py: 1 }}
          >
            Leaderboard
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Intro Card */}
          <Grid item xs={12} sm={6} md={2}>
            <LevelCard
              sx={{
                backgroundImage: `url(${LEVEL_IMAGES.intro})`,
                opacity: 1,
                height: '250px',
                width: '100%',
                maxWidth: '350px',
                mx: 'auto'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                <Typography 
                  variant="h6" 
                  align="center" 
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Hindu Culture Quiz
                </Typography>
              </Box>
            </LevelCard>
          </Grid>
          
          {/* Level Cards */}
          {LEVELS.map((level, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <LevelCard
                sx={{
                  backgroundImage: `url(${LEVEL_IMAGES[level.level]})`,
                  opacity: 1,
                  cursor: 'pointer',
                  height: '250px',
                  width: '100%',
                  maxWidth: '350px',
                  mx: 'auto'
                }}
                onClick={() => handleStartQuiz(level.level)}
              >
                <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Level {level.level}
                  </Typography>
                  <Typography variant="body2" align="center" color="textSecondary">
                    {level.name}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 1 }}>
                    <CircularProgress
                      variant="determinate"
                      value={user ? getLevelProgress(level.level) : 0}
                      size={60}
                      thickness={4}
                      sx={{
                        color: 'primary.main'
                      }}
                    />
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      {user ? `${Math.round(getLevelProgress(level.level))}% Complete` : 'Login to track progress'}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    disabled={loading}
                    onClick={() => handleStartQuiz(level.level)}
                    sx={{ 
                      mt: 1,
                      zIndex: 2,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Start Quiz'}
                  </Button>
                </Box>
              </LevelCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Update the login prompt dialog */}
      <Dialog
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>
            Please log in to:
          </Typography>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography>• Track your progress</Typography>
            <Typography>• Earn achievements</Typography>
            <Typography>• Compete on leaderboard</Typography>
            <Typography>• Access all features</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setLoginPromptOpen(false);
              onLoginClick && onLoginClick('/kids');
            }}
            variant="contained"
          >
            Login
          </Button>
          <Button 
            onClick={() => setLoginPromptOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Other dialogs - Only render when user is logged in */}
      {user && (
        <>
          {quizOpen && currentQuiz && (
            <Dialog 
              open={quizOpen} 
              onClose={handleCloseQuiz}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  p: 2
                }
              }}
              aria-labelledby="quiz-dialog-title"
            >
              <Quiz 
                level={currentQuiz.level}
                questions={currentQuiz.questions}
                onComplete={handleQuizComplete}
              />
            </Dialog>
          )}
          <Achievements
            open={achievementsOpen}
            onClose={() => setAchievementsOpen(false)}
            userAchievements={userProgress?.achievements || []}
          />
          <Leaderboard
            open={leaderboardOpen}
            onClose={() => setLeaderboardOpen(false)}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            onClose={handleConfirmClose}
            onConfirm={handleConfirmExit}
          />
        </>
      )}

      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={() => setMessage({ text: '', type: '' })}
      >
        <Alert severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>

      {/* Divider */}
      <Box 
        sx={{ 
          my: 8, 
          display: 'flex', 
          alignItems: 'center',
          gap: 2 
        }}
      >
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        <Typography variant="h4" component="h2" color="primary">
          Hindu Stories
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
      </Box>

      {/* Stories Section */}
      <Grid container spacing={3}>
        {/* Static Stories Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper 
            sx={{ 
              height: '250px',
              width: '100%',
              maxWidth: '350px',
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
              backgroundImage: `url(/images/om-symbol.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 1
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
              <Typography variant="h5" component="h3" align="center" gutterBottom>
                Divine Stories
              </Typography>
              <Typography align="center">
                Explore the magical world of Hindu gods and their divine stories
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Story Cards */}
        {storiesLoading ? (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          stories.map((story) => (
            <Grid item xs={12} sm={6} md={2} key={story.id}>
              <Paper
                sx={{ 
                  height: '250px',
                  width: '100%',
                  maxWidth: '350px',
                  mx: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    cursor: 'pointer',
                    '& .login-overlay': {
                      opacity: user ? 0 : 0.9  // Show overlay only for non-logged in users
                    }
                  },
                  backgroundImage: `url(/images/${story.god.toLowerCase()}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 1
                  }
                }}
                onClick={() => handleStoryClick(story)}
              >
                {/* Add login overlay for non-logged in users */}
                {!user && (
                  <Box
                    className="login-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      zIndex: 3,
                      color: 'white',
                      textAlign: 'center',
                      p: 2
                    }}
                  >
                    <Box>
                      <Typography variant="body1" gutterBottom>
                        Login Required
                      </Typography>
                      <Typography variant="body2">
                        Click to sign in and read the story
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{ 
                    position: 'relative',
                    zIndex: 2,
                    p: 2,
                    mt: 'auto'
                  }}
                >
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {story.god}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {story.content}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Story Dialog */}
      <Dialog
        open={storyDialogOpen}
        onClose={handleCloseStoryDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 3,
            minHeight: '60vh'
          }
        }}
      >
        {selectedStory && (
          <>
            <DialogTitle>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2
              }}>
                <Box
                  component="img"
                  src={`/images/${selectedStory.god.toLowerCase()}.png`}
                  alt={selectedStory.god}
                  sx={{ 
                    width: 60,
                    height: 60,
                    objectFit: 'contain'
                  }}
                />
                <Typography variant="h4" component="h2">
                  {selectedStory.god}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography 
                variant="h6" 
                color="primary" 
                gutterBottom 
                sx={{ mb: 2 }}
              >
                {selectedStory.theme}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8
                }}
              >
                {selectedStory.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseStoryDialog}
                variant="contained"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add the Videos section */}
      <VideosSection />
    </Container>
  );
};

export default KidsSection; 