"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import JobCard from "@/components/JobCard";
import { useState, useEffect } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { jobService, Job, JobSearchParams } from "@/services/jobService";

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    query: "",
    location: "",
    type: "",
    experienceLevel: "",
    salary: "",
    page: 1,
    limit: 10,
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const result = await jobService.searchJobs(searchParams);
      setJobs(result.jobs);
      setTotalJobs(result.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams, page]);

  const handleFilterClick = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({
      ...prev,
      query: event.target.value,
      page: 1,
    }));
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({
      ...prev,
      location: event.target.value,
      page: 1,
    }));
  };

  const handleJobTypeChange = (event: SelectChangeEvent<string>) => {
    setSearchParams((prev) => ({
      ...prev,
      type: event.target.value,
      page: 1,
    }));
  };

  const handleExperienceChange = (event: SelectChangeEvent<string>) => {
    setSearchParams((prev) => ({
      ...prev,
      experienceLevel: event.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    setSearchParams((prev) => ({
      ...prev,
      page: value,
    }));
  };

  return (
    <Box>
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold mb-2">
          Find Your Dream Job
        </Typography>
        <Typography color="text.secondary">
          Browse through thousands of job opportunities
        </Typography>
      </Box>

      {/* Quick Filters */}
      <Box className="mb-6">
        <Typography
          variant="subtitle1"
          className="font-semibold mb-3 flex items-center gap-2"
        >
          <FilterListIcon /> Quick Filters
        </Typography>
        <Box className="flex flex-wrap gap-2">
          {[
            "Remote",
            "Full-time",
            "Entry Level",
            "Tech",
            "Marketing",
            "Design",
          ].map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => handleFilterClick(filter)}
              color={selectedFilters.includes(filter) ? "primary" : "default"}
              variant={selectedFilters.includes(filter) ? "filled" : "outlined"}
              className="hover:bg-primary/5"
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper className="p-4 sticky top-24">
            <Box className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                Filters
              </Typography>
              {selectedFilters.length > 0 && (
                <Button
                  startIcon={<ClearIcon />}
                  size="small"
                  onClick={() => setSelectedFilters([])}
                >
                  Clear All
                </Button>
              )}
            </Box>

            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Search"
                placeholder="Job title or keywords"
                value={searchParams.query}
                onChange={handleSearch}
              />

              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  label="Job Type"
                  value={searchParams.type}
                  onChange={handleJobTypeChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  label="Experience Level"
                  value={searchParams.experienceLevel}
                  onChange={handleExperienceChange}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="Entry">Entry Level</MenuItem>
                  <MenuItem value="Mid">Mid Level</MenuItem>
                  <MenuItem value="Senior">Senior Level</MenuItem>
                  <MenuItem value="Lead">Lead</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Location"
                placeholder="City, State, or Remote"
                value={searchParams.location}
                onChange={handleLocationChange}
              />

              <TextField
                fullWidth
                label="Salary Range"
                placeholder="e.g., $50,000 - $100,000"
                value={searchParams.salary}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    salary: e.target.value,
                  }))
                }
              />

              <Divider className="my-4" />

              <Typography variant="subtitle2" className="font-semibold mb-2">
                Skills
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {["React", "Node.js", "Python", "Java", "AWS", "UI/UX"].map(
                  (skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onClick={() => handleFilterClick(skill)}
                      color={
                        selectedFilters.includes(skill) ? "primary" : "default"
                      }
                      variant={
                        selectedFilters.includes(skill) ? "filled" : "outlined"
                      }
                      className="hover:bg-primary/5"
                    />
                  )
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Job Listings */}
        <Grid item xs={12} md={9}>
          <Box className="space-y-4">
            {loading ? (
              <Box className="flex justify-center items-center h-64">
                <CircularProgress />
              </Box>
            ) : jobs.length > 0 ? (
              <>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                <Box className="flex justify-center mt-8">
                  <Pagination
                    count={Math.ceil(totalJobs / 10)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </>
            ) : (
              <Box className="text-center py-12">
                <Typography variant="h6" color="text.secondary">
                  No jobs found. Try adjusting your filters.
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
