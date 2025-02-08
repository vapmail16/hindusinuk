import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Typography, Box, Tabs, Tab,
  CircularProgress
} from '@mui/material';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Leaderboard = ({ open, onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchLeaderboardData();
    }
  }, [open, currentTab]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user progress collection
      const progressRef = collection(db, 'userProgress');
      let q;
      
      if (currentTab === 0) {
        // Overall leaderboard
        q = query(
          progressRef,
          orderBy('totalScore', 'desc'),
          limit(10)
        );
      } else {
        // Level specific leaderboard
        q = query(
          progressRef,
          orderBy(`levels.${currentTab}.score`, 'desc'),
          limit(10)
        );
      }

      const snapshot = await getDocs(q);
      
      // Get user details for each progress entry
      const leaderboardEntries = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const progressData = doc.data();
          // Get user data from users collection
          const userRef = collection(db, 'users');
          const userQuery = query(userRef, where('uid', '==', doc.id));
          const userSnapshot = await getDocs(userQuery);
          const userData = userSnapshot.docs[0]?.data() || {};

          return {
            userId: doc.id,
            displayName: userData.displayName || 'Anonymous User',
            totalScore: progressData.totalScore || 0,
            levelScore: currentTab === 0 
              ? progressData.totalScore 
              : progressData.levels?.[currentTab]?.score || 0
          };
        })
      );

      setLeaderboardData(leaderboardEntries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Leaderboard</DialogTitle>
      <DialogContent>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Overall" />
          {[1, 2, 3, 4, 5].map(level => (
            <Tab key={level} label={`Level ${level}`} />
          ))}
        </Tabs>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" p={3}>
            {error}
          </Typography>
        ) : leaderboardData.length === 0 ? (
          <Typography align="center" p={3}>
            No scores yet. Be the first to complete this level!
          </Typography>
        ) : (
          <List>
            {leaderboardData.map((user, index) => (
              <ListItem key={user.userId}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: index < 3 
                        ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] 
                        : 'grey.400'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`Score: ${user.levelScore}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard; 