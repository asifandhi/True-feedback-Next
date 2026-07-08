import dbConnect from "@/lib/dbConnet";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificatonEmail } from "@/helper/sendEmail";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    // Is User exist and verified 
    const existingUserAndVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserAndVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is taken",
        },
        { status: 400 },
      );
    }


    
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCodeNum = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCodeNum;
        existingUserByEmail.verifyCodeEx = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCodeNum,
        verifyCodeEx: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const resEmail = await sendVerificatonEmail(email, username, verifyCodeNum);
    if (!resEmail.success) {
      return Response.json(
        {
          success: false,
          message: resEmail.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Email send successfully.Please verify your email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error while sign up : ", error);
    return Response.json(
      {
        success: false,
        message: "Error register user ",
      },
      {
        status: 500,
      },
    );
  }
}
