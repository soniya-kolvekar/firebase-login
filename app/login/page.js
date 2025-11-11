"use client";
import { useState } from "react";
import { createAccount, resetEmail } from "../core/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <>
      <div className="bg-[#5581B1] text-black min-h-screen w-full flex flex-col items-center justify-center space-y-5">
        <h1 className="text-3xl font-bold text-white mb-4">Create Account</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-[400px] bg-white p-4 rounded-md outline-none"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />

        <input
          type="password"
          placeholder="Create a password"
          className="w-[400px] bg-white p-4 rounded-md outline-none"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />

        
        <button
          onClick={async () => {
            console.log(email, password);
            await createAccount(email, password);
            router.push("/profile"); 
          }}
          className="bg-yellow-200 text-black w-[200px] p-4 mt-3 rounded-md hover:bg-yellow-300"
        >
          Sign Up
        </button>

        
        <button
          onClick={async () => {
            if (!email) return alert("Enter email first!");
            await resetEmail(email);
          }}
          className="bg-green-200 text-black w-[200px] p-4 mt-3 rounded-md hover:bg-green-300"
        >
          Forgot Password?
        </button>

        
        
        <button
          onClick={() => router.push("/SignIn")}
          className="bg-orange-200 text-black w-[200px] p-4 mt-3 rounded-md hover:bg-orange-300"
        >
          Already have an account?
        </button>
      </div>
    </>
  );
}
