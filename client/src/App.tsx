import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentTimetable from "./pages/StudentTimetable";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/student-login"} component={StudentLogin} />
      <Route path={"/student-register"} component={StudentRegister} />
      <Route path={"/admin-login"} component={AdminLogin} />
      <Route path={"/student-dashboard"} component={StudentDashboard} />
      <Route path={"/admin-dashboard"} component={AdminDashboard} />
      <Route path={"/student-profile"} component={StudentProfile} />
      <Route path={"/student-timetable"} component={StudentTimetable} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
