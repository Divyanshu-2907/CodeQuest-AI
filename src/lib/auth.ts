import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (resend) {
            try {
              await resend.emails.send({
                from: 'CodeQuest AI <onboarding@resend.dev>',
                to: user.email,
                subject: 'Welcome to Neural City | Connection Secure',
                html: `
                  <div style="background-color: #0d0d12; color: #ffffff; padding: 40px; font-family: monospace; border: 1px solid #7F77DD; border-radius: 8px;">
                    <h1 style="color: #7F77DD; font-size: 24px; border-bottom: 2px solid #2A2A35; padding-bottom: 10px;">CODEQUEST_ UPLINK ACTIVE</h1>
                    <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                      Welcome, Agent. Your connection to Neural City has been secured.
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                      You are now jacked into the digital grid. Execute Python code modules to bypass megacorp security firewalls and liberate the digital underground.
                    </p>
                    <div style="margin: 30px 0; padding: 15px; background-color: #1E1E2A; border-left: 4px solid #7F77DD;">
                      <strong style="color: #ffffff;">INITIATION CHECKLIST:</strong>
                      <ul style="color: #a1a1aa; margin-top: 5px; padding-left: 20px;">
                        <li>Complete Onboarding to claim your unique Handle</li>
                        <li>Infiltrate Chapter 1 districts</li>
                        <li>Unlock Prestige Levels and earn achievements</li>
                      </ul>
                    </div>
                    <p style="font-size: 12px; color: #71717a; border-top: 1px solid #2A2A35; pt: 15px; margin-top: 30px;">
                      WARNING: This connection is encrypted. Do not share your access keys.
                    </p>
                  </div>
                `
              });
              console.log(`Welcome email dispatched to ${user.email}.`);
            } catch (mailErr) {
              console.error('Failed to send welcome email:', mailErr);
            }
          } else {
            console.log(`[SIMULATED EMAIL] Welcoming user ${user.email} to CodeQuest.`);
          }
        }
      }
    }
  }
});
