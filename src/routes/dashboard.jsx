// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LocationOn from "@material-ui/icons/LocationOn";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Maps from "views/Maps/Maps.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Remote Monitoring by Radio Holland",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/maps",
    sidebarName: "Maps",
    navbarName: "Map",
    icon: LocationOn,
    component: Maps
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
