import { Box, Accordion, AccordionSummary, AccordionDetails, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';

const SidebarAccordion = ({ active, onChange }) => {
  const handleClick = (main, action) => {
    onChange({ main, action });
  };

  const isSelected = (main, action) =>
    active.main === main && active.action === action;

  return (
    <Box sx={{ width: 260, borderRight: '1px solid #e0e0e0', bgcolor: '#fafafa', height: '100%', overflowY: 'auto' }} >
      <Accordion disableGutters square defaultExpanded={active.main === 'privacy'} >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <LockIcon fontSize="small" style={{ marginRight: 8 }} />
          <Typography>개인정보 처리방침</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense>
            <ListItemButton selected={isSelected('privacy', 'edit')} onClick={() => handleClick('privacy', 'edit')} >
              <ListItemText primary="편집" />
            </ListItemButton>
            <ListItemButton selected={isSelected('privacy', 'history')} onClick={() => handleClick('privacy', 'history')} >
              <ListItemText primary="버전 관리" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square defaultExpanded={active.main === 'service'} >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <DescriptionIcon fontSize="small" style={{ marginRight: 8 }} />
          <Typography>이용약관</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }} >
          <List dense>
            <ListItemButton selected={isSelected('service', 'edit')} onClick={() => handleClick('service', 'edit')} >
              <ListItemText primary="편집" />
            </ListItemButton>
            <ListItemButton selected={isSelected('service', 'history')} onClick={() => handleClick('service', 'history')} >
              <ListItemText primary="버전 관리" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square defaultExpanded={active.main === 'credits'} >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <InfoIcon fontSize="small" style={{ marginRight: 8 }} />
          <Typography>크레딧</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }} >
          <List dense>
            <ListItemButton selected={isSelected('credits', 'edit')} onClick={() => handleClick('credits', 'edit')} >
              <ListItemText primary="편집" />
            </ListItemButton>
            <ListItemButton selected={isSelected('credits', 'history')} onClick={() => handleClick('credits', 'history')} >
              <ListItemText primary="버전 관리" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters square defaultExpanded={active.main === 'about'} >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <BusinessIcon fontSize="small" style={{ marginRight: 8 }} />
          <Typography>사업자 정보</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense>
            <ListItemButton selected={isSelected('about', 'edit')} onClick={() => handleClick('about', 'edit')} >
              <ListItemText primary="편집" />
            </ListItemButton>
            <ListItemButton selected={isSelected('about', 'history')} onClick={() => handleClick('about', 'history')} >
              <ListItemText primary="버전 관리" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SidebarAccordion;