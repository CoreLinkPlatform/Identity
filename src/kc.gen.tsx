/* eslint-disable */
// @ts-nocheck
import { lazy, Suspense, type ReactNode } from "react";
export type ThemeName = "corelink";
export const themeNames: ThemeName[] = ["corelink"];
export type KcEnvName = never;
export const kcEnvNames: KcEnvName[] = [];
export const kcEnvDefaults: Record<KcEnvName, string> = {};
export type KcContext = import("./login/KcContext").KcContext;
declare global { interface Window { kcContext?: KcContext; } }
export const KcLoginPage = lazy(() => import("./login/KcPage"));
export function KcPage(props: { kcContext: KcContext; fallback?: ReactNode }) {
  return <Suspense fallback={props.fallback}>{props.kcContext.themeType === "login" ? <KcLoginPage kcContext={props.kcContext} /> : null}</Suspense>;
}
export const BASE_URL = import.meta.env.BASE_URL;
