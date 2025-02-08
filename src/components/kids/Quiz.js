import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper,
  Radio, RadioGroup, FormControlLabel,
  Alert, Slide, LinearProgress,
  Stack
} from '@mui/material';
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const Quiz = ({ level, questions, onComplete }) => {
  const { user, userProgress } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [message, setMessage] = useState(null);

  // Calculate progress percentage
  const progress = ((currentQuestion) / questions.length) * 100;
  const remainingQuestions = questions.length - (currentQuestion + 1);

  const handleAnswer = async () => {
    const correct = questions[currentQuestion].options.find(
      opt => opt.text === selectedAnswer
    )?.isCorrect;

    setAnswered(true);
    if (correct) {
      setScore(prev => prev + 10);
      setMessage({
        text: 'Correct! 🎉',
        type: 'success'
      });
      
      // Update user progress immediately
      try {
        const progressRef = doc(db, 'userProgress', user.uid);
        await updateDoc(progressRef, {
          [`levels.${level}.score`]: score + 10,
          [`levels.${level}.completedQuestions`]: arrayUnion(questions[currentQuestion].id),
          totalScore: (userProgress?.totalScore || 0) + 10
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    } else {
      setMessage({
        text: 'Sorry, that\'s not right.',
        type: 'error'
      });
    }

    // Show result for 2 seconds before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
        setAnswered(false);
        setMessage(null);
      } else {
        onComplete?.(score);
      }
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Progress Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {remainingQuestions} {remainingQuestions === 1 ? 'question' : 'questions'} remaining
          </Typography>
        </Stack>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main',
            }
          }} 
        />
      </Box>

      {/* Quiz Title */}
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Hindu Culture Quiz - Level {level}
      </Typography>

      {/* Question */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {questions[currentQuestion].question}
      </Typography>

      {/* Options */}
      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
      >
        {questions[currentQuestion].options.map((option) => (
          <Paper
            key={option.text}
            sx={{
              mb: 2,
              p: 2,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'grey.300',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover'
              },
              ...(selectedAnswer === option.text && {
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter',
              }),
              ...(answered && option.isCorrect && {
                backgroundColor: 'success.light',
                borderColor: 'success.main',
              }),
              ...(answered && !option.isCorrect && selectedAnswer === option.text && {
                backgroundColor: 'error.light',
                borderColor: 'error.main',
              })
            }}
          >
            <FormControlLabel
              value={option.text}
              control={<Radio />}
              label={option.text}
              disabled={answered}
              sx={{ 
                width: '100%',
                m: 0,
                pointerEvents: answered ? 'none' : 'auto'
              }}
            />
          </Paper>
        ))}
      </RadioGroup>

      {/* Score and Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Current Score: {score}
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleAnswer}
          disabled={!selectedAnswer || answered}
          sx={{
            minWidth: 120,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'grey.300',
            }
          }}
        >
          Submit Answer
        </Button>
      </Box>

      {/* Feedback Message */}
      {message && (
        <Slide direction="up" in={true}>
          <Alert 
            severity={message.type}
            sx={{ 
              mt: 2,
              '&.MuiAlert-standardSuccess': {
                bgcolor: 'success.light',
                color: 'success.dark'
              },
              '&.MuiAlert-standardError': {
                bgcolor: 'error.light',
                color: 'error.dark'
              }
            }}
          >
            {message.text}
            {message.type === 'error' && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Correct answer: {questions[currentQuestion].options.find(opt => opt.isCorrect).text}
              </Typography>
            )}
          </Alert>
        </Slide>
      )}
    </Box>
  );
};

export default Quiz; 