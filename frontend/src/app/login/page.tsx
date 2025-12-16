"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import styles from "./login.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Left side - Logo */}
        <div className={styles.leftPanel}>
          <h1>
            <span className={styles.digi}>Digi</span>
            <span className={styles.hyphen}>-</span>
            <span className={styles.fund}>Fund</span>
          </h1>
        </div>

        {/* Right side - Form */}
        <div className={styles.loginBox}>
          <h2 className={styles.heading}>Welcome back</h2>
          <p className={styles.loginLabel}>Login</p>

          <form action={formAction} style={{ width: "100%" }}>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Email or Phone Number"
              className={styles.inputField}
              autoComplete="username"
              required
            />

            <div className={styles.passwordField}>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={styles.inputField}
                autoComplete="current-password"
                required
              />
              <span
                className={styles.toggleEye}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className={styles.options}>
              <label className={styles.remember}>
                <input type="checkbox" />
                Remember me
              </label>
              <Link href="/forgot-password" className={styles.forgot}>
                Forgot password?
              </Link>
            </div>

            {state?.error && (
              <div className={styles.error}>
                <p>{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className={styles.signup}>
            Don't have an account yet? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
