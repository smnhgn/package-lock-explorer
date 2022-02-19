import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction } from "remix";
import styles from "./styles/global.css";
import { Header, links as headerLinks } from "./components/Header";

export function links() {
  return [
    ...headerLinks(),
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" },
  ];
}

export const meta: MetaFunction = () => {
  return { title: "Package Lock Explorer" };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
