import React, { useState } from "react";
import useSignup from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const { loading, error, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(email, password);
  };

  return (
    <div className="flex mt-10 justify-center  ">
      <form action="" onSubmit={handleSubmit} className="flex flex-col gap-1">
        <h3 className="text-center font-bold text-lg">Signup</h3>
        <label htmlFor="" className="">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-100 rounded-sm outline-1 outline-zinc-500 p-2"
        />

        <label htmlFor="">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-100 rounded-sm outline-1 outline-zinc-500 p-2"
        />

        <button
          disabled={loading}
          className="font-bold bg-zinc-800 text-zinc-100 rounded-lg p-3 hover:bg-zinc-700 my-2"
        >
          Signup
        </button>

        {error && <p className="text-zinc-500">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
