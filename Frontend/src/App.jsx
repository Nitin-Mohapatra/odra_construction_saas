
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminRoute from "./utils/AdminRoute";

const Home = lazy(() => import("./Screen/Home"));
const Signup = lazy(() => import("./Screen/Signup"));
const Login = lazy(() => import("./Screen/Login"));
const Contact = lazy(() => import("./Screen/Contact"));

const Contractor = lazy(() => import("./Screen/Contractor/Contractor"));
const Project = lazy(() => import("./Screen/Contractor/Project"));
const ProjectDetails = lazy(() => import("./Screen/Contractor/ProjectDetails"));
const AddProject = lazy(() => import("./Screen/Contractor/AddProject"));
const ViewReport = lazy(() => import("./Screen/Contractor/ViewReport"));
const ContractorAttendance = lazy(() => import("./Screen/Contractor/ContractorAttendance"));
const AddWorker = lazy(() => import("./Screen/Contractor/AddWorkers"));
const ContractorWorkers = lazy(() => import("./Screen/Contractor/ContractorWorkers"));
const AssignWorker = lazy(() => import("./Screen/Contractor/AssignWorker"));
const ProjectInventory = lazy(() => import("./Screen/Contractor/ProjectInventory"));
const InventoryHistory = lazy(() => import("./Screen/Contractor/InventoryHistory"));

const SiteEngineer = lazy(() => import("./Screen/SiteEngineer/SiteEngineer"));
const MyProjects = lazy(() => import("./Screen/SiteEngineer/MyProjects"));
const ProjectWork = lazy(() => import("./Screen/SiteEngineer/ProjectWork"));
const SubmitReport = lazy(() => import("./Screen/SiteEngineer/SubmitReport"));
const Attendance = lazy(() => import("./Screen/SiteEngineer/Attendance"));
const InventoryUsage = lazy(() => import("./Screen/SiteEngineer/InventoryUsage"));

const Services = lazy(() => import("./Screen/Services"));
const Pricing = lazy(() => import("./Screen/Pricing"));

const AdminDashboard = lazy(() =>
  import("./Screen/Admin/admin dashboard/Dashboard")
);

const SignInSide = lazy(() =>
  import("./Screen/Admin/admin-signin-mui/signin-mui/SignInSide")
);

const NotFound = lazy(() => import("./Components/NotFound"));

// suspense loader and errorboundary
import FullScreenLoader from "./Components/FullScreenLoader";
import ErrorBoundary from "./Components/ErrorBoundary";

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
      <ErrorBoundary>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route path='/Contact-Us' element={<Contact />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/contractor/home" element={<Contractor />} />
            <Route path="/engineer/home" element={<SiteEngineer />} />
            <Route path="/contractor/project" element={<Project />} />
            <Route path="/contractor/project/:id" element={<ProjectDetails />} />
            <Route path="/contractor/add-project" element={<AddProject />} />
            <Route path="/contractor/view-report/:id" element={<ViewReport />} />
            <Route path="/contractor/projects/:id/inventory" element={<ProjectInventory />} />
            <Route path="/contractor/projects/:id/inventory-history" element={<InventoryHistory />} />
            {/* site engineer routes */}
            <Route path="/site-engineer/projects" element={<MyProjects></MyProjects>} />
            <Route path='/site-engineer/projects/:id' element={<ProjectWork />}></Route>
            <Route path='/site-engineer/projects/:id/report' element={<SubmitReport />}></Route>
            <Route path="/site-engineer/projects/:id/attendance" element={<Attendance />} />
            <Route path="/site-engineer/projects/:id/inventory" element={<InventoryUsage />} />
            {/* common pages routes */}
            <Route path="/services" element={<Services />} />

            {/* Attendance Route */}
            <Route path="/contractor/projects/:id/attendance" element={<ContractorAttendance />} />
            <Route path="/contractor/workers" element={<ContractorWorkers />} />
            <Route path="/contractor/add-worker" element={<AddWorker />} />
            <Route path="/contractor/projects/:id/assign-workers" element={<AssignWorker />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<SignInSide />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
