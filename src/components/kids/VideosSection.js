import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia,
  Button, Grid, CircularProgress, Pagination,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useAuth } from '../../contexts/AuthContext';

const VideosSection = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const videosPerPage = 6;

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videosRef = collection(db, 'youtubeVideos');
      
      // First, get total count for pagination
      const totalSnapshot = await getDocs(videosRef);
      setTotalPages(Math.ceil(totalSnapshot.size / videosPerPage));
      
      let q;
      if (page === 1) {
        // First page query
        q = query(
          videosRef,
          orderBy('createdAt', 'desc'),
          limit(videosPerPage)
        );
      } else {
        // Subsequent pages query
        q = query(
          videosRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(videosPerPage)
        );
      }
      
      const snapshot = await getDocs(q);
      
      // Store the last document for next pagination
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);

      const videosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${window.location.origin}&enablejsapi=1`;
  };

  // Update the pagination handler
  const handlePageChange = async (event, newPage) => {
    // If going back to page 1, reset lastDoc
    if (newPage === 1) {
      setLastDoc(null);
    }
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVideoClick = (video) => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    setPlayingVideo(video);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Box 
        sx={{ 
          mb: 8, 
          display: 'flex', 
          alignItems: 'center',
          gap: 2 
        }}
      >
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        <Typography variant="h4" component="h2" color="primary">
          Learning Videos
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
      </Box>

      <Card 
        sx={{ 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/om-symbol-light.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.1,
            zIndex: 0
          }
        }}
      >
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Educational Videos
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Watch and learn about Hindu culture, gods, and traditions
          </Typography>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={2} key={video.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    position: 'relative',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      cursor: 'pointer',
                      '& .login-overlay': {
                        opacity: user ? 0 : 0.9
                      }
                    }
                  }}
                  onClick={() => handleVideoClick(video)}
                >
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
                          Click to sign in and watch the video
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {video.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 2
                      }}
                    >
                      <PlayCircleOutlineIcon color="primary" sx={{ fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>

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
                <Typography>• Watch educational videos</Typography>
                <Typography>• Track your progress</Typography>
                <Typography>• Access all features</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setLoginPromptOpen(false)}
                variant="contained"
              >
                Got it
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

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
                  paddingTop: '56.25%',
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
              <Button onClick={() => setPlayingVideo(null)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default VideosSection; 