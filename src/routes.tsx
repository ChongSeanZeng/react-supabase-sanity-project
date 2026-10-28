import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Layout } from "./layout";
import { LanguageRouteSync } from "./components/common/LanguageRouteSync";
import Home from "./pages/Home";
import About from "./pages/About";
import Sustainability from "./pages/Sustainability";
import Training from "./pages/Training";
import Verification from "./pages/Verification";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const SanityStudioPage = lazy(() => import("./pages/SanityStudioPage"));

export const routes: RouteObject[] = [
  {
    element: <LanguageRouteSync />,
    children: [
      {
        path: "/studio/*",
        element: (
          <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-inksoft">Loading / 正在加载…</div>}>
            <SanityStudioPage />
          </Suspense>
        ),
      },
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/sustainability", element: <Sustainability /> },
          { path: "/training", element: <Training /> },
          { path: "/courses", element: <Courses /> },
          { path: "/login", element: <Login /> },
          { path: "/admin", element: <Admin /> },
          { path: "/verification", element: <Verification /> },
          { path: "/partners", element: <Partners /> },
          { path: "/contact", element: <Contact /> },
          { path: "/en", element: <Home /> },
          { path: "/en/about", element: <About /> },
          { path: "/en/sustainability", element: <Sustainability /> },
          { path: "/en/training", element: <Training /> },
          { path: "/en/courses", element: <Courses /> },
          { path: "/en/login", element: <Login /> },
          { path: "/en/admin", element: <Admin /> },
          { path: "/en/verification", element: <Verification /> },
          { path: "/en/partners", element: <Partners /> },
          { path: "/en/contact", element: <Contact /> },
          { path: "/en/*", element: <Home /> },
          { path: "*", element: <Home /> },
        ],
      },
    ],
  },
];
