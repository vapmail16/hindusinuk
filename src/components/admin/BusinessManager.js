import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import BusinessForm from './BusinessForm';
import ConfirmDialog from '../common/ConfirmDialog';

const BusinessManager = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const q = query(collection(db, 'businesses'));
      const snapshot = await getDocs(q);
      const businessList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBusinesses(businessList);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'businesses', id));
      await fetchBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
    setOpenDelete(false);
  };

  const handleToggleFeatured = async (business) => {
    try {
      await updateDoc(doc(db, 'businesses', business.id), {
        isFeatured: !business.isFeatured
      });
      await fetchBusinesses();
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const handleApprove = async (business) => {
    try {
      await updateDoc(doc(db, 'businesses', business.id), {
        status: 'approved',
        updatedAt: new Date()
      });
      await fetchBusinesses();
    } catch (error) {
      console.error('Error approving business:', error);
    }
  };

  const handleReject = async (business) => {
    try {
      await updateDoc(doc(db, 'businesses', business.id), {
        status: 'rejected',
        updatedAt: new Date()
      });
      await fetchBusinesses();
    } catch (error) {
      console.error('Error rejecting business:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Manage Businesses</Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setSelectedBusiness(null);
            setOpenForm(true);
          }}
        >
          Add New Business
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell>{business.name}</TableCell>
                <TableCell>
                  <Chip label={business.category} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={business.status === 'pending' ? 'Pending' : business.status === 'approved' ? 'Approved' : 'Rejected'}
                    color={business.status === 'pending' ? 'warning' : business.status === 'approved' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small"
                    onClick={() => handleToggleFeatured(business)}
                  >
                    {business.isFeatured ? <StarIcon color="primary" /> : <StarBorderIcon />}
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  {business.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleApprove(business)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleReject(business)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <IconButton 
                    size="small"
                    onClick={() => handleEdit(business)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => {
                      setDeleteId(business.id);
                      setOpenDelete(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <BusinessForm 
          business={selectedBusiness}
          onClose={() => {
            setOpenForm(false);
            fetchBusinesses();
          }}
        />
      </Dialog>

      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Business"
        content="Are you sure you want to delete this business? This action cannot be undone."
      />
    </Container>
  );
};

export default BusinessManager; 