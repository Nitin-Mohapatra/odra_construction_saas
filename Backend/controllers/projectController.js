const Project = require('../models/project');
const User = require('../models/user');
const Report = require('../models/report');
const Worker = require('../models/Worker');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const express = require("express");
const nodemailer = require("nodemailer");
const env = require("dotenv").config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   // ✅ correct hostname
    port: 465,                // ✅ secure port
    secure: true,
    auth: {
        user: process.env.gmail_user,
        pass: process.env.gmail_pass
    }
});

const sendEmail = async (from, to, subject, msg, html = "") => {
    try {
        const info = await transporter.sendMail({
            from: `PBM Team <${from}>`,
            to,
            subject,
            text: msg,
            html,
        });
        console.log("Email sent:", info.messageId);
        return true;
    } catch (err) {
        console.error("Error while sending mail:", err);
        return false;
    }
};


exports.createProject = async (req, res) => {
    try {
        const { title, description, startDate, endDate, siteEngineerEmail,siteEngineerName } = req.body;
        if (!title || !description || !siteEngineerEmail) {
            return res.status(404).json({ success: false, error: "Fields can not be empty." });
        }

        const contractorId = req.user.User_id;
        const organizationId = req.user.organizationId;

        // Ensure contractor exists
        const contractor = await User.findOne({ _id: contractorId, organizationId: req.user.organizationId });
        if (!contractor) {
            return res.status(404).json({ success: false, error: "Contractor not found" });
        }

        // 🔎 Find site engineer by email
        let stEng = await User.findOne({
            email: siteEngineerEmail,
            role: "site engineer"
        });

        // 🚫 If engineer exists but belongs to another organization → BLOCK
        if (stEng && stEng.organizationId?.toString() !== organizationId) {
            return res.status(403).json({
                success: false,
                error: "Site engineer belongs to another organization"
            });
        }

        // 🆕 If engineer does not exist → create inside same organization
        let tempPassword = null;
        if (!stEng) {
            tempPassword = crypto.randomBytes(4).toString("hex"); // random 8 chars
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            stEng = await User.create({
                name: siteEngineerName,
                email: siteEngineerEmail,
                password: hashedPassword,
                role: "site engineer",
                organizationId
            });

        }
        // send email to site engineer
        if (tempPassword) {
            const htmlContent = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px;">
            
            <h2 style="color:#2c3e50;">Welcome to ODRA BUILD 🚀</h2>

            <p>Hello,</p>

            <p>You have been assigned as a <strong>Site Engineer</strong> for the project:</p>

            <div style="background:#f0f3f7; padding:15px; border-radius:8px; margin:15px 0;">
                <strong>Project:</strong> ${title}<br/>
                <strong>Assigned By:</strong> ${contractor.name}
            </div>

            <p>Here are your login credentials:</p>

            <div style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:14px;">
                <strong>Email:</strong> ${siteEngineerEmail}<br/>
                <strong>Temporary Password:</strong> ${tempPassword}
            </div>

            <div style="text-align:center; margin:25px 0;">
                <a href="http://localhost:5173/Login" 
                   style="background:#1abc9c; color:white; padding:12px 25px; 
                   text-decoration:none; border-radius:5px;">
                   Login to Dashboard
                </a>
            </div>

            <p style="color:#7f8c8d; font-size:13px;">
                For security reasons, please change your password after logging in.
            </p>

            <hr/>

            <p style="font-size:12px; color:#95a5a6;">
                © ${new Date().getFullYear()} PBM. All rights reserved.
            </p>
        </div>
    </div>
    `;

            await sendEmail(
                process.env.gmail_user,
                siteEngineerEmail,
                `You’ve Been Assigned to Project "${title}"`,
                `You have been assigned to project ${title}. Login using your email and temporary password: ${tempPassword}`,
                htmlContent
            );
        }

        // 🏗 Create project (organization locked)
        const newProject = await Project.create({
            title,
            description,
            status: "Ongoing",
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : new Date(),
            siteEngineer: stEng._id,
            contractor: contractorId,
            organizationId
        });

        // Push project reference
        await User.findByIdAndUpdate(contractorId, {
            $push: { createdProjects: newProject._id }
        });

        await User.findByIdAndUpdate(stEng._id, {
            $push: { assignedProjects: newProject._id }
        });

        // 🔔 Real-time notify engineer
        const io = req.app.get("io");
        const roomName = `siteEngineer-${stEng._id.toString()}`;

        io.to(roomName).emit("project:assigned", {
            newProject,
            contractorName: contractor.name
        });


        return res.status(201).json({
            success: true,
            newProject,
            contractorName: contractor.name
        });

    } catch (error) {
        console.error("Create Project Error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

// get all projects for contractor
exports.getProject = async (req, res) => {
    try {
        const contractorId = req.user.User_id;
        const contratProjects = await Project.find({ organizationId: req.user.organizationId }).populate('siteEngineer', 'name email').lean();

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
exports.getProjectSE = async (req, res) => {
    try {
        const siteEngineerId = req.user.User_id;

        // The .lean() method in Mongoose tells the query to return plain JavaScript objects instead of full Mongoose documents.
        // This makes queries faster and uses less memory when you only need to read data (not use Mongoose document methods).
        const allProject = await Project.find({ siteEngineer: siteEngineerId, organizationId: req.user.organizationId })
            .populate('contractor', 'name')
            .lean();

        if (allProject.length === 0) {
            return res.status(200).json({
                success: true,
                projects: [],
                message: "No Project Created Yet"
            })
        }

        return res.status(200).json({
            success: true,
            projects: allProject
        })
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
}

// to get project by id so that both contractor and site engineer see the page and no other sees the page
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the requester is either contractor of project or assigned site engineer
        const project = await Project.findOne({ _id: id, organizationId: req.user.organizationId })
            .populate('contractor', 'name email')
            .populate('siteEngineer', 'name email')
            .populate({
                path: 'reports',
                populate: { path: 'siteEngineerId', select: 'name email' },
                options: { sort: { createdAt: -1 } }
            });
        console.log(project)

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
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({
            _id: projectId,
            organizationId: req.user.organizationId
        });
        console.log(project)
        if (!project) {
            return res.status(404).json({ success: false, error: "Project not found" });
        }

        // ensure contractor owns the project
        if (project.contractor.toString() !== req.user.User_id) {
            return res.status(403).json({ success: false, error: "You are not authorized to complete this project" });
        }

        // prevent double completion
        if (project.status === "Completed") {
            return res.status(400).json({ success: false, error: "Project already completed" });
        }

        // mark the project as completed
        project.status = "Completed";
        project.endDate = new Date();
        await project.save();

        // free all workers from the project
        await Worker.updateMany(
            { currentProjectId: projectId, organizationId: req.user.organizationId },
            { currentProjectId: null, status: "free" }
        );

        // notify the site engineer
        const io = req.app.get("io");
        io.to(`project-${projectId}`).emit("project:completed", {
            projectId
        });
        return res.status(200).json({ success: true, message: "Project completed successfully" });

    } catch (error) {
        console.error("Complete Project Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}