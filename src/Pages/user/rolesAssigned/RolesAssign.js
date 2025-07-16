import { useState, useEffect } from "react"
import Checkbox from "@mui/material/Checkbox"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import PageLoader from "../../../Components/Loader/PageLoader"
import { useSelector, useDispatch } from "react-redux"
import { getTask } from "../../../actions/taskAction"
import { getAssignRolesById, changeAssignRolesById, changeAssignRolesByIdBulk } from "../../../actions/assignTaskAction"
import MetaData from "../../../MetaData"
import Concept from "../../../Components/Side_NavBar/Concept"
import { Loader } from "semantic-ui-react"
import TaskModal from "./TaskModal"
import { getAllTaskGroups } from "../../../actions/taskGroupAction"

const RolesAssign = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [taskPermissions, setTaskPermissions] = useState({})
  const [colorTheme, setColorTheme] = useState("theme-white")
  const [loadData, setLoadData] = useState(false)
  const [groupLoading, setGroupLoading] = useState({})
  const [openTaskModal, setOpenTaskModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const { loading, task } = useSelector((state) => state.task)
  const { taskGroups } = useSelector((state) => state.allTaskGroups)

  useEffect(() => {
    getUserTasks()
    dispatch(getAllTaskGroups())
  }, [])

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("theme-color")
    if (currentThemeColor) {
      setColorTheme(currentThemeColor)
    }
  }, [])

  useEffect(() => {
    if (!loading && task?.length > 0) {
      processTasks()
    }
  }, [loading, task])

  const getUserTasks = async () => {
    try {
      dispatch(getTask())
    } catch (error) {
      console.error("Error fetching tasks: ", error)
    }
  }

  // Process tasks: fetch their permission status and store in state
  const processTasks = async () => {
    const permissionPromises = task?.map((t) => checkRolePermission(t._id))
    const permissions = await Promise.all(permissionPromises)
    const taskPermissionMap = {}
    task?.forEach((t, index) => {
      taskPermissionMap[t._id] = permissions[index]
    })
    setTaskPermissions(taskPermissionMap)
    setTasks(task)
    setLoadData(true)
  }

  const checkRolePermission = async (taskId) => {
    try {
      const roleId = localStorage.getItem("userpermission").replace(/^"|"$/g, "")
      const data = await getAssignRolesById(roleId, taskId)
      return data[0]?.status
    } catch (error) {
      console.error("Error fetching permissions: ", error)
      return false
    }
  }

  const handleCheckBoxChange = async (checked, taskId) => {
    // Update local state immediately
    setTaskPermissions((prev) => ({ ...prev, [taskId]: checked }))
    const roleId = localStorage.getItem("userpermission").replace(/^"|"$/g, "")
    dispatch(changeAssignRolesById(roleId, taskId, checked))
  }

  // Function to check if all tasks in a group are assigned
  const areAllTasksInGroupAssigned = (groupName) => {
    const groupedTasks = groupTasks()
    const tasksInGroup = groupedTasks[groupName] || []
    if (tasksInGroup.length === 0) return false

    return tasksInGroup.every((task) => taskPermissions[task._id] === true)
  }

  // Function to handle group checkbox change
  const handleGroupCheckBoxChange = async (checked, groupName) => {
    const groupedTasks = groupTasks()
    const tasksInGroup = groupedTasks[groupName] || []
    if (tasksInGroup.length === 0) return

    // Set loading state for this group
    setGroupLoading((prev) => ({ ...prev, [groupName]: true }))

    try {
      const roleId = localStorage.getItem("userpermission").replace(/^"|"$/g, "")
      const taskIds = tasksInGroup.map((task) => task._id)

      // Call the bulk update action
      await dispatch(changeAssignRolesByIdBulk(roleId, taskIds, checked))

      // Update local state after successful API call
      const updatedPermissions = { ...taskPermissions }
      tasksInGroup?.forEach((task) => {
        updatedPermissions[task._id] = checked
      })
      setTaskPermissions(updatedPermissions)
    } catch (error) {
      console.error("Error updating group permissions:", error)
    } finally {
      // Clear loading state
      setGroupLoading((prev) => ({ ...prev, [groupName]: false }))
    }
  }

  const handleBack = () => {
    navigate(-1);
  }

  const handleOpenTaskModal = (task = null) => {
    setTaskToEdit(task)
    setOpenTaskModal(true)
  }

  const handleCloseTaskModal = () => {
    setOpenTaskModal(false)
    setTaskToEdit(null)
  }

  // Group tasks based on the defined groups and task groups from database
  const groupTasks = () => {
    const grouped = {}

    // First, use the task groups from the database
    if (taskGroups && taskGroups.length > 0) {
      taskGroups?.forEach((group) => {
        grouped[group.groupName] = []
      })
    }

    // Then, add tasks based on their taskGroup field
    tasks?.forEach((task) => {
      const groupName = task.taskGroup || "Others"
      if (!grouped[groupName]) {
        grouped[groupName] = []
      }

      // Only add if not already in the group
      if (!grouped[groupName].some((t) => t._id === task._id)) {
        grouped[groupName].push(task)
      }
    })

    // For backward compatibility, also check the hardcoded permissions
    taskGroups?.forEach((group) => {
      if (!group.permissions) return

      const permissionTasks = tasks.filter((t) => group?.permissions?.includes(t.taskName))

      if (permissionTasks.length > 0) {
        if (!grouped[group.groupName]) {
          grouped[group.groupName] = []
        }

        // Add only tasks that aren't already in the group
        permissionTasks?.forEach((task) => {
          if (!grouped[group.groupName].some((t) => t._id === task._id)) {
            grouped[group.groupName].push(task)
          }
        })
      }
    })

    // Ensure "Others" group is last
    const othersGroup = grouped["Others"]
    if (othersGroup) {
      delete grouped["Others"]
      grouped["Others"] = othersGroup
    }

    return grouped
  }

  const groupedTasks = groupTasks()

  return (
    <>
      <MetaData title="QE ~~Permissions" />
      <Concept />
      <div className={`roles-assign-container ${colorTheme}`}>
        <div className="roles-assign-content">
          <div className="roles-assign-header">
            <button onClick={handleBack} className="roles-assign-back-button">
              <ArrowBackIcon />
            </button>
            <h3 className="roles-assign-title">
              Assign Permissions (
              <span>{JSON.parse(localStorage.getItem("roleNameForPermissions")).toUpperCase()}</span>)
            </h3>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenTaskModal()}
              className="add-task-button"
            >
              Add Task
            </Button>
          </div>

          <div className="roles-assign-permissions">
            {loadData ? (
              Object.keys(groupedTasks).map((groupName, index) => (
                <div key={`${groupName}-${index}`} className="task-group">
                  <div className="group-header">
                    <h4 className="group-title">{groupName}</h4>
                    <div className="group-checkbox-wrapper">
                      {groupLoading[groupName] ? (
                        <div className="group-loader">
                          <Loader active inline="centered" size="small" />
                        </div>
                      ) : (
                        <Checkbox
                          checked={areAllTasksInGroupAssigned(groupName)}
                          onChange={(e, checked) => handleGroupCheckBoxChange(checked, groupName)}
                          className="group-checkbox"
                        />
                      )}
                    </div>
                  </div>
                  {groupedTasks[groupName].map((data, index) => (
                    <div key={data?._id} className="roles-assign-permission-item">
                      <div className="permission-info">
                        <span className="roles-assign-permission-label">
                          {data?.taskName}
                          {data?.taskDescription && (
                            <span className="task-description-tooltip">{data?.taskDescription}</span>
                          )}
                        </span>
                        <Tooltip title="Edit Task">
                          <IconButton
                            size="small"
                            className="edit-task-button"
                            onClick={() => handleOpenTaskModal(data)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <Checkbox
                        checked={taskPermissions[data?._id] === true}
                        onChange={(e, checked) => handleCheckBoxChange(checked, data?._id)}
                        className="roles-assign-checkbox"
                        disabled={groupLoading[groupName]} // Disable during group operation
                      />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="roles-assign-loader">
                <PageLoader />
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal
        open={openTaskModal}
        handleClose={handleCloseTaskModal}
        refreshTasks={getUserTasks}
        taskToEdit={taskToEdit}
      />
    </>
  )
}

export default RolesAssign

// import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import PageLoader from "../../../Components/Loader/PageLoader";
// import { useSelector, useDispatch } from "react-redux";
// import { getTask } from "../../../actions/taskAction";
// import {
//   getAssignRolesById,
//   changeAssignRolesById,
//   changeAssignRolesByIdBulk, // New bulk action
// } from "../../../actions/assignTaskAction";
// import MetaData from "../../../MetaData";
// import Concept from "../../../Components/Side_NavBar/Concept";
// import { Loader } from "semantic-ui-react";

// // Grouping constant for tasks (modify as needed)
// const taskGroups = [
//   {
//     groupName: "Catalog",
//     permissions: [
//       "View Product",
//        "View Administrator Product Location",
//        "View Product Location",
//        "locationRecordOnlyForAdmin",
//        "locationRecordOnlyForAdministratorAndSuperAdmin",
//         "Add Product",
//          "download Record XLS",
//          "printAvailableRecords",
//          "havePermissionToPrintAvailableProducts",
//          "Can View Catelog",
//          "Update Records",
//          "Delete Records",
//         ],
//   },
//   {
//     groupName: "FBR-Records",
//     permissions: [
//       "Can View FBR-Menu",
//       "View PCTCode",
//       "Add PCTCode",
//       // "View Company",
//       // "Add Company",
//       // "View PCTCode",
//     ]
//   },
//   {
//   groupName: "Purchase Approval",
//   permissions: [
//     "View Purchase Approval",
//     "Print Purchase Invoice"
//   ]
//   },
//   {
//     groupName: "Records",
//     permissions: [
//       "View Color",
//       "View Company",
//       "Add Company",
//       "View Godown",
//       "Add Godown",
//       "Add Shop",
//       "Add Color",
//       "View Shop",
//       "View Product Type",
//       "Add Product Type",
//       "Can View Records",
//       // "Update Records",
//       // "Delete Records"
//     ],
//   },
//   {
//     groupName: "Pendings",
//     permissions: [
//       "View Pending Purchase",
//       "Can View Pendings",
//       "View Pending Sale",
//       "View Pending Transfer",
//     ],
//   },
//   {
//     groupName: "Product Activity",
//     permissions: [
//       "Can View Product Activity",
//       "Can Purchase Product",
//       "Can Sale Product",
//       "Can Transfer Product",
//       "Return Product",
//     ],
//   },
//   {
//     groupName: "Invoices",
//     permissions: [
//       "Can View Invoices",
//       "View Purchase Invoice",
//       "View Sale Invoice",
//       "Return Invoice",
//       "View Transfer Invoice",
//       "View Sale Credit Record",
//       "View Expense Invoice",
//       "View Commission Invoice",
//     ],
//   },
//   {
//     groupName: "Consolidated",
//     permissions: [
//       "Can View Consolidated",
//       "View Consolidated Purchase Invoice",
//       "View Consolidated Sale Invoice",
//       "Return Invoice",
//       "View Consolidated Transfer Invoice",
//       "View Sale Credit Record",
//       "View Consolidated Expense Invoice",
//       // "View Commission Invoice",
//     ],
//   },
//   {
//     groupName: "Cash Management",
//     permissions: [
//       "Can View Cash Management",
//       "Add Expense Type",
//       "Can View Cash WorkFlow",
//       "Can View Cash Deposits",
//       "Add Expense Type",
//       "View Expense Type",
//       "Can Add Expense"
//     ],
//   },
//   {
//     groupName: "Profit",
//     permissions: [
//       "Can View Sale Profit",
//       "Can View Profit"
//     ],
//   },
//   {
//     groupName: "Commission",
//     permissions: [
//       "Can View Commission",
//       "View Commission Report"
//     ],
//   },
//   {
//     groupName: "User",
//     permissions: [
//       "View Users",
//       "Add Users",
//       "View Roles",
//       "Can View Users",
//     ],
//   },
//   {
//     groupName: "Subscription",
//     permissions: ["View Subscription", "Update Subscription"],
//   },
//   // Add more groups if needed...
// ];

// const RolesAssign = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [taskPermissions, setTaskPermissions] = useState({});
//   const [colorTheme, setColorTheme] = useState("theme-white");
//   const [loadData, setLoadData] = useState(false);
//   const [groupLoading, setGroupLoading] = useState({}); // Track loading state for each group
//   const { loading, task } = useSelector((state) => state.task);

//   useEffect(() => {
//     getUserTasks();
//   }, []);

//   useEffect(() => {
//     const currentThemeColor = localStorage.getItem("theme-color");
//     if (currentThemeColor) {
//       setColorTheme(currentThemeColor);
//     }
//   }, []);

//   useEffect(() => {
//     if (!loading && task?.length > 0) {
//       processTasks();
//     }
//   }, [loading, task]);

//   const getUserTasks = async () => {
//     try {
//       dispatch(getTask());
//     } catch (error) {
//       console.error("Error fetching tasks: ", error);
//     }
//   };

//   // Process tasks: fetch their permission status and store in state
//   const processTasks = async () => {
//     const permissionPromises = task?.map((t) => checkRolePermission(t._id));
//     const permissions = await Promise.all(permissionPromises);
//     const taskPermissionMap = {};
//     task.forEach((t, index) => {
//       taskPermissionMap[t._id] = permissions[index];
//     });
//     setTaskPermissions(taskPermissionMap);
//     setTasks(task);
//     setLoadData(true);
//   };

//   const checkRolePermission = async (taskId) => {
//     try {
//       const roleId = localStorage.getItem("userpermission").replace(/^"|"$/g, "");
//       const data = await getAssignRolesById(roleId, taskId);
//       return data[0]?.status;
//     } catch (error) {
//       console.error("Error fetching permissions: ", error);
//       return false;
//     }
//   };

//   const handleCheckBoxChange = async (checked, taskId) => {
//     // Update local state immediately
//     setTaskPermissions((prev) => ({ ...prev, [taskId]: checked }));
//     const roleId = localStorage.getItem("userpermission").replace(/^"|"$/g, "");
//     dispatch(changeAssignRolesById(roleId, taskId, checked));
//   };

//   // New function to check if all tasks in a group are assigned
//   const areAllTasksInGroupAssigned = (groupName) => {
//     const groupedTasks = groupTasks();
//     const tasksInGroup = groupedTasks[groupName] || [];
//     if (tasksInGroup.length === 0) return false;
    
//     return tasksInGroup.every(task => taskPermissions[task._id] === true);
//   };

//   // New function to handle group checkbox change
//   const handleGroupCheckBoxChange = async (checked, groupName) => {
//     const groupedTasks = groupTasks();
//     const tasksInGroup = groupedTasks[groupName] || [];
//     if (tasksInGroup.length === 0) return;
    
//     // Set loading state for this group
//     setGroupLoading(prev => ({ ...prev, [groupName]: true }));
    
//     try {
//       const roleId = localStorage.getItem("userpermission").replace(/^"|"$/g, "");
//       const taskIds = tasksInGroup.map(task => task._id);
      
//       // Call the bulk update action
//       await dispatch(changeAssignRolesByIdBulk(roleId, taskIds, checked));
      
//       // Update local state after successful API call
//       const updatedPermissions = { ...taskPermissions };
//       tasksInGroup.forEach(task => {
//         updatedPermissions[task._id] = checked;
//       });
//       setTaskPermissions(updatedPermissions);
//     } catch (error) {
//       console.error("Error updating group permissions:", error);
//     } finally {
//       // Clear loading state
//       setGroupLoading(prev => ({ ...prev, [groupName]: false }));
//     }
//   };

//   const handleBack = () => {
//     navigate("/settings");
//   };

//   // Group tasks based on the defined groups
//   const groupTasks = () => {
//     const grouped = {};
//     // For each group defined, find tasks that have a matching permission.
//     taskGroups.forEach((group) => {
//       const tasksInGroup = tasks.filter((t) =>
//         group.permissions.includes(t.taskName)
//       );
//       if (tasksInGroup.length > 0) {
//         grouped[group.groupName] = tasksInGroup;
//       }
//     });
//     // Optionally, add any tasks that did not match any group to "Others"
//     const groupedTaskIds = Object.values(grouped)
//       .flat()
//       .map((t) => t._id);
//     const otherTasks = tasks.filter((t) => !groupedTaskIds.includes(t._id));
//     if (otherTasks.length > 0) {
//       grouped["Others"] = otherTasks;
//     }
//     return grouped;
//   };

//   const groupedTasks = groupTasks();

//   return (
//     <>
//       <MetaData title="QE ~~Permissions" />
//       <Concept />
//       <div className={`roles-assign-container ${colorTheme}`}>
//         <div className="roles-assign-content">
//           <div className="roles-assign-header">
//             <button onClick={handleBack} className="roles-assign-back-button">
//               <ArrowBackIcon />
//             </button>
//             <h3 className="roles-assign-title">
//               Assign Permissions (
//               <span>
//                 {JSON.parse(localStorage.getItem("roleNameForPermissions")).toUpperCase()}
//               </span>
//               )
//             </h3>
//           </div>

//           <div className="roles-assign-permissions">
//             {loadData ? (
//               Object.keys(groupedTasks).map((groupName, index) => (
//                 <div key={`${groupName}-${index}`} className="task-group">
//                   <div className="group-header">
//                     <h4 className="group-title">{groupName}</h4>
//                     <div className="group-checkbox-wrapper">
//                       {groupLoading[groupName] ? (
//                         <div className="group-loader">
//                           <Loader active inline="centered" size="small" />
//                         </div>
//                       ) : (
//                         <Checkbox
//                           checked={areAllTasksInGroupAssigned(groupName)}
//                           onChange={(e, checked) => handleGroupCheckBoxChange(checked, groupName)}
//                           className="group-checkbox"
//                         />
//                       )}
//                     </div>
//                   </div>
//                   {groupedTasks[groupName].map((data, index) => (
//                     <div key={data._id} className="roles-assign-permission-item">
//                       <span className="roles-assign-permission-label">{data.taskName}</span>
//                       <Checkbox
//                         checked={taskPermissions[data._id] === true}
//                         onChange={(e, checked) => handleCheckBoxChange(checked, data._id)}
//                         className="roles-assign-checkbox"
//                         disabled={groupLoading[groupName]} // Disable during group operation
//                       />
//                     </div>
//                   ))}
//                 </div>
//               ))
//             ) : (
//               <div className="roles-assign-loader">
//                 <PageLoader/>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RolesAssign;