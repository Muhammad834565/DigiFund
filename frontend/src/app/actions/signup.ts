"use server";

import { redirect } from "next/navigation";

export async function signupAction(prevState: any, formData: FormData) {
  const contact_person = formData.get("contact_person") as string;
  const email = formData.get("email") as string;
  const phone_no = formData.get("phone_no") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const company_name = formData.get("company_name") as string;
  const address = formData.get("address") as string;
  const gender = formData.get("gender") as string;
  const type_of_business = formData.get("type_of_business") as string;

  const mutation = `
    mutation Signup($input: SignupInput!) {
      signup(input: $input) {
        message
        email
      }
    }
  `;

  try {
    const response = await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            contact_person,
            email,
            phone_no,
            password,
            role,
            company_name,
            address,
            gender,
            type_of_business,
          },
        },
      }),
    });

    const json = await response.json();
    if (json.errors) {
      const errorMessage = json.errors[0].message;

      // Handle specific validation errors
      if (errorMessage.includes("role")) {
        return {
          error:
            "Invalid role selected. Please choose: Guest User, Supplier, Consumer, Inventory Manager, Financial Manager, Student, or Business Owner.",
        };
      }
      if (errorMessage.includes("email")) {
        return { error: "Invalid email address or email already exists." };
      }
      if (errorMessage.includes("phone")) {
        return { error: "Invalid phone number format." };
      }
      if (errorMessage.includes("password")) {
        return {
          error:
            "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character.",
        };
      }

      throw new Error(errorMessage);
    }

    // Return success with email to show OTP verification
    return {
      success: true,
      message: json.data.signup.message,
      email: json.data.signup.email,
    };
  } catch (error: any) {
    return {
      error: error.message || "Failed to create account. Please try again.",
    };
  }
}

export async function verifyOtpAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const purpose = formData.get("purpose") as string;

  const mutation = `
    mutation VerifyOtp($input: VerifyOtpInput!) {
      verifyOtp(input: $input) {
        success
        message
      }
    }
  `;

  try {
    const response = await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: { email, otp, purpose },
        },
      }),
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    if (json.data.verifyOtp.success) {
      return { success: true, message: json.data.verifyOtp.message };
    }

    return { error: json.data.verifyOtp.message };
  } catch (error: any) {
    return { error: error.message || "Failed to verify OTP" };
  }
}

export async function resendOtpAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const purpose = formData.get("purpose") as string;

  const mutation = `
    mutation ResendOtp($input: ResendOtpInput!) {
      resendOtp(input: $input) {
        message
        success
      }
    }
  `;

  try {
    const response = await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: { email, purpose },
        },
      }),
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    if (json.data.resendOtp.success) {
      return { success: true, message: json.data.resendOtp.message };
    }

    return { error: json.data.resendOtp.message };
  } catch (error: any) {
    return { error: error.message || "Failed to resend OTP" };
  }
}
