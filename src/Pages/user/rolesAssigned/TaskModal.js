import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import { useDispatch, useSelector } from "react-redux"
import { createTask, updateTask } from "../../../actions/taskAction"
import { getAllTaskGroups } from "../../../actions/taskGroupAction"
import { CREATE_TASK_RESET, UPDATE_TASK_RESET } from "../../../constants/taskConstants"
import TaskGroupModal from "./TaskGroupModal"

const TaskModal = ({ open, handleClose, refreshTasks, taskToEdit = null }) => {
  const dispatch = useDispatch()
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskGroup, setTaskGroup] = useState("")
  const [openGroupModal, setOpenGroupModal] = useState(false)
  const [errors, setErrors] = useState({})

  const { loading: createLoading, success: createSuccess } = useSelector((state) => state.newTask)
  const { loading: updateLoading, isUpdated } = useSelector((state) => state.taskUpdateDelete)
  const { taskGroups, loading: groupsLoading } = useSelector((state) => state.allTaskGroups)

  const isEditMode = !!taskToEdit
  const loading = createLoading || updateLoading
  const success = createSuccess || isUpdated

  // Load task groups when component mounts
  useEffect(() => {
    dispatch(getAllTaskGroups())
  }, [dispatch])

  // Set form values when editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.taskName || "")
      setTaskDescription(taskToEdit.taskDescription || "")
      setTaskGroup(taskToEdit.taskGroup || "")
    } else {
      resetForm()
    }
  }, [taskToEdit, open])

  // Handle success response
  useEffect(() => {
    if (success) {
      handleClose()
      refreshTasks()

      // Reset appropriate state based on operation
      if (createSuccess) {
        dispatch({ type: CREATE_TASK_RESET })
      } else if (isUpdated) {
        dispatch({ type: UPDATE_TASK_RESET })
      }

      resetForm()
    }
  }, [success, dispatch, handleClose, refreshTasks, createSuccess, isUpdated])

  const resetForm = () => {
    setTaskName("")
    setTaskDescription("")
    setTaskGroup("")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!taskName.trim()) newErrors.taskName = "Task name is required"
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const taskData = {
      taskName,
      taskDescription,
      taskGroup: taskGroup || "Others",
    }

    if (isEditMode) {
      dispatch(updateTask(taskToEdit._id, taskData))
    } else {
      dispatch(createTask(taskData))
    }
  }

  const handleOpenGroupModal = () => {
    setOpenGroupModal(true)
  }

  const handleCloseGroupModal = () => {
    setOpenGroupModal(false)
    dispatch(getAllTaskGroups())
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className="task-modal">
        <DialogTitle className="modal-title">
          {isEditMode ? "Update Task" : "Add New Task"}
          <IconButton aria-label="close" onClick={handleClose} className="close-button">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="taskName"
              label="Task Name"
              name="taskName"
              autoFocus
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              error={!!errors.taskName}
              helperText={errors.taskName}
              className="form-field"
            />
            <TextField
              margin="normal"
              fullWidth
              id="taskDescription"
              label="Task Description"
              name="taskDescription"
              multiline
              rows={4}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="form-field"
            />
            <Box className="group-selector-container">
              <FormControl fullWidth className="group-selector">
                <InputLabel id="task-group-label">Task Group</InputLabel>
                <Select
                  labelId="task-group-label"
                  id="taskGroup"
                  value={taskGroup}
                  label="Task Group"
                  onChange={(e) => setTaskGroup(e.target.value)}
                  disabled={groupsLoading}
                >
                  <MenuItem value="">
                    <em>None (Others)</em>
                  </MenuItem>
                  {taskGroups &&
                    taskGroups.map((group) => (
                      <MenuItem key={group._id} value={group.groupName}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" className="add-group-button" onClick={handleOpenGroupModal}>
                <AddIcon />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="submit-button" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : isEditMode ? "Update Task" : "Add Task"}
          </Button>
        </DialogActions>
      </Dialog>

      <TaskGroupModal open={openGroupModal} handleClose={handleCloseGroupModal} />
    </>
  )
}

export default TaskModal