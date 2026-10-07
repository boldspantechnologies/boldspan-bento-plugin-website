import type { Metadata } from "next";
import { pageMeta } from "../site";
import { Legal } from "../Legal";

export const metadata: Metadata = pageMeta("/refund-policy");

export default function Refunds() {
  return (
    <Legal
      title="Refunds."
      items={[
        ["30-day refund", "If you are not satisfied with your purchase for any reason, you can request a refund within 30 days of your purchase date."],
        ["How", "Contact our support team at the address below with your purchase details. We'll refund through the original payment method."],
        ["After a refund", "Your licence is deactivated. Existing grids keep working with the free plugin."],
      ]}
    />
  );
}
