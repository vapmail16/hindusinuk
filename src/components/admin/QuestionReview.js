import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Button, Checkbox, Snackbar, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { db } from '../../config/firebase';
import { 
  collection, query, getDocs, updateDoc, doc, 
  where, orderBy, writeBatch, deleteDoc
} from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const QuestionReview = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    reviewStatus: 'pending'
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, questionId: null, bulk: false });

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'quizQuestions'));
      
      // Apply filters
      if (filters.level !== 'all') {
        q = query(q, where('level', '==', parseInt(filters.level)));
      }
      if (filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.reviewStatus !== 'all') {
        q = query(q, where('reviewStatus', '==', filters.reviewStatus));
      }
      
      console.log('Fetching questions with filters:', filters);
      const snapshot = await getDocs(q);
      console.log('Found', snapshot.docs.length, 'questions');
      
      const questionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Processed questions:', questionsData);
      setQuestions(questionsData);
      
      if (questionsData.length === 0) {
        setMessage({ 
          text: 'No questions found. Try adjusting filters or generate some questions.',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage({ 
        text: `Error fetching questions: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedQuestions(questions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleSelect = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleBulkApprove = async () => {
    try {
      const batch = writeBatch(db);
      selectedQuestions.forEach(id => {
        const ref = doc(db, 'quizQuestions', id);
        batch.update(ref, { 
          approved: true,
          reviewStatus: 'approved',
          reviewedAt: new Date()
        });
      });
      await batch.commit();
      setMessage({ text: 'Questions approved successfully!', type: 'success' });
      fetchQuestions();
      setSelectedQuestions([]);
    } catch (error) {
      console.error('Error approving questions:', error);
      setMessage({ text: 'Error approving questions', type: 'error' });
    }
  };

  const handleDelete = (questionId) => {
    setDeleteDialog({ open: true, questionId, bulk: false });
  };

  const handleBulkDelete = () => {
    setDeleteDialog({ open: true, questionId: null, bulk: true });
  };

  const confirmDelete = async () => {
    try {
      if (deleteDialog.bulk) {
        const batch = writeBatch(db);
        selectedQuestions.forEach(id => {
          const ref = doc(db, 'quizQuestions', id);
          batch.delete(ref);
        });
        await batch.commit();
        setSelectedQuestions([]);
      } else {
        await deleteDoc(doc(db, 'quizQuestions', deleteDialog.questionId));
      }
      
      setMessage({ 
        text: `Question${deleteDialog.bulk ? 's' : ''} deleted successfully!`, 
        type: 'success' 
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage({ 
        text: `Error deleting question${deleteDialog.bulk ? 's' : ''}: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setDeleteDialog({ open: false, questionId: null, bulk: false });
    }
  };

  const handleEdit = (question) => {
    setCurrentQuestion(question);
    setOpenDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, 'quizQuestions', currentQuestion.id), {
        ...currentQuestion,
        updatedAt: new Date()
      });
      setMessage({ text: 'Question updated successfully!', type: 'success' });
      fetchQuestions();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating question:', error);
      setMessage({ text: 'Error updating question', type: 'error' });
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Question Review Dashboard
        </Typography>

        {/* Generate Questions Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setMessage({ text: 'Generating questions... Please wait.', type: 'info' });
              // You can call your generate questions function here
              // For now, just refresh the page
              window.location.href = '/admin/questions';
            }}
          >
            Generate New Questions
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Level</InputLabel>
            <Select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              label="Level"
            >
              <MenuItem value="all">All</MenuItem>
              {[1, 2, 3, 4, 5].map(level => (
                <MenuItem key={level} value={level}>Level {level}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              label="Category"
            >
              <MenuItem value="all">All</MenuItem>
              {['mythology', 'culture', 'festival', 'history'].map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.reviewStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, reviewStatus: e.target.value }))}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Bulk Actions */}
        {selectedQuestions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleBulkApprove}
              sx={{ mr: 1 }}
            >
              Approve Selected ({selectedQuestions.length})
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleBulkDelete}
              startIcon={<DeleteIcon />}
            >
              Delete Selected ({selectedQuestions.length})
            </Button>
          </Box>
        )}

        {/* Questions Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={selectedQuestions.length === questions.length}
                    indeterminate={selectedQuestions.length > 0 && selectedQuestions.length < questions.length}
                  />
                </TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">
                      No questions found. Try adjusting filters or generate some questions.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleSelect(question.id)}
                      />
                    </TableCell>
                    <TableCell>{question.question}</TableCell>
                    <TableCell>Level {question.level}</TableCell>
                    <TableCell>{question.category}</TableCell>
                    <TableCell>{question.reviewStatus}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleEdit(question)}
                        sx={{ mr: 1 }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                        onClick={() => handleDelete(question.id)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogContent>
            {currentQuestion && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Question"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value
                  })}
                  margin="normal"
                />
                
                {currentQuestion.options.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = {
                          ...option,
                          text: e.target.value
                        };
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: newOptions
                        });
                      }}
                    />
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(e) => {
                        const newOptions = currentQuestion.options.map((opt, i) => ({
                          ...opt,
                          isCorrect: i === index ? e.target.checked : false
                        }));
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: newOptions
                        });
                      }}
                    />
                  </Box>
                ))}

                <TextField
                  fullWidth
                  label="Explanation"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    explanation: e.target.value
                  })}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, questionId: null, bulk: false })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              {deleteDialog.bulk 
                ? `Are you sure you want to delete ${selectedQuestions.length} questions?` 
                : 'Are you sure you want to delete this question?'
              }
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, questionId: null, bulk: false })}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!message.text}
          autoHideDuration={6000}
          onClose={() => setMessage({ text: '', type: 'success' })}
        >
          <Alert severity={message.type} sx={{ width: '100%' }}>
            {message.text}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default QuestionReview; 