"use client";

import Link from "next/link";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { useTransitionDispatch } from "@/components/transitionProvider";

export default function Home() {
  const pathName = usePathname();
  const [scope, animate] = useAnimate();
  const router = useRouter();
  const dispatchTransition = useTransitionDispatch();

  useEffect(() => {
    console.log("Home loaded");
  });

  return (
    <div className="bg-slate-50" ref={scope}>
      <div className="w-[50vw] bg-slate-900 rounded-r-2xl" id="login-block">
        <div
          className="p-20 flex justify-between flex-col h-screen"
          id="helloWorld"
        >
          <div className="text-slate-50 font-bold text-8xl">Hello World</div>
          <div>
            <button
              className="bg-slate-100 p-4 rounded-md w-fit"
              onClick={async () => {
                const res = axios.get("https://dummyjson.com/products/1");
                console.log(res);
                animate("#helloWorld", { opacity: 0 }, { duration: 0.001 });
                await animate(
                  "#login-block",
                  {
                    width: "100vw",
                  },
                  {
                    duration: 0.1,
                    ease: "easeOut",
                  }
                );
                dispatchTransition({
                  type: "loading",
                });
                await new Promise<void>((resolve) =>
                  setTimeout(() => resolve(), 1000)
                );
                await res;
                if ((await res).status === 200)
                  dispatchTransition({
                    type: "none",
                  });
                console.log(res);
                console.log("CLICKED");
                router.push("/dashboard");
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
