"use client";

import { useActionState, useState, useEffect } from "react";
import { forgotPasswordAction, resetPasswordAction } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import styles from "../signup/signup.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotState, forgotFormAction, isForgotPending] = useActionState(
    forgotPasswordAction,
    null
  );
  const [resetState, resetFormAction, isResetPending] = useActionState(
    resetPasswordAction,
    null
  );

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Watch for forgot password success and show reset form
  useEffect(() => {
    if (forgotState?.success && forgotState?.email) {
      setUserEmail(forgotState.email);
      setShowResetForm(true);
    }
  }, [forgotState]);

  // Watch for reset password success and redirect to login
  useEffect(() => {
    if (resetState?.success) {
      setTimeout(() => router.push("/login"), 1500);
    }
  }, [resetState, router]);

  // Handle reset password with OTP
  const handleResetSubmit = (formData: FormData) => {
    formData.append("email", userEmail);
    resetFormAction(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h1>
          <span className={styles.digi}>Digi</span>
          <span className={styles.hyphen}>-</span>
          <span className={styles.fund}>Fund</span>
        </h1>
      </div>

      <div className={styles.signupBox}>
        {!showResetForm ? (
          <>
            <h2 className={styles.heading}>Forgot Password</h2>
            <p className={styles.signupLabel}>Reset Your Password</p>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Enter your email address and we'll send you a verification code
            </p>

            <form action={forgotFormAction} style={{ width: "100%" }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email..."
                className={styles.inputField}
                required
              />

              {forgotState?.error && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#991b1b", margin: 0 }}>
                    {forgotState.error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className={styles.signupBtn}
                disabled={isForgotPending}
              >
                {isForgotPending ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Sending code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>

            <p className={styles.already}>
              Remember your password? <Link href="/login">Login</Link>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.heading}>Reset Password</h2>
            <p className={styles.signupLabel}>Enter OTP & New Password</p>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              We sent a verification code to {userEmail}
            </p>

            <form action={handleResetSubmit} style={{ width: "100%" }}>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                className={styles.inputField}
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />

              <div className={styles.passwordField}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="new_password"
                  placeholder="New Password"
                  className={styles.inputField}
                  required
                  minLength={8}
                />
                <span
                  className={styles.toggleEye}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {resetState?.error && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#991b1b", margin: 0 }}>
                    {resetState.error}
                  </p>
                </div>
              )}

              {resetState?.success && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#d1fae5",
                    border: "1px solid #6ee7b7",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#065f46", margin: 0 }}>
                    {resetState.message} Redirecting to login...
                  </p>
                </div>
              )}

              <button
                type="submit"
                className={styles.signupBtn}
                disabled={isResetPending}
              >
                {isResetPending ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <p className={styles.already}>
              <button
                onClick={() => setShowResetForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back to Email Input
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
