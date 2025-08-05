import React, { useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import DocumentUpload from "./components/DocumentUpload";
import QueryInterface from "./components/QueryInterface";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Document Q&A & Web Search
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Upload Documents" />
            <Tab label="Ask Questions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DocumentUpload onUploadSuccess={() => setDocumentsUploaded(true)} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <QueryInterface documentsAvailable={documentsUploaded} />
        </TabPanel>
      </Box>
    </Container>
  );
}

export default App;
