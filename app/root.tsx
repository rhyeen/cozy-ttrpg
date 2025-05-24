import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";

import type { Route } from "./+types/root";
import ProtectedRoute from "./ProtectedRoute";
import { PrimaryLayoutForChildren } from './layouts/Primary.layout';
import Header from './components/Header';
import Paragraph from './components/Paragraph';
import Section from './components/Section';
import Divider from './components/Divider';
import Button from './components/Button';
import { Toast } from '@base-ui-components/react';
import ToastViewPort from './components/ToastViewPort';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* See: https://base-ui.com/react/overview/quick-start#:~:text=you%20actually%C2%A0use.-,Set%20up%20portals,-Base%C2%A0UI%20uses */}
        <div className="root">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Toast.Provider>
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
        <ToastViewPort />
      </Toast.Provider>
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 Not Found" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Provider store={store}>
      <PrimaryLayoutForChildren>
        <Section>
          <Header type="h1">{message}</Header>
          <Paragraph>{details}</Paragraph>
          {stack && <Divider />}
          {stack && <Paragraph>{stack}</Paragraph>}
          <Button
            type="primary"
            onClick={() => window.location.href = '/'}
          >
            Back to Safety
          </Button>
        </Section>
      </PrimaryLayoutForChildren>
    </Provider>
  );
}
