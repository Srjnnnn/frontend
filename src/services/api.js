import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for LLM responses
});

export const uploadDocuments = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post("/upload-documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const submitQuery = async (queryData) => {
  const response = await api.post("/query", queryData);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};
