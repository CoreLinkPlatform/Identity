import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      loginAccountTitle: "Sign in to CoreLink",
      doLogIn: "Sign in"
    },
    fa: {
      doLogIn: "ورود",
      doRegister: "ایجاد حساب",
      doForgotPassword: "رمز عبور را فراموش کرده‌اید؟",
      loginAccountTitle: "ورود به CoreLink",
      loginTitle: "ورود به {0}",
      username: "نام کاربری",
      usernameOrEmail: "ایمیل یا نام کاربری",
      password: "رمز عبور",
      rememberMe: "مرا به خاطر بسپار",
      noAccount: "حساب ندارید؟",
      emailForgotTitle: "بازیابی دسترسی",
      backToLogin: "بازگشت به ورود",
      proceedWithAction: "ادامه",
      emailVerifyTitle: "تأیید ایمیل",
      updatePasswordTitle: "تغییر رمز عبور",
      configureTotpTitle: "راه‌اندازی احراز هویت دومرحله‌ای"
    }
  })
  .build();

export type I18n = typeof ofTypeI18n;
export { useI18n };
