import api from "./api";

export const saveJob = (jobId) =>
  api.post(`/saved-jobs/${jobId}`);

export const removeSavedJob = (jobId) =>
  api.delete(`/saved-jobs/${jobId}`);

export const getSavedJobs = () =>
  api.get("/saved-jobs");

export const checkSaved = (jobId) =>
  api.get(`/saved-jobs/check/${jobId}`);