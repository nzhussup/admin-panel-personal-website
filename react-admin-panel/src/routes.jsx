import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import CV from "./pages/CV";
import Projects from "./pages/Projects";
import Certs from "./pages/cv/Certs";
import Edu from "./pages/cv/Edu";
import WorkExp from "./pages/cv/WorkExp";
import Skills from "./pages/cv/Skills";

const routes = [
  {
    path: "/login",
    element: <Login />,
    isProtected: false,
  },
  {
    path: "/",
    element: <Home />,
    isProtected: true,
  },
  {
    path: "/projects",
    element: <Projects />,
    isProtected: true,
  },
  {
    path: "/cv",
    element: <CV />,
    isProtected: true,
  },
  {
    path: "/cv/certifications",
    element: <Certs />,
    isProtected: true,
  },
  {
    path: "/cv/work-experience",
    element: <WorkExp />,
    isProtected: true,
  },
  {
    path: "/cv/skills",
    element: <Skills />,
    isProtected: true,
  },
  {
    path: "/cv/education",
    element: <Edu />,
    isProtected: true,
  },
];

export default routes;
