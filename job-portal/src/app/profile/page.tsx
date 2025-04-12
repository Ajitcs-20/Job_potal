"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  Edit as EditIcon,
  Upload as UploadIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  profileService,
  Profile,
  Education,
  Experience,
  Skill,
} from "@/services/profileService";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<
    "education" | "experience" | "skills"
  >("education");
  const [newItem, setNewItem] = useState<
    Partial<Education & Experience & Skill>
  >({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [userId] = useState("123"); // TODO: Replace with actual user ID from auth context

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile(userId);
      setProfile(data);
    } catch (error) {
      setError("Failed to load profile");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!profile) return;
      const updatedProfile = await profileService.updateProfile(
        userId,
        profile
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const parseResumeContent = async (file: File) => {
    try {
      setIsParsingResume(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`/api/profile/${userId}/resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();
      const resumeUrl = data.resumeUrl;

      // TODO: Replace with actual resume parsing service
      // For now, we'll simulate parsing with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock parsed data
      const parsedData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 8900",
        location: "New York, USA",
        bio: "Experienced software developer with a passion for building scalable applications.",
        education: [
          {
            id: "1",
            school: "University of Technology",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2018",
            endDate: "2022",
          },
        ],
        experience: [
          {
            id: "1",
            company: "Tech Corp",
            position: "Software Developer",
            startDate: "2022",
            endDate: "Present",
            description:
              "Working on full-stack development using React and Node.js",
          },
        ],
        skills: [
          { id: "1", name: "React", level: "Advanced" as const },
          { id: "2", name: "Node.js", level: "Intermediate" as const },
          { id: "3", name: "TypeScript", level: "Advanced" as const },
        ],
      };

      // Update profile with parsed data
      if (profile) {
        setProfile({
          ...profile,
          ...parsedData,
          resume: resumeUrl,
        });
      }

      setSuccess("Resume uploaded and profile updated successfully");
    } catch (error) {
      setError("Failed to parse resume");
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await parseResumeContent(file);
    }
  };

  const handleAddItem = (type: "education" | "experience" | "skills") => {
    setDialogType(type);
    setNewItem({});
    setOpenDialog(true);
  };

  const handleDeleteItem = async (
    type: "education" | "experience" | "skills",
    id: string
  ) => {
    try {
      if (!profile) return;

      const updatedProfile = await profileService.updateProfile(userId, {
        [type]: profile[type].filter(
          (item: Education | Experience | Skill) => item.id !== id
        ),
      });
      setProfile(updatedProfile);
      setSuccess(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );
    } catch (error) {
      setError(`Failed to delete ${type}`);
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleSaveItem = async () => {
    try {
      if (!profile) return;

      const id = Math.random().toString(36).substr(2, 9);
      const item = { ...newItem, id } as Education | Experience | Skill;

      const updatedProfile = await profileService.updateProfile(userId, {
        [dialogType]: [...profile[dialogType], item],
      });
      setProfile(updatedProfile);
      setOpenDialog(false);
      setNewItem({});
      setSuccess(
        `${
          dialogType.charAt(0).toUpperCase() + dialogType.slice(1)
        } added successfully`
      );
    } catch (error) {
      setError(`Failed to add ${dialogType}`);
      console.error(`Error adding ${dialogType}:`, error);
    }
  };

  const handleRemoveSavedJob = async (jobId: string) => {
    try {
      if (!profile) return;
      await profileService.removeSavedJob(userId, jobId);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              savedJobs: prev.savedJobs.filter((job) => job.id !== jobId),
            }
          : null
      );
      setSuccess("Job removed from saved jobs");
    } catch (error) {
      setError("Failed to remove saved job");
      console.error("Error removing saved job:", error);
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case "education":
        return (
          <>
            <TextField
              fullWidth
              label="School"
              value={newItem.school || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, school: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Degree"
              value={newItem.degree || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, degree: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Field of Study"
              value={newItem.field || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, field: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              value={newItem.startDate || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, startDate: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Date"
              value={newItem.endDate || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, endDate: e.target.value })
              }
              margin="normal"
            />
          </>
        );
      case "experience":
        return (
          <>
            <TextField
              fullWidth
              label="Company"
              value={newItem.company || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, company: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Position"
              value={newItem.position || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, position: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              value={newItem.startDate || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, startDate: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Date"
              value={newItem.endDate || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, endDate: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newItem.description || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              margin="normal"
            />
          </>
        );
      case "skills":
        return (
          <>
            <TextField
              fullWidth
              label="Skill Name"
              value={newItem.name || ""}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Level</InputLabel>
              <Select
                value={newItem.level || ""}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    level: e.target.value as Skill["level"],
                  })
                }
                label="Level"
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography variant="h6" color="error">
          Profile not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 py-8">
      <Paper className="p-6">
        {/* Profile Header */}
        <Box className="flex items-start gap-6 mb-8">
          <Avatar src="/avatar.png" alt={profile.name} className="w-32 h-32" />
          <Box className="flex-1">
            <Box className="flex items-center justify-between">
              <Typography variant="h4" component="h1" className="font-bold">
                {profile.name}
              </Typography>
              <Button
                variant="outlined"
                startIcon={isEditing ? null : <EditIcon />}
                onClick={isEditing ? handleSave : handleEdit}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </Box>
            <Typography color="text.secondary" className="mt-2">
              {profile.email} • {profile.phone}
            </Typography>
            <Typography color="text.secondary">{profile.location}</Typography>
          </Box>
        </Box>

        {/* Bio */}
        <Box className="mb-8">
          <Typography variant="h6" className="font-semibold mb-2">
            About Me
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) =>
                  prev ? { ...prev, bio: e.target.value } : null
                )
              }
            />
          ) : (
            <Typography color="text.secondary">{profile.bio}</Typography>
          )}
        </Box>

        {/* Resume Upload */}
        <Box className="mb-8">
          <Typography variant="h6" className="mb-4">
            Resume
          </Typography>
          <Box className="flex items-center gap-4">
            {profile.resume ? (
              <Link
                href={profile.resume}
                target="_blank"
                className="text-primary hover:underline"
              >
                View Resume
              </Link>
            ) : (
              <Typography color="text.secondary">No resume uploaded</Typography>
            )}
            <Button
              variant="outlined"
              component="label"
              disabled={isParsingResume}
            >
              {isParsingResume ? "Parsing Resume..." : "Upload Resume"}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </Button>
            {isParsingResume && <CircularProgress size={20} className="ml-2" />}
          </Box>
        </Box>

        <Divider className="my-8" />

        {/* Education */}
        <Box className="mb-8">
          <Box className="flex items-center justify-between mb-4">
            <Typography
              variant="h6"
              className="font-semibold flex items-center gap-2"
            >
              <SchoolIcon /> Education
            </Typography>
            <IconButton onClick={() => handleAddItem("education")}>
              <AddIcon />
            </IconButton>
          </Box>
          <List>
            {profile.education.map((edu) => (
              <ListItem
                key={edu.id}
                secondaryAction={
                  isEditing && (
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteItem("education", edu.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={edu.school}
                  secondary={`${edu.degree} in ${edu.field} • ${edu.startDate} - ${edu.endDate}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Experience */}
        <Box className="mb-8">
          <Box className="flex items-center justify-between mb-4">
            <Typography
              variant="h6"
              className="font-semibold flex items-center gap-2"
            >
              <WorkIcon /> Work Experience
            </Typography>
            <IconButton onClick={() => handleAddItem("experience")}>
              <AddIcon />
            </IconButton>
          </Box>
          <List>
            {profile.experience.map((exp) => (
              <ListItem
                key={exp.id}
                secondaryAction={
                  isEditing && (
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteItem("experience", exp.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={`${exp.position} at ${exp.company}`}
                  secondary={`${exp.startDate} - ${exp.endDate}\n${exp.description}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Skills */}
        <Box className="mb-8">
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              Skills
            </Typography>
            <IconButton onClick={() => handleAddItem("skills")}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Chip
                key={skill.id}
                label={`${skill.name} (${skill.level})`}
                onDelete={
                  isEditing
                    ? () => handleDeleteItem("skills", skill.id)
                    : undefined
                }
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        {/* Saved Jobs */}
        <Box>
          <Typography
            variant="h6"
            className="font-semibold flex items-center gap-2 mb-4"
          >
            <BookmarkIcon /> Saved Jobs
          </Typography>
          <List>
            {profile.savedJobs.map((job) => (
              <ListItem
                key={job.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveSavedJob(job.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={job.title}
                  secondary={`${job.company} • ${job.location}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
        </DialogTitle>
        <DialogContent>{renderDialogContent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            disabled={!Object.keys(newItem).length}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
