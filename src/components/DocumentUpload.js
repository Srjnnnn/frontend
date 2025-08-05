import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { uploadDocuments } from "../services/api";

const DocumentUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/markdown": [".md"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setUploadStatus(null);
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadDocuments(files);

      if (result.status === "success") {
        setUploadStatus({
          type: "success",
          message: `Successfully processed ${result.processed_documents} documents with ${result.total_chunks} chunks.`,
        });
        onUploadSuccess();
      } else {
        setUploadStatus({
          type: "error",
          message: result.message || "Upload failed",
        });
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadStatus(null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Documents
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.300",
          backgroundColor: isDragActive ? "action.hover" : "background.paper",
          cursor: "pointer",
          textAlign: "center",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? "Drop files here"
            : "Drag & drop files here, or click to select"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: PDF, DOC, DOCX, TXT, MD
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                />
                <Chip label={file.type || "unknown"} size="small" />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading}
              startIcon={
                uploading ? <CircularProgress size={20} /> : <CloudUpload />
              }
            >
              {uploading ? "Processing..." : "Upload & Process"}
            </Button>
            <Button
              variant="outlined"
              onClick={clearFiles}
              disabled={uploading}
            >
              Clear Files
            </Button>
          </Box>
        </Box>
      )}

      {uploadStatus && (
        <Alert
          severity={uploadStatus.type}
          icon={uploadStatus.type === "success" ? <CheckCircle /> : <Error />}
          sx={{ mt: 2 }}
        >
          {uploadStatus.message}
        </Alert>
      )}
    </Box>
  );
};

export default DocumentUpload;
