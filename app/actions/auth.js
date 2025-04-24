"use server"

import nodemailer from "nodemailer"
import { supabase } from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"



const expiryTimeInMin = 10;

export async function sendOTP(email, otp) {
  try {

    // Configure email transporter (replace with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASSWORD || "password",
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || "Health Prediction <noreply@example.com>",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}. It will expire in ${expiryTimeInMin} minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f4f4f4; padding: 10px; text-align: center;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    }

    // In development, log the OTP instead of sending an email
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`)
      return { success: true }
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return { success: true }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return { success: false, error: "Failed to send verification code" }
  }
}

export async function verifyOTP(email, otp) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("otp, otp_expires_at, id")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { success: false, error: "No verification code found for this email" };
    }

    const storedOTP = {
      code: user.otp,
      expiresAt: new Date(user.otp_expires_at).getTime(),
    };

    if (!storedOTP) {
      return { success: false, error: "No verification code found for this email" }
    }

    if (Date.now() > storedOTP.expiresAt) {
      return { success: false, error: "Verification code has expired" }
    }

    if (storedOTP.code !== otp) {
      return { success: false, error: "Invalid verification code" }
    }

    // OTP is valid, clean up
    const { error: deleteError } = await supabase
      .from("users")
      .update({ otp: null, otp_expires_at: null })
      .eq("email", email);

    if (deleteError) {
      console.error("Error cleaning up OTP in database:", deleteError);
      return { success: false, error: "Failed to clean up verification code" };
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expiration time set to 1 day
    });

    return { success: true, token, userId: user.id };

  } catch (error) {
    console.error("Error verifying OTP:", error)
    return { success: false, error: "Failed to verify code" }
  }
}

export async function login(email, password) {
  try {
    // Fetch user data from Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("id, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Generate a 6-digit OTP
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiryTime();

    // Update the user's OTP and expiration in the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ otp, otp_expires_at: otpExpiresAt })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating OTP in database:", updateError);
      return { success: false, error: "Failed to generate OTP" };
    }

    // Send the OTP via email
    const otpResponse = await sendOTP(email, otp);

    if (!otpResponse.success) {
      return { success: false, error: "Failed to send OTP" };
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, error: "Login failed" };
  }
}

export async function signUp(username, email, password) {
  try {
    // Check if the email is already registered
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser || existingUserError === null) {
      return { success: false, error: "Email is already registered" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword }])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting new user:", insertError);
      return { success: false, error: "Failed to create account" };
    }

    // Generate a 6-digit OTP
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiryTime();

    // Update the user's OTP and expiration in the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ otp, otp_expires_at: otpExpiresAt })
      .eq("id", newUser.id);

    if (updateError) {
      console.error("Error updating OTP in database:", updateError);
      return { success: false, error: "Failed to generate OTP" };
    }

    // Send the OTP via email
    const otpResponse = await sendOTP(email, otp);

    if (!otpResponse.success) {
      return { success: false, error: "Failed to send OTP" };
    }

    return { success: true, message: "Otp Send Successfully" };
  } catch (error) {
    console.error("Error during sign-up:", error);
    return { success: false, error: "Sign-up failed" };
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOtpExpiryTime() {
  return new Date(Date.now() + (expiryTimeInMin * 60 * 1000)); // 10 minutes expiration
}

export async function verifyJWT(token) {
  if (!token) {
    return { success: false, error: "Token is missing" }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { success: true, user: decoded }
  } catch (err) {
    return { success: false, error: "Invalid or expired token" }
  }
}




