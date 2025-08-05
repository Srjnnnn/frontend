import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Slider,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Send, Search, Description } from "@mui/icons-material";
import { submitQuery } from "../services/api";
import ResultDisplay from "./ResultDisplay";

const QueryInterface = ({ documentsAvailable }) => {
  const [query, setQuery] = useState("");
  const [useDocuments, setUseDocuments] = useState(true);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await submitQuery({
        query: query.trim(),
        use_documents: useDocuments && documentsAvailable,
        use_web_search: useWebSearch,
        max_tokens: maxTokens,
        temperature: temperature,
      });

      setResult(response);
    } catch (err) {
      setError(err.message || "An error occurred while processing your query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Ask Questions
      </Typography>

      {!documentsAvailable && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No documents uploaded yet. Upload documents first or enable web search
          to get started.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enter your question here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Search Options
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDocuments}
                  onChange={(e) => setUseDocuments(e.target.checked)}
                  disabled={!documentsAvailable}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Description fontSize="small" />
                  Search uploaded documents
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={useWebSearch}
                  onChange={(e) => setUseWebSearch(e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Search fontSize="small" />
                  Search the web
                </Box>
              }
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Response Settings
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Temperature: {temperature}
              </Typography>
              <Slider
                value={temperature}
                onChange={(e, value) => setTemperature(value)}
                min={0.1}
                max={1.0}
                step={0.1}
                marks={[
                  { value: 0.1, label: "Focused" },
                  { value: 0.7, label: "Balanced" },
                  { value: 1.0, label: "Creative" },
                ]}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Max Tokens: {maxTokens}
              </Typography>
              <Slider
                value={maxTokens}
                onChange={(e, value) => setMaxTokens(value)}
                min={128}
                max={1024}
                step={64}
                marks={[
                  { value: 128, label: "Short" },
                  { value: 512, label: "Medium" },
                  { value: 1024, label: "Long" },
                ]}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={
              loading || !query.trim() || (!useDocuments && !useWebSearch)
            }
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            fullWidth
          >
            {loading ? "Processing..." : "Ask Question"}
          </Button>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && <ResultDisplay result={result} />}
    </Box>
  );
};

export default QueryInterface;
