"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value || null;
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const emailOrPhone = formData.get("emailOrPhone") as string;
  const password = formData.get("password") as string;

  // Determine if input is email or phone
  const isEmail = emailOrPhone.includes("@");

  const mutation = isEmail
    ? `
      mutation LoginWithEmail($email: String!, $password: String!) {
        login(input: { email: $email, password: $password }) {
          token
          company_name
          public_id
          private_id
          contact_person
          email
          phone_no
          address
          status
          gender
          type_of_business
          role
        }
      }
    `
    : `
      mutation LoginWithPhone($phone_no: String!, $password: String!) {
        login(input: { phone_no: $phone_no, password: $password }) {
          token
          company_name
          public_id
          private_id
          contact_person
          email
          phone_no
          address
          status
          gender
          type_of_business
          role
        }
      }
    `;

  try {
    const response = await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: isEmail
          ? { email: emailOrPhone, password }
          : { phone_no: emailOrPhone, password },
      }),
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    const userData = json.data.login;

    // Set HTTP-only cookies for server-side use
    const cookieStore = await cookies();
    cookieStore.set("token", userData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    cookieStore.set("access_token", userData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Set client-accessible token for Apollo Client (non-httpOnly)
    cookieStore.set("client_token", userData.token, {
      httpOnly: false, // Client-side JavaScript can read this
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set("public_id", userData.public_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    cookieStore.set("private_id", userData.private_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    cookieStore.set("user_id", userData.public_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    cookieStore.set("user_role", userData.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  } catch (error: any) {
    return { error: error.message || "Invalid credentials" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const mutation = `
    mutation Logout {
      logout {
        success
        message
      }
    }
  `;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    await fetch("http://localhost:3000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ query: mutation }),
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear cookies regardless of API response
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("access_token");
    cookieStore.delete("client_token"); // Clear client-accessible token
    cookieStore.delete("public_id");
    cookieStore.delete("private_id");
    cookieStore.delete("user_id");
    cookieStore.delete("user_role");
  }

  redirect("/login");
}

export async function forgotPasswordAction(
  prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;

  const mutation = `
    mutation ForgotPassword($email: String!) {
      forgotPassword(input: { email: $email }) {
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
        variables: { email },
      }),
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    if (json.data.forgotPassword.success) {
      return {
        success: true,
        message: json.data.forgotPassword.message,
        email,
      };
    }

    return { error: json.data.forgotPassword.message };
  } catch (error: any) {
    return { error: error.message || "Failed to send reset code" };
  }
}

export async function resetPasswordAction(
  prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const new_password = formData.get("new_password") as string;

  const mutation = `
    mutation ResetPassword($email: String!, $otp: String!, $new_password: String!) {
      resetPassword(input: { email: $email, otp: $otp, new_password: $new_password }) {
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
        variables: { email, otp, new_password },
      }),
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    if (json.data.resetPassword.success) {
      return { success: true, message: json.data.resetPassword.message };
    }

    return { error: json.data.resetPassword.message };
  } catch (error: any) {
    return { error: error.message || "Failed to reset password" };
  }
}
