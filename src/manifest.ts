import { defineFrontModule } from "@neton/application-client-contract";

/**
 * 会员成长（通用）：邀请等成长能力的用户端页面。
 * 账号相关页面（资料、密码、邮箱、手机）在 client-account。
 */
export default defineFrontModule({
  id: "member",
  contractVersion: "1.0.0",
  pages: [
    { key: "member/invite/index", path: "/member/invite", entry: "invite", rendering: "client", title: "邀请好友" },
  ],
});
