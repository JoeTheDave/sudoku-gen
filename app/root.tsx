import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { ClientOnly } from 'remix-utils';
import Layout from '~/components/Layout';
import stylesUrl from './styles/tailwind.css';

import type { LinksFunction } from '@remix-run/server-runtime';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: stylesUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Acme&family=Permanent+Marker&family=Roboto:ital,wght@0,100;0,300;0,500;0,700;0,900;1,100;1,300;1,500;1,700;1,900&family=Shadows+Into+Light&display=swap',
    },
  ];
};

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly>
          {() => (
            <Layout>
              <Outlet />
            </Layout>
          )}
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
