import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  ExpandMore,
  Description,
  Search,
  Psychology,
} from "@mui/icons-material";

const ResultDisplay = ({ result }) => {
  const getMethodIcon = (method) => {
    switch (method) {
      case "document":
        return <Description />;
      case "web_search":
        return <Search />;
      default:
        return <Psychology />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "document":
        return "primary";
      case "web_search":
        return "secondary";
      default:
        return "default";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return "success";
    if (confidence >= 0.4) return "warning";
    return "error";
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Response</Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              icon={getMethodIcon(result.method)}
              label={result.method.replace("_", " ").toUpperCase()}
              color={getMethodColor(result.method)}
              size="small"
            />
            <Box sx={{ minWidth: 100 }}>
              <Typography variant="body2" color="text.secondary">
                Confidence: {Math.round(result.confidence * 100)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.confidence * 100}
                color={getConfidenceColor(result.confidence)}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
        >
          {result.answer}
        </Typography>
      </Paper>

      {result.sources && result.sources.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              Sources ({result.sources.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {result.sources.map((source, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={source.source}
                        size="small"
                        color={
                          source.source === "document" ? "primary" : "secondary"
                        }
                      />
                      <Typography variant="body2" color="text.secondary">
                        Score: {Math.round(source.score * 100)}%
                      </Typography>
                    </Box>
                    <Typography variant="body2">{source.text}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default ResultDisplay;
