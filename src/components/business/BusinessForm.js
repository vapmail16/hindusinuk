import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert
} from '@mui/material';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { prepareBusinessData } from '../../utils/businessUtils';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const CATEGORIES = [
  'Restaurant',
  'Grocery',
  'Fashion',
  'Religious',
  'Health'
];

const initialFormData = {
  name: '',
  description: '',
  category: '',
  address: '',
  contact: {
    phone: '',
    email: '',
    website: ''
  },
  logo: ''
};

const BusinessForm = ({ business, onClose, userId }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(business?.logo || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData(business);
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;
    
    const storage = getStorage();
    const logoRef = ref(storage, `business-logos/${userId}/${Date.now()}-${logoFile.name}`);
    
    await uploadBytes(logoRef, logoFile);
    return getDownloadURL(logoRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let logoUrl = business?.logo;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const businessData = prepareBusinessData({
        ...formData,
        logo: logoUrl
      }, userId);

      if (business?.id) {
        await updateDoc(doc(db, 'businesses', business.id), businessData);
      } else {
        await addDoc(collection(db, 'businesses'), businessData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving business:', error);
      setError('Failed to save business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {business ? 'Edit Business' : 'Add New Business'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            {/* Form fields */}
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Business Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                required
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contact.phone"
                label="Phone"
                fullWidth
                value={formData.contact?.phone || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contact.email"
                label="Email"
                type="email"
                fullWidth
                value={formData.contact?.email || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contact.website"
                label="Website"
                fullWidth
                value={formData.contact?.website || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                {logoPreview && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default BusinessForm;
