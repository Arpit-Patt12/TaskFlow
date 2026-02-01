import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-cyber-50 via-violet-50 to-rose-50 dark:from-slate-cyber-900 dark:via-slate-cyber-800 dark:to-violet-900/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-effect backdrop-blur-xl dark:bg-slate-cyber-800/70 rounded-3xl shadow-2xl p-8 border border-cyan-300/40 dark:border-cyan-500/30">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-cyan-700/70 dark:text-cyan-300/70 mb-8 font-medium">
            Sign in to continue to TaskFlow
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-modern w-full px-4 py-3 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-modern w-full px-4 py-3 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-300 dark:border-rose-700/50 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-modern-primary w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-rose-400 disabled:to-rose-400 text-white font-bold rounded-xl shadow-lg hover:shadow-rose-500/50 transition-all duration-200 uppercase tracking-wider"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-cyan-700/70 dark:text-cyan-300/70 mt-8 font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-rose-600 dark:text-rose-400 hover:underline font-bold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
