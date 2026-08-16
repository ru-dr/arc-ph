import { useState } from "react";
import { Input, Button } from "./ui";
import { useToast } from "../hooks/useToast";

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Login successful", "success");
        onLoginSuccess?.();
      } else {
        showToast(data.error || "Invalid credentials", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("An error occurred during login", "error");
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="text"
        label="Username"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full"
        autoComplete="username"
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full"
        autoComplete="current-password"
      />
      <Button
        type="submit"
        color="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;