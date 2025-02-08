import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Button, Radio, 
  RadioGroup, FormControlLabel, FormControl,
  CircularProgress, Alert
} from '@mui/material';
import { questionService } from '../../services/questionService';

const QuizSection = () => {
  const [questions, setQuestions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionIds, setQuestionIds] = useState([]);

  useEffect(() => {
    let mounted = true;
    
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await questionService.getQuestionsForLevel(currentLevel);
        if (mounted) {
          setQuestions(data);
          setQuestionIds(data.map(q => q.id));
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load questions');
          console.error(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();
    
    return () => {
      mounted = false;
    };
  }, [currentLevel]);

  const handleAnswerSubmit = () => {
    // Check answer and update score
    const currentQ = questions[currentQuestion];
    if (currentQ.options.find(opt => opt.text === selectedAnswer)?.isCorrect) {
      setScore(score + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    try {
      await questionService.markQuestionsAsUsed(questionIds);
      // Show results, update score, etc.
    } catch (error) {
      console.error('Error marking questions as used:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Hindu Quiz - Level {currentLevel}
      </Typography>
      
      {questions.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            {questions[currentQuestion].question}
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.text}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAnswerSubmit}
            disabled={!selectedAnswer}
            sx={{ mt: 2 }}
          >
            Submit Answer
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Score: {score}/{questions.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QuizSection; 