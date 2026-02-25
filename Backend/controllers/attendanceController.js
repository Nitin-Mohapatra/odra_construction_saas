const Attendance = require("../models/Attendance");
const Worker = require("../models/Worker");
const Project = require("../models/project");

// finding and creating attendance - marking the attendance
exports.markAttendance = async (req, res) => {
    try {
      const { projectId, date, records } = req.body;
  
      // validate project exists
      const project = await Project.findById(projectId);
      if(!project){
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      // check if the project is completed
      if(project.status === "Completed"){
        return res.status(400).json({
          success: false,
          message: "Project is completed"
        });
      }

      // checkt if the workers are assigned to the project & is not free
      for(const rec of records){
        const worker = await Worker.findById(rec.workerId);
        if(!worker){
          return res.status(404).json({
            success: false,
            message: "Worker not found"
          });
        }
        if(worker.currentProjectId.toString() !== projectId.toString()){
          return res.status(400).json({
            success: false,
            message: "Worker is not assigned to this project"
          });
        }
        if(worker.status === "free"){
          return res.status(400).json({
            success: false,
            message: "Worker is free"
          }); 
        }
      }

      const attendance = await Attendance.findOneAndUpdate(
        { projectId, date },
        {
          projectId,
          date,
          records,
          markedBy: req.user.User_id
        },
        {
          upsert: true,
          new: true
        }
      );
  
      // 🔔 emit socket event
      const io = req.app.get("io");
      io.to(`project-${projectId}`).emit("attendance:updated", { date });
  
      res.status(201).json({
        success: true,
        attendance
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to mark attendance"
      });
    }
  };
  
// finding an attendance
exports.getAttendance = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if(!project){
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    const attendance = await Attendance.findOne({
      projectId: req.params.projectId,
      date: req.params.date
    }).populate("records.workerId").populate("projectId");


    if (!attendance) {
      return res.status(200).json({
        success: true,
        attendance: {
          projectId: project,
          date: req.params.date,
          records: []
        }
      });
    }

    return res.status(200).json({
      success: true,
      attendance
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};
