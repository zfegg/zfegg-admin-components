import {lazy} from "react";

export const Welcome = lazy(() => import('./Welcome'));
export const Forbidden =  lazy(() => import('./403'));
export const NotFound = lazy(() => import('./404'));
export const Login = lazy(() => import('./Login'));
