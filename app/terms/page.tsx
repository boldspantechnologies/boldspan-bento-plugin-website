import type { Metadata } from "next";
import { Legal } from "../Legal";

export const metadata: Metadata = { title: "Terms | BoldSpan Bento Grid" };

export default function Terms() {
  return (
    <Legal
      title="Terms."
      items={[
        ["Licence", "A Pro licence lets you use BoldSpan Bento Grid Pro on the number of sites included in your plan, for the length of the plan."],
        ["Updates and support", "Updates and support are included while your licence is active."],
        ["Expiry", "If your licence expires, published grids keep working. Editing Pro features is locked after a 14-day grace period until you renew."],
        ["Acceptable use", "You may not resell, redistribute or share your licence key or the Pro plugin files."],
        ["Liability", "The plugin is provided as is. Back up your site before updating."],
      ]}
    />
  );
}
