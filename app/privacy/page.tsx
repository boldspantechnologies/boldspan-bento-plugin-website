import type { Metadata } from "next";
import { pageMeta } from "../site";
import { Legal } from "../Legal";

export const metadata: Metadata = pageMeta("/privacy");

export default function Privacy() {
  return (
    <Legal
      title="Privacy."
      items={[
        ["What we collect", "Your email and name when you buy Pro, and your payment provider's order details. We never see your card number."],
        ["Licence checks", "The Pro plugin sends your licence key, site address, plugin version and WordPress version to our server to confirm your licence and offer updates."],
        ["How we use it", "To deliver your licence, send receipts and reminders, provide updates and answer support requests."],
        ["Your rights", "Email us to access, correct or delete your data."],
      ]}
    />
  );
}
