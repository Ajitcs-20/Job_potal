"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import { Job } from "@/services/jobService";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`transition-all duration-200 ${
        isHovered ? "border-primary shadow-lg" : "border-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent>
        <Box className="flex justify-between items-start">
          <Box className="flex-1">
            <Typography
              variant="h6"
              component="h2"
              className="font-semibold hover:text-primary cursor-pointer"
            >
              {job.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              className="hover:text-primary cursor-pointer"
            >
              {job.company}
            </Typography>
          </Box>
          <Box className="flex gap-1">
            <Tooltip title="Save Job">
              <IconButton size="small">
                <BookmarkBorderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Job">
              <IconButton size="small">
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box className="mt-4 flex flex-wrap gap-2">
          <Chip
            label={job.type}
            color="primary"
            variant="outlined"
            size="small"
            className="hover:bg-primary/5"
          />
          <Chip
            label={job.location}
            variant="outlined"
            size="small"
            className="hover:bg-primary/5"
          />
          <Chip
            label={job.salary}
            variant="outlined"
            size="small"
            className="hover:bg-primary/5"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" className="mt-4">
          {job.description}
        </Typography>

        <Box className="mt-4 flex flex-wrap gap-2">
          {job.requirements.map((req: string, index: number) => (
            <Chip
              key={index}
              label={req}
              variant="outlined"
              size="small"
              className="hover:bg-primary/5"
            />
          ))}
        </Box>

        <Divider className="my-4" />

        <Box className="flex justify-between items-center">
          <Typography variant="caption" color="text.secondary">
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </Typography>
          <Chip
            label="Urgent Hiring"
            color="error"
            size="small"
            className="hover:bg-error/5"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
