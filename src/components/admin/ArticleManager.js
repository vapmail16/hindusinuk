import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  IconButton,
  Alert
} from '@mui/material';
import { db } from '../../config/firebase';
import { 
  collection, getDocs, deleteDoc, doc, 
  updateDoc, query, where, orderBy, limit, 
  startAfter, endBefore, limitToLast 
} from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from '../common/ConfirmDialog';

const ArticleManager = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [selectedGod, setSelectedGod] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, story: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, storyId: null });
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState(null);
  const storiesPerPage = 5;

  const HINDU_GODS = [
    'Ganesha', 'Krishna', 'Shiva', 'Hanuman', 'Rama',
    'Durga', 'Lakshmi', 'Saraswati', 'Vishnu', 'Kali'
  ];

  // Debug function
  const debugFetchStories = async () => {
    try {
      const storiesRef = collection(db, 'stories');
      const snapshot = await getDocs(storiesRef);
      console.log('Total stories found:', snapshot.size);
      snapshot.forEach(doc => {
        console.log('Story:', { id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('Debug Error:', error);
    }
  };

  // Fetch stories with pagination and filtering
  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let storiesRef = collection(db, 'stories');
      let allStories = [];

      if (selectedGod) {
        // Get stories for selected god
        const godQuery = query(
          storiesRef,
          where('god', '==', selectedGod)  // Don't transform case
        );
        
        const godSnapshot = await getDocs(godQuery);
        allStories = godSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
      } else {
        // Get all stories
        const snapshot = await getDocs(storiesRef);
        allStories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
      }

      // Sort stories by createdAt
      allStories.sort((a, b) => b.createdAt - a.createdAt);

      if (allStories.length === 0) {
        console.log('No stories found');
        setStories([]);
        setTotalPages(0);
        return;
      }

      console.log('All stories:', allStories.map(s => ({ god: s.god, theme: s.theme })));

      // Calculate total pages
      setTotalPages(Math.ceil(allStories.length / storiesPerPage));

      // Get current page stories
      const startIndex = (page - 1) * storiesPerPage;
      const endIndex = startIndex + storiesPerPage;
      setStories(allStories.slice(startIndex, endIndex));

    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debugFetchStories(); // Debug call
    fetchStories();
  }, [selectedGod, page]);

  // Handle edit story
  const handleEdit = (story) => {
    setEditDialog({ open: true, story });
    setEditedContent(story.content);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'stories', editDialog.story.id), {
        content: editedContent
      });
      setEditDialog({ open: false, story: null });
      fetchStories();
    } catch (error) {
      console.error('Error updating story:', error);
      setError('Failed to update story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete story
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'stories', deleteDialog.storyId));
      setDeleteDialog({ open: false, storyId: null });
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
      setError('Failed to delete story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Story Manager
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* God Filter Buttons */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter stories by God:
          </Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant={!selectedGod ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedGod('');
                  setPage(1);
                }}
              >
                All
              </Button>
            </Grid>
            {HINDU_GODS.map((god) => (
              <Grid item key={god}>
                <Button
                  variant={selectedGod === god ? "contained" : "outlined"}
                  onClick={() => {
                    setSelectedGod(god);
                    setPage(1);
                  }}
                >
                  {god}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stories Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : stories.length === 0 ? (
          <Alert severity="info">
            No stories found {selectedGod && `for ${selectedGod}`}
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {stories.map((story) => (
                <Grid item xs={12} key={story.id}>
                  <Paper sx={{ p: 3, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
                      <IconButton onClick={() => handleEdit(story)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, storyId: story.id })} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {story.god} - {story.theme}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Story #{story.storyNumber} • Created: {story.createdAt.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {story.content}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, story: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Story</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, story: null })}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, storyId: null })}
        onConfirm={handleDelete}
        title="Delete Story"
        content="Are you sure you want to delete this story? This action cannot be undone."
      />
    </Container>
  );
};

export default ArticleManager; 