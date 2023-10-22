"use client";
import { ChangeEvent, useState } from "react";
import ErrorModal from "./errorModal";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
//Modal close function
  const closeErrorModal = () => {
    setError(null);
  };
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    validateForm(value, password);
    setError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateForm(username, value);
    setError(null);
  };
  //Validation for inputs
  const validateForm = (username: string, password: string) => {
    const isValid = username.trim() !== "" && password.trim() !== "";
    setIsFormValid(isValid);
  };

//Login logic 
  const handleLogin = () => {
    if (isFormValid) {
      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            document.cookie = `token=${data.token}; HttpOnly; Secure; SameSite=Strict`;
            window.location.href = "/dashboard";    //Redirect to dashboard page
          } else {
            setError("Incorrect username or password.");
          }
        })
        .catch((error) => {
          setError("Server error. Please, try again later.");
          console.error("Error:", error);
        });
    } else {
      setError("Please fill out all fields.");
    }
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Login</h1>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-600"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          className="mt-1 p-2 w-64 border rounded"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          className="mt-1 p-2 w-64 border rounded"
        />
      </div>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
    </main>
  );
}
