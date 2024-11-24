import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import styled from "styled-components";

import "./index.css"; // Global styles
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import AddTimerView from "./views/AddTimerView";
import { TimerProvider } from "./TimerContext";

// Styled components for layout and navigation
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #222;
  min-height: 100vh;
  padding: 20px;
  color: #ffd700;
  font-family: "Digital-7", "Roboto Mono", monospace;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #ffd700;
`;

const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* Ensure content is vertically aligned */
  align-items: center; /* Center align the buttons horizontally */
  gap: 20px; /* Add spacing between buttons */
  margin-top: 20px;
  width: 100%; /* Make the container responsive */
  max-width: 400px; /* Limit the width for larger screens */
`;

const Button = styled(Link)`
  text-decoration: none;
  background-color: #000;
  color: #ffd700;
  padding: 15px 30px; /* Same size as Start/Pause buttons */
  font-size: 1.2rem;
  border-radius: 5px;
  font-family: "Digital-7", "Roboto Mono", monospace;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  width: 100%; /* Make the button responsive */
  max-width: 300px; /* Ensure buttons are consistently sized */

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PageIndex = () => {
  return (
    <PageContainer>
      <Header>Assignment</Header>
      <Navigation>
        <Button to="/">Timers</Button>
        <Button to="/docs">Documentation</Button>
        <Button to="/add">Add Timer</Button>
      </Navigation>
      <Outlet />
    </PageContainer>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <PageIndex />,
    children: [
      { index: true, element: <TimersView /> },
      { path: "/docs", element: <DocumentationView /> },
      { path: "/add", element: <AddTimerView /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TimerProvider>
      <RouterProvider router={router} />
    </TimerProvider>
  </StrictMode>
);
