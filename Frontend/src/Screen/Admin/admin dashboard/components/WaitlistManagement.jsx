import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
  Card,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import axiosInstance from '../../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function WaitlistManagement() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/waitlist');
      if (res.data?.success) {
        setEntries(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load waitlist:', err);
      toast.error(err?.response?.data?.message || 'Failed to fetch waitlist entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await axiosInstance.delete(`/waitlist/${deleteTarget._id}`);
      if (res.data?.success) {
        toast.success('Waitlist entry removed.');
        setEntries((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete entry.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast.info('Email copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (entries.length === 0) {
      toast.warn('No entries to export.');
      return;
    }
    const headers = ['#', 'Company Name', 'Owner / Director', 'Email Address', 'Phone Number', 'Registered At'];
    const rows = entries.map((item, index) => [
      index + 1,
      `"${(item.companyName || '').replace(/"/g, '""')}"`,
      `"${(item.ownerName || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : ''}"`,
    ]);

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `odra_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Waitlist CSV exported successfully!');
  };

  // Filtered by search term
  const filtered = entries.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.companyName && item.companyName.toLowerCase().includes(q)) ||
      (item.ownerName && item.ownerName.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q))
    );
  });

  // Stats calculation
  const totalCount = entries.length;
  const todayObj = new Date();
  const todayDateStr = todayObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const todayCount = entries.filter((e) => {
    if (!e.createdAt) return false;
    const d = new Date(e.createdAt);
    return (
      d.getDate() === todayObj.getDate() &&
      d.getMonth() === todayObj.getMonth() &&
      d.getFullYear() === todayObj.getFullYear()
    );
  }).length;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, mt: 1 }}>
      {/* ── Page Header ── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' } }}>
              Waitlist Registrations
            </Typography>
            <Chip
              label={`${totalCount} Total`}
              size="small"
              sx={{
                bgcolor: '#ff5500',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View and manage all early-access registered users and construction companies.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={fetchWaitlist}
            disabled={loading}
            sx={{
              flex: { xs: 1, sm: 'none' },
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: '#ff5500', color: '#ff5500' },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={handleExportCSV}
            sx={{
              flex: { xs: 1, sm: 'none' },
              backgroundColor: '#ff5500',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#e04b00' },
            }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* ── Stat Summary Cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 85, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff5500',
                flexShrink: 0,
              }}
            >
              <PeopleAltRoundedIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Waitlisted
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {totalCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                flexShrink: 0,
              }}
            >
              <EventAvailableRoundedIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                Joined Today ({todayDateStr})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {todayCount}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ── Search & Filter Bar ── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 2,
          gap: 1.5,
        }}
      >
        <TextField
          size="small"
          placeholder="Search by company, owner, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 400, md: 450 }, bgcolor: 'background.paper', borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          Showing <strong>{filtered.length}</strong> of {totalCount}
        </Typography>
      </Box>

      {/* ── Mobile Card View (xs / sm) ── */}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={36} sx={{ color: '#ff5500', mb: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Loading waitlist registrations...
              </Typography>
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                No waitlist entries found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {search ? 'Try adjusting your search query.' : 'New pre-launch waitlist registrations will show up here.'}
              </Typography>
            </Box>
          ) : (
            filtered.map((row, index) => (
              <Card key={row._id} variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                {/* Card Header: avatar + company + index + delete */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        backgroundColor: 'rgba(255, 85, 0, 0.08)',
                        color: '#ff5500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {(row.companyName || 'C').charAt(0).toUpperCase()}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', lineHeight: 1.2 }}>
                        {row.companyName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        #{index + 1}
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Delete entry">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(row)}
                      sx={{ '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {/* Contact details */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleAltRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                      {row.ownerName || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                    <Typography
                      component="a"
                      href={`mailto:${row.email}`}
                      variant="body2"
                      sx={{
                        color: '#ff5500',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                        wordBreak: 'break-all',
                        flex: 1,
                      }}
                    >
                      {row.email}
                    </Typography>
                    <Tooltip title={copiedId === row._id ? 'Copied!' : 'Copy email'}>
                      <IconButton size="small" onClick={() => handleCopyEmail(row.email, row._id)} sx={{ p: 0.5, flexShrink: 0 }}>
                        <ContentCopyRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {row.phone || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Box>
      ) : (
        /* ── Desktop Table View (md+) ── */
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
          <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'background.paper', color: 'text.secondary' } }}>
                  <TableCell width="60">#</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Registered At</TableCell>
                  <TableCell align="center" width="80">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={36} sx={{ color: '#ff5500', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Loading waitlist registrations...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                        No waitlist entries found
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {search ? 'Try adjusting your search query.' : 'New pre-launch waitlist registrations will show up here.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              backgroundColor: 'rgba(255, 85, 0, 0.08)',
                              color: '#ff5500',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {(row.companyName || 'C').charAt(0).toUpperCase()}
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'text.primary' }}>
                            {row.companyName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontSize: '0.9rem', color: 'text.primary', fontWeight: 500 }}>
                          {row.ownerName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            component="a"
                            href={`mailto:${row.email}`}
                            sx={{
                              fontSize: '0.88rem',
                              color: '#ff5500',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {row.email}
                          </Typography>
                          <Tooltip title={copiedId === row._id ? 'Copied!' : 'Copy email'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyEmail(row.email, row._id)}
                              sx={{ p: 0.5 }}
                            >
                              <ContentCopyRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontSize: '0.88rem', color: 'text.primary', fontWeight: 500 }}>
                          {row.phone || 'N/A'}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : 'N/A'}
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Delete entry">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(row)}
                            sx={{ '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Remove from Waitlist?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{' '}
            <strong>{deleteTarget?.companyName}</strong> ({deleteTarget?.email}) from the pre-launch waitlist? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Remove Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
