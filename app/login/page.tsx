"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginDbUser } from "@/app/actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const jwt = response.credential;
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      
      const realUser = {
        name: payload.name || "Google User",
        email: payload.email,
        phone: "+977-9800000000",
        avatar: payload.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
      };

      localStorage.setItem("customer_session", JSON.stringify(realUser));
      router.push(searchParams.get("redirect") || "/");
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Error decoding Google JWT credential:", err);
      setError("Failed to decode Google account details.");
    }
  };

  useEffect(() => {
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "filled_blue", 
            size: "large", 
            width: 384,
            text: "continue_with",
            shape: "rectangular"
          }
        );
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [clientId]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !password.trim()) {
      setError("Please enter your email or phone and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginDbUser(loginInput, password);
      setLoading(false);

      if (!res.success || !res.user) {
        setError(res.error || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("customer_session", JSON.stringify(res.user));
      if (res.user.role === "admin") {
        sessionStorage.setItem("admin_auth", "true");
      }
      window.dispatchEvent(new Event("storage"));

      if (res.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(searchParams.get("redirect") || "/");
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError("");
    
    setTimeout(() => {
      const mockGoogleUser = {
        name: "Google Guest User",
        email: "google.guest@gmail.com",
        phone: "+977-9800000000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
      };
      
      localStorage.setItem("customer_session", JSON.stringify(mockGoogleUser));
      setLoading(false);
      router.push(searchParams.get("redirect") || "/");
      window.dispatchEvent(new Event("storage"));
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-8 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">
            M
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Welcome Back</h2>
          <p className="text-xs text-foreground/60">Sign in to sync your cart and tracks orders</p>
        </div>

        {/* Social Authentication buttons */}
        <div className="space-y-3">
          {clientId ? (
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <div id="google-signin-btn" className="w-full min-h-[44px] flex justify-center"></div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center">Secure Google OAuth Gateway</p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 bg-background border border-card-border hover:bg-card-bg dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {/* Google SVG G logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.04 2.15v1.78h3.29c1.92-1.78 3.8-5.78 3.8-5.78z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.29-1.78c-.91.61-2.07.97-3.67.97-3.13 0-5.78-2.11-6.73-4.96H1.05v1.85C3.04 20.12 7.15 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 15.32c-.25-.7-.39-1.45-.39-2.22s.14-1.52.39-2.22V7.03H1.05C.38 8.38 0 10.15 0 12s.38 3.62 1.05 4.97l4.22-1.65z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.15 0 3.04 3.88 1.05 7.03l4.22 1.65c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                Continue with Google (Demo Mode)
              </button>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[10px] text-amber-400 font-bold leading-normal space-y-1.5">
                <div className="flex items-center gap-1.5">⚠️ Real Google OAuth is Disabled</div>
                <p className="text-slate-400 font-medium lowercase">
                  To enable real Google Account login, please add the client ID to your <code className="text-primary font-bold">.env</code>:
                  <br />
                  <code className="text-slate-200 select-all block mt-1 bg-black/30 p-1.5 rounded-lg border border-slate-800">NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider text block */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border"></div>
          </div>
          <span className="relative bg-card-bg px-3.5 text-[10px] text-foreground/45 uppercase font-bold tracking-widest">
            Or Sign in with Email / Phone
          </span>
        </div>

        {/* Login Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Email or Phone Number</label>
            <input
              type="text"
              placeholder="e.g. user@gmail.com or 98XXXXXXXX"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              disabled={loading}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Password</label>
              <Link href="#" className="text-[10px] text-primary font-bold hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {error && <p className="text-[10px] text-red-500 font-bold text-center">{error}</p>}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-card-border text-primary focus:ring-primary w-4 h-4"
            />
            <label htmlFor="remember" className="text-[11px] font-medium text-foreground/80 cursor-pointer">
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center pt-2 space-y-2.5 border-t border-card-border">
          <p className="text-xs text-foreground/70">
            New to Mobile Store?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
