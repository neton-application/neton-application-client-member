"use client";

import * as React from "react";
import { apiFetch } from "@neton/application-client-runtime/client";
import { useQuery } from "@neton/application-client-runtime/client-context";
import { useT } from "@neton/application-client-runtime/i18n";
import { useTabTitle } from "@neton/application-client-runtime/workspace";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Input, PageHeader } from "@neton/application-client-kit";

interface MyInviteCode { code: string; usedCount: number }

/**
 * 邀请好友：展示我的邀请码与注册链接。
 *
 * 平台没开邀请功能时接口会失败，页面说明「暂未开放」，不当成错误报出来。
 */
export default function Page() {
  const t = useT("member");
  useTabTitle(t("invite.title"));
  const [copied, setCopied] = React.useState(false);
  const inviteQ = useQuery({ queryKey: ["member-invite-code"], queryFn: () => apiFetch<MyInviteCode>("/app/member/invite-code/mine").catch(() => null) });
  const invite = inviteQ.data ?? null;
  const inviteLink = invite && typeof window !== "undefined" ? `${window.location.origin}/register?invite=${encodeURIComponent(invite.code)}` : "";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="MEMBER" title={t("invite.title")} description={t("invite.description")} />
      {inviteQ.isPending ? null : invite ? (
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{t("invite.my_code")}</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">{t("invite.code_label")}<code>{invite.code}</code>{t("invite.used_count", { count: invite.usedCount })}</p>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly />
              <Button variant="secondary" onClick={() => { void navigator.clipboard?.writeText(inviteLink); setCopied(true); }}>{copied ? t("invite.copied") : t("invite.copy_link")}</Button>
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">{t("invite.reward_note")}</p>
          </CardContent>
        </Card>
      ) : (
        <Alert tone="info">{t("invite.unavailable")}</Alert>
      )}
    </div>
  );
}
