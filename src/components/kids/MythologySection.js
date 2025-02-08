import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Card, CardContent, 
  CardActions, Button, CircularProgress, 
  Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions 
} from '@mui/material';
import { kidsContentService } from '../../services/kidsContentService';

const MythologySection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await kidsContentService.getMythologyStories();
      setStories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load stories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setOpenDialog(true);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mythology Stories
      </Typography>

      {stories.map((story, index) => (
        <Card key={index} sx={{ mb: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {story.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {story.content.substring(0, 100)}...
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleStoryClick(story)}>
              Read More
            </Button>
          </CardActions>
        </Card>
      ))}

      {/* Story Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedStory && (
          <>
            <DialogTitle>{selectedStory.title}</DialogTitle>
            <DialogContent>
              <Typography paragraph sx={{ mt: 2 }}>
                {selectedStory.content}
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="primary" 
                sx={{ mt: 2, fontWeight: 'bold' }}
              >
                Moral of the Story:
              </Typography>
              <Typography paragraph>
                {selectedStory.moral}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MythologySection; 