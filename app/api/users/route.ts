import EmailVerificationToken from "@models/emailVerificationToken";
import { NewUserRequest } from "@/app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sendEmail } from "@/app/lib/email";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;
    return NextResponse.json({
    message: "User created successfully",
    verificationUrl
  });
};


