<#macro emailLayout>
<!doctype html>
<html lang="${locale!"en"}" dir="<#if locale?? && (locale?starts_with("fa") || locale?starts_with("ar"))>rtl<#else>ltr</#if>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${realmName!"CoreLink"}</title>
</head>
<body style="margin:0;padding:0;background:#f2f6fa;color:#142033;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f6fa;padding:32px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #dce5ef;border-radius:20px;overflow:hidden;box-shadow:0 14px 40px rgba(15,35,55,.08);">
                <tr>
                    <td style="padding:28px 32px;background:#07182f;color:#ffffff;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td style="vertical-align:middle;padding-inline-end:12px;">
                                    <img src="${url.resourcesUrl}/corelink-mark.svg" width="44" height="44" alt="CoreLink" style="display:block;width:44px;height:44px;border:0;border-radius:10px;">
                                </td>
                                <td style="vertical-align:middle;">
                                    <div style="font-size:18px;line-height:1.25;font-weight:700;">${realmName!"CoreLink"}</div>
                                    <div style="margin-top:3px;font-size:11px;line-height:1.4;color:#9db3ca;">Secure connected intelligence</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:34px 32px;font-size:15px;line-height:1.8;">
                        <#nested>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 32px;border-top:1px solid #e8eef5;color:#718096;font-size:11px;line-height:1.7;text-align:center;">
                        ${realmName!"CoreLink"} Identity · Secure account notification
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
</#macro>
