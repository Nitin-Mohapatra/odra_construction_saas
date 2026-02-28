const Worker = require("../models/Worker");
const Project = require("../models/project");

exports.createWorker = async (req, res) => {
  try {
    const { name, phone } = req.body;
    // basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Worker name is required"
      });
    }

    const worker = await Worker.create({
      name,
      phone,
      createdBy: req.user.User_id,
      status: "free",
      currentProjectId: null,
      organizationId: req.user.organizationId
    });

    return res.status(201).json({
      success: true,
      worker
    });
  } catch (error) {
    console.error("Create Worker Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create worker"
    });
  }
};

exports.getProjectWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({
      organizationId: req.user.organizationId,
      currentProjectId: req.params.projectId,
      status: "assigned"
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      workers
    });
  } catch (error) {
    console.error("Get Workers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workers"
    });
  }
};

exports.assignWorkerToProject = async (req, res) => {
  try{
    const {workerId} = req.params;
    const {projectId} = req.body;

    // validate project exists
    const project = await Project.findById(projectId);
    console.log(project);
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

    // validate worker exists
    const worker = await Worker.findOne({
      _id: workerId,
      organizationId: req.user.organizationId
   });
    if(!worker){
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }
    
    // validate worker is free
    if(worker.status !== "free"){
      return res.status(400).json({
        success: false,
        message: "Worker is not free"
      });
    }

    worker.currentProjectId = projectId;
    worker.status = "assigned";

    await worker.save();

    return res.status(200).json({
      success: true,
      message: "Worker assigned to project successfully"
    });
  }catch(error){  
    console.error("Assign Worker to Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign worker to project"
    });
  }
};

exports.getAllWorkers = async (req,res)=>{
  try{
    const workers = await Worker.find({
      createdBy: req.user.User_id,
      organizationId: req.user.organizationId
    }).populate('currentProjectId', 'title').sort({ createdAt: 1 });
    return res.status(200).json({ success: true, workers });
  }catch(error){
    console.error("Get All Workers Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch workers" });
  }
};