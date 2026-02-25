const Project = require('../models/project');
const User = require('../models/user');
const Report = require('../models/report');
const Worker = require('../models/Worker');

exports.createProject = async (req, res) => {
    try {
        const { title, description, status, startDate, endDate, siteEngineerEmail } = req.body;
        const contractorId = req.user.User_id;

        // finding the site engineer exist with role site engineer
        const stEng = await User.findOne({ email: siteEngineerEmail, role: "site engineer" });

        const contractor = await User.findById(contractorId);

        if (!stEng) {
            return res.status(404).json({ success: false, error: "Site engineer not found" });
        }

        const newProject = await Project.create({
            title,
            description,
            status: "Ongoing",
            startDate: new Date(),
            endDate: new Date(),
            siteEngineer: stEng._id,
            contractor: contractorId
        });

        // push project reference to contractor and siteEngineer
        await User.findByIdAndUpdate(
            contractorId,
            { $push: { createdProjects: newProject._id } }
        );

        await User.findByIdAndUpdate(
            stEng._id,
            { $push: { assignedProjects: newProject._id } }
        );


        // notify the site eng
        const io = req.app.get('io');
        const roomName = `siteEngineer-${stEng._id.toString()}`;
        console.log(`Emitting project:assigned to room: ${roomName}`);
        console.log(`Site Engineer ID: ${stEng._id.toString()}`);
        io.to(roomName).emit("project:assigned", {
            newProject,
            contractorName: contractor.name
        });
        console.log(`Emitted project:assigned event to ${roomName}`);

        return res.status(201).json({ success: true, newProject, contractorName: contractor.name });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
  

// get all projects for contractor
exports.getProject = async (req, res) => {
    try {
        const contractorId = req.user.User_id;
        const contratProjects = await Project.find({ contractor: contractorId }).populate('siteEngineer', 'name email').lean();

        if (contratProjects.length === 0) {
            return res.status(200).json({
                success: true,
                projects: [],
                message: "No projects created yet."
            });
        }

        return res.status(200).json({ success: true, projects: contratProjects });
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};

// get all projects for site Eng
exports.getProjectSE = async(req,res)=>{
    try{
        const siteEngineerId = req.user.User_id;

        // The .lean() method in Mongoose tells the query to return plain JavaScript objects instead of full Mongoose documents.
        // This makes queries faster and uses less memory when you only need to read data (not use Mongoose document methods).
        const allProject = await Project.find({ siteEngineer: siteEngineerId })
            .populate('contractor','name')
            .lean();

        if(allProject.length === 0){
            return res.status(200).json({
                success:true,
                projects:[],
                message:"No Project Created Yet"
            })
        }

        return res.status(200).json({
            success:true,
            projects:allProject
        })
    }catch(error){
        return res.status(500).json({ success: false, error });
    }
}

// to get project by id so that both contractor and site engineer see the page and no other sees the page
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the requester is either contractor of project or assigned site engineer
        const project = await Project.findById(id)
            .populate('contractor', 'name email')
            .populate('siteEngineer', 'name email')
            .populate({
                path: 'reports',
                populate: { path: 'siteEngineerId', select: 'name email' },
                options: { sort: { createdAt: -1 } }
            });

        if (!project) return res.status(404).json({ message: 'Project not found' });

        // authorization
        // WILL ADD THE authorization middleware

        res.json({ project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.completeProject = async (req, res) => {
    try{
        const {projectId} = req.params;
        const project = await Project.findById(projectId);

        if(!project){
            return res.status(404).json({ success: false, error: "Project not found" });
        }

        // ensure contractor owns the project
        if(project.contractor.toString() !== req.user.User_id){
            return res.status(403).json({ success: false, error: "You are not authorized to complete this project" });
        }

        // prevent double completion
        if(project.status === "Completed"){
            return res.status(400).json({ success: false, error: "Project already completed" });
        }

        // mark the project as completed
        project.status = "Completed";
        project.endDate = new Date();
        await project.save();

        // free all workers from the project
        await Worker.updateMany(
            {currentProjectId: projectId},
            {currentProjectId: null, status: "free"}
        );

        // notify the site engineer
        const io = req.app.get("io");
        io.to(`project-${projectId}`).emit("project:completed", {
          projectId
        });
        return res.status(200).json({ success: true, message: "Project completed successfully" });

    }catch(error){
        console.error("Complete Project Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}