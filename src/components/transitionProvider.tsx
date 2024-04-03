"use client";

import {
  AnimatePresence,
  animate,
  easeOut,
  motion,
  useAnimate,
} from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useRive } from "@rive-app/react-canvas";

const TransitionContext = createContext<ITransition>({} as ITransition);
const TransitionDispatchContext = createContext<Dispatch<Action>>(
  {} as Dispatch<Action>
);

interface ITransition {
  state: "success" | "fail" | "loading" | "none";
  message: string;
}

type Action = {
  type: string;
  message?: string;
};

type LoadingProps = {
  animate: typeof animate;
  transition: ITransition;
  dispatch: Dispatch<Action>;
  setShowChildren: Dispatch<SetStateAction<boolean>>;
  setShowLoading: Dispatch<SetStateAction<boolean>>;
  defaultState?: ITransition["state"];
};

const Loading = ({
  animate,
  transition,
  dispatch,
  setShowChildren,
  setShowLoading,
  defaultState = "loading",
}: LoadingProps) => {
  const { rive, RiveComponent } = useRive({
    src: "/loaderOne.riv",
    autoplay: true,
  });

  const [status, setStatus] = useState<ITransition["state"]>(defaultState);

  useEffect(() => {
    if (transition.state === "success") {
      animate(
        "#loading-anim",
        { opacity: 0 },
        { duration: 0.5, type: "spring" }
      );
      animate(
        "#loading-container",
        { backgroundColor: "green" },
        { duration: 1.5, type: "spring" }
      );
      setStatus("success");
    }
  }, [transition, animate]);

  useEffect(() => {
    if (status === "success") {
      const successTransition = async () => {
        console.log("TRYING");
        await animate(
          "#success-text",
          { opacity: 1 },
          { duration: 0.5, type: "spring" }
        );

        dispatch({
          type: "none",
        });
      };
      successTransition();
    }
  }, [status, animate, dispatch, setShowChildren]);

  useEffect(() => {
    if (transition.state === "none") {
      const noneTransition = async () => {
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
        setShowChildren(true);
        animate(
          "#loading-container",
          {
            borderRadius: "2vh 0 0 2vh",
          },
          { duration: 0.001 }
        );
        animate(
          "#loading-content",
          {
            opacity: 0,
          },
          {
            duration: 0.5,
            type: "spring",
          }
        );
        await animate(
          "#loading-container",
          {
            marginLeft: "100vw",
          },
          { duration: 1, ease: "easeInOut" }
        );
        setShowLoading(false);
      };
      noneTransition();
    }
  }, [transition, animate, setShowChildren, setShowLoading]);

  return (
    <div
      className="bg-slate-900 h-screen w-screen fixed z-50 flex justify-center items-center"
      id="loading-container"
    >
      <motion.div
        className="text-8xl text-slate-50 font-extrabold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        id="loading-content"
      >
        {status === "loading" ? (
          <div className="z-100 w-[50vw] h-[50vh]" id="loading-anim">
            <RiveComponent />
          </div>
        ) : (
          <></>
        )}

        {status === "success" ? (
          <motion.div
            className="z-100 text-8xl text-slate-50 font-extrabold opacity-0"
            id="success-text"
            transition={{ duration: 0.5, type: "spring" }}
          >
            Success
          </motion.div>
        ) : (
          <></>
        )}
      </motion.div>
    </div>
  );
};

export const TransitionProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [transition, dispatch] = useReducer(
    transitionReducer,
    initialTransition
  );
  const [showChildren, setShowChildren] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    switch (transition.state) {
      case "success":
        // setShowChildren(false);
        setShowLoading(true);
        break;

      case "fail":
        // setShowChildren(false);
        // setShowLoading(true);
        break;

      case "loading":
        setShowChildren(false);
        setShowLoading(true);
        break;

      case "none":
        // setShowChildren(true);
        // setShowLoading(false);
        break;

      default:
        setShowChildren(true);
        setShowLoading(false);
    }
  }, [transition]);
  const [scope, animate] = useAnimate();
  const pathName = usePathname();
  console.log(pathName);
  return (
    <TransitionContext.Provider value={transition}>
      <TransitionDispatchContext.Provider value={dispatch}>
        <AnimatePresence mode="wait">
          <div ref={scope}>
            {showLoading ? (
              <Loading
                animate={animate}
                transition={transition}
                dispatch={dispatch}
                setShowChildren={setShowChildren}
                setShowLoading={setShowLoading}
              />
            ) : (
              <></>
            )}
          </div>
          {showChildren ? <div key={pathName}>{children}</div> : <></>}
        </AnimatePresence>
      </TransitionDispatchContext.Provider>
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  return useContext(TransitionContext);
};

export const useTransitionDispatch = () => {
  return useContext(TransitionDispatchContext);
};

const transitionReducer = (
  transition: ITransition,
  action: Action
): ITransition => {
  switch (action.type) {
    case "loading":
      console.log("LOADING");
      return {
        ...transition,
        state: "loading",
      };

    case "success":
      console.log("success");
      return {
        ...transition,
        state: "success",
      };

    case "none":
      console.log("defaulting");
      return {
        ...transition,
        state: "none",
      };
    default:
      return transition;
  }
};

const initialTransition: ITransition = {
  state: "none",
  message: "",
};
