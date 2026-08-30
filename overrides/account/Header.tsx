import {
  KeycloakMasthead,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Button } from "../../shared/@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";

import { AccountEnvironment } from "..";

import style from "./header.module.css";

const defaultBrandMarkPath = import.meta.env.VITE_BRAND_MARK || "img/corelink-mark.svg";
const brandMarkUrl = `${import.meta.env.BASE_URL}${defaultBrandMarkPath}`;
const brandName = import.meta.env.VITE_BRAND_NAME || "CoreLink";

const ReferrerLink = () => {
  const { environment } = useEnvironment<AccountEnvironment>();
  const { t } = useTranslation();

  return environment.referrerUrl ? (
    <Button
      data-testid="referrer-link"
      component="a"
      href={environment.referrerUrl.replace("_hash_", "#")}
      variant="link"
      icon={<ExternalLinkSquareAltIcon />}
      iconPosition="right"
      isInline
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
    </Button>
  ) : null;
};

export const Header = () => {
  const { environment, keycloak } = useEnvironment();

  const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
  const internalLogoHref = useHref(logoUrl);
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

  return (
    <KeycloakMasthead
      data-testid="page-header"
      keycloak={keycloak}
      features={{ hasManageAccount: false }}
      brand={{
        href: indexHref,
        src: brandMarkUrl,
        alt: brandName,
        className: style.brand,
      }}
      toolbarItems={[<ReferrerLink key="link" />]}
    />
  );
};
