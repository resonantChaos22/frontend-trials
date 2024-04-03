"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    console.log("Dashboard loaded");
  });

  const router = useRouter();

  return (
    <div className="bg-slate-50">
      <div className="p-20 flex justify-between flex-col h-[100vh] w-[50vw] bg-slate-900 rounded-r-2xl">
        <div className="text-slate-50 font-bold text-8xl">Dashboard</div>
        <button
          className="bg-slate-100 p-4 rounded-md w-fit"
          onClick={() => {
            console.log("CLICKED");
            router.push("/");
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
