"use client";

import { useActionState, useState, useEffect } from "react";
import {
  signupAction,
  verifyOtpAction,
  resendOtpAction,
} from "@/app/actions/signup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import styles from "./signup.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [signupState, signupFormAction, isSignupPending] = useActionState(
    signupAction,
    null
  );
  const [verifyState, verifyFormAction, isVerifyPending] = useActionState(
    verifyOtpAction,
    null
  );
  const [resendState, resendFormAction, isResendPending] = useActionState(
    resendOtpAction,
    null
  );

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Watch for signup success and show OTP form
  useEffect(() => {
    if (signupState?.success && signupState?.email) {
      setUserEmail(signupState.email);
      setShowOtpForm(true);
    }
  }, [signupState]);

  // Watch for OTP verification success and redirect to login
  useEffect(() => {
    if (verifyState?.success) {
      setTimeout(() => router.push("/login"), 1500);
    }
  }, [verifyState, router]);

  // Handle OTP verification - append email and purpose
  const handleVerifySubmit = (formData: FormData) => {
    formData.append("email", userEmail);
    formData.append("purpose", "signup");
    verifyFormAction(formData);
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("purpose", "signup");
    resendFormAction(formData);
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
        {!showOtpForm ? (
          <>
            <h2 className={styles.heading}>Create Account</h2>
            <p className={styles.signupLabel}>Signup</p>

            <form action={signupFormAction} style={{ width: "100%" }}>
              <input
                type="text"
                name="contact_person"
                placeholder="Contact Person Name"
                className={styles.inputField}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={styles.inputField}
                required
              />

              <input
                type="tel"
                name="phone_no"
                placeholder="Phone Number (e.g., 03323387171)"
                className={styles.inputField}
                required
              />

              <div className={styles.passwordField}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
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

              <select name="role" className={styles.inputField} required>
                <option value="">Select Role</option>
                <option value="guest_user">Guest User</option>
                <option value="supplier">Supplier</option>
                <option value="consumer">Consumer</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="financial_manager">Financial Manager</option>
                <option value="student">Student</option>
                <option value="business_owner">Business Owner</option>
              </select>

              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                className={styles.inputField}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                className={styles.inputField}
                required
              />

              <select name="gender" className={styles.inputField} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                name="type_of_business"
                placeholder="Type of Business"
                className={styles.inputField}
                required
              />

              {signupState?.error && (
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
                    {signupState.error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className={styles.signupBtn}
                disabled={isSignupPending}
              >
                {isSignupPending ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className={styles.already}>
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.heading}>Verify Your Email</h2>
            <p className={styles.signupLabel}>Enter OTP</p>
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

            <form action={handleVerifySubmit} style={{ width: "100%" }}>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                className={styles.inputField}
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />

              {verifyState?.error && (
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
                    {verifyState.error}
                  </p>
                </div>
              )}

              {verifyState?.success && (
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
                    {verifyState.message} Redirecting to login...
                  </p>
                </div>
              )}

              {resendState?.success && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#dbeafe",
                    border: "1px solid #93c5fd",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#1e40af", margin: 0 }}>
                    {resendState.message}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                <button
                  type="submit"
                  className={styles.signupBtn}
                  disabled={isVerifyPending}
                  style={{ flex: 1, margin: 0 }}
                >
                  {isVerifyPending ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  className={styles.resendBtn}
                  disabled={isResendPending}
                  style={{
                    flex: 1,
                    margin: 0,
                    padding: "10px 20px",
                    background: "transparent",
                    color: "#ef4444",
                    border: "2px solid #ef4444",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isResendPending) {
                      e.currentTarget.style.background = "#ef4444";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                >
                  {isResendPending ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </form>

            <p className={styles.already}>
              <button
                onClick={() => setShowOtpForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back to Signup
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
