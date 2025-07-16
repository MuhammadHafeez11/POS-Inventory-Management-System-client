import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useDispatch, useSelector } from "react-redux"
import { createTaskGroup } from "../../../actions/taskGroupAction"
import { CREATE_TASK_GROUP_RESET } from "../../../constants/taskGroupConstant"

const TaskGroupModal = ({ open, handleClose }) => {
  const dispatch = useDispatch()
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState({})

  const { loading, success, error } = useSelector((state) => state.taskGroup)

  useEffect(() => {
    if (success) {
      handleClose()
      dispatch({ type: CREATE_TASK_GROUP_RESET })
      resetForm()
    }
  }, [success, dispatch, handleClose])

  const resetForm = () => {
    setGroupName("")
    setDescription("")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!groupName.trim()) newErrors.groupName = "Group name is required"
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const groupData = {
      groupName,
      description,
    }

    dispatch(createTaskGroup(groupData))
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth className="task-group-modal">
      <DialogTitle className="modal-title">
        Add New Task Group
        <IconButton aria-label="close" onClick={handleClose} className="close-button">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" variant="body2" className="error-message">
            {error}
          </Typography>
        )}
        <Box component="form" noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="groupName"
            label="Group Name"
            name="groupName"
            autoFocus
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            error={!!errors.groupName}
            helperText={errors.groupName}
            className="form-field"
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-field"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="cancel-button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" className="submit-button" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Add Group"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskGroupModal
