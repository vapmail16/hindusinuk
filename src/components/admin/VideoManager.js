import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, TextField,
  Grid, Card, CardMedia, CardContent, CardActions,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videosRef = collection(db, 'youtubeVideos');
      const snapshot = await getDocs(videosRef);
      const videosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videosData);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddVideo = async () => {
    try {
      const videoId = extractVideoId(newVideoUrl);
      if (!videoId) {
        setError('Invalid YouTube URL');
        return;
      }

      const videoData = {
        title: newVideoTitle,
        url: newVideoUrl,
        videoId: videoId,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'youtubeVideos'), videoData);
      setAddDialogOpen(false);
      setNewVideoUrl('');
      setNewVideoTitle('');
      fetchVideos();
    } catch (err) {
      setError('Failed to add video');
      console.error(err);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteDoc(doc(db, 'youtubeVideos', videoId));
      fetchVideos();
    } catch (err) {
      setError('Failed to delete video');
      console.error(err);
    }
  };

  const getEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${window.location.origin}&enablejsapi=1`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          YouTube Video Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ mb: 4 }}
        >
          Add New Video
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {video.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton 
                      onClick={() => setPlayingVideo(video)}
                      color="primary"
                    >
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteVideo(video.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add Video Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Video Title"
            fullWidth
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="YouTube URL"
            fullWidth
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            helperText="Enter the full YouTube video URL"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVideo} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog
        open={!!playingVideo}
        onClose={() => setPlayingVideo(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            maxWidth: '800px',
            margin: '16px'
          }
        }}
      >
        {playingVideo && (
          <>
            <DialogTitle>{playingVideo.title}</DialogTitle>
            <DialogContent>
              <Box 
                sx={{ 
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  bgcolor: 'black',
                  overflow: 'hidden'
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src={getEmbedUrl(playingVideo.videoId)}
                  title={playingVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setPlayingVideo(null);
                }}
                variant="contained"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  window.open(`https://www.youtube.com/watch?v=${playingVideo.videoId}`, '_blank');
                }}
                color="primary"
              >
                Watch on YouTube
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default VideoManager; 