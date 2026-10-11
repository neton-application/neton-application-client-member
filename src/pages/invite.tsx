"use client";

import * as React from "react";
import { apiFetch } from "@neton/application-client-runtime/client";
import { useQuery } from "@neton/application-client-runtime/client-context";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Input, PageHeader } from "@neton/application-client-kit";

interface MyInviteCode { code: string; usedCount: number }

/**
 * 邀请好友：展示我的邀请码与注册链接。
 *
 * 平台没开邀请功能时接口会失败，页面说明「暂未开放」，不当成错误报出来。
 */
export default function Page() {
  const [copied, setCopied] = React.useState(false);
  const inviteQ = useQuery({ queryKey: ["member-invite-code"], queryFn: () => apiFetch<MyInviteCode>("/app/member/invite-code/mine").catch(() => null) });
  const invite = inviteQ.data ?? null;
  const inviteLink = invite && typeof window !== "undefined" ? `${window.location.origin}/register?invite=${encodeURIComponent(invite.code)}` : "";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="MEMBER" title="邀请好友" description="好友注册时填写你的邀请码，或直接用邀请链接注册" />
      {inviteQ.isPending ? null : invite ? (
        <Card className="max-w-xl">
          <CardHeader><CardTitle>我的邀请码</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-2 text-sm">邀请码：<code>{invite.code}</code>，已邀请 {invite.usedCount} 人。</p>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly />
              <Button variant="secondary" onClick={() => { void navigator.clipboard?.writeText(inviteLink); setCopied(true); }}>{copied ? "已复制" : "复制链接"}</Button>
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">是否有邀请奖励、奖励多少由平台设定，以实际到账为准。</p>
          </CardContent>
        </Card>
      ) : (
        <Alert tone="info">邀请功能暂未开放</Alert>
      )}
    </div>
  );
}
