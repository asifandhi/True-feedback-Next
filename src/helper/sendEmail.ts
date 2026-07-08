import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificatonEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification code TrueFeedback ',
      react: VerificationEmail({username,otp:verifyCode}),
    });
    return { success: true, message: "verification email send successfully" };
  } catch (error) {
    console.log("Error while sending email", error);
    return { success: false, message: "failed to send verification email" };
  }
}
