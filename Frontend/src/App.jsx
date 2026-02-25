import { useState } from 'react'
import Navbar from './Components/Navbar'
import Caroucell from './Components/Caroucell'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from './Screen/Home'
import Signup from './Screen/Signup'
import Login from './Screen/Login'
import Contact from './Screen/Contact'
import GoogleLoginButton from './Components/GoogleLoginButton'
import SiteEngineer from './Screen/SiteEngineer/SiteEngineer'
import Contractor from './Screen/Contractor/Contractor'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Project from './Screen/Contractor/Project'
import ProjectDetails from './Screen/Contractor/ProjectDetails'
import AddProject from './Screen/Contractor/AddProject'
import ViewReport from './Screen/Contractor/ViewReport'
import MyProjects from './Screen/SiteEngineer/MyProjects'
import ProjectWork from './Screen/SiteEngineer/ProjectWork'
import SubmitReport from './Screen/SiteEngineer/SubmitReport'
import Attendance from './Screen/SiteEngineer/Attendance'
import ContractorAttendance from './Screen/Contractor/ContractorAttendance'
import AddWorker from './Screen/Contractor/AddWorkers'
import ContractorWorkers from './Screen/Contractor/ContractorWorkers'
import AssignWorker from './Screen/Contractor/AssignWorker'
import Services from './Screen/Services'
import ProjectInventory from './Screen/Contractor/ProjectInventory'
import InventoryUsage from './Screen/SiteEngineer/InventoryUsage'
import InventoryHistory from './Screen/Contractor/InventoryHistory'

function App() {
  return (
    <BrowserRouter>
      {/* ✅ ToastContainer should be here, once, globally */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* ✅ Your routes below */}
      <Routes>
        <Route path='/Contact-Us' element={<Contact />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/GoogleLogin" element={<GoogleLoginButton />} />
        <Route path="/contractor/home" element={<Contractor />} />
        <Route path="/engineer/home" element={<SiteEngineer />} />
        <Route path="/contractor/project" element={<Project />} />
        <Route path="/contractor/project/:id" element={<ProjectDetails />} />
        <Route path="/contractor/add-project" element={<AddProject />} />
        <Route path="/contractor/view-report/:id" element={<ViewReport />} />
        <Route path="/contractor/projects/:id/inventory" element={<ProjectInventory />} />
        <Route path="/contractor/projects/:id/inventory-history" element={<InventoryHistory />} />
        {/* site engineer routes */}
        <Route path="/site-engineer/projects" element={<MyProjects></MyProjects>}/>
        <Route path='/site-engineer/projects/:id' element={<ProjectWork/>}></Route>
        <Route path='/site-engineer/projects/:id/report' element={<SubmitReport/>}></Route>
        <Route path="/site-engineer/projects/:id/attendance" element={<Attendance />} />
        <Route path="/site-engineer/projects/:id/inventory" element={<InventoryUsage />} />
        {/* common pages routes */}
        <Route path="/services" element={<Services />} />

        {/* Attendance Route */}
        <Route path="/contractor/projects/:id/attendance" element={<ContractorAttendance/>} />
        <Route path="/contractor/workers" element={<ContractorWorkers/>} />
        <Route path="/contractor/add-worker" element={<AddWorker/>} />
        <Route path="/contractor/projects/:id/assign-workers" element={<AssignWorker/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
