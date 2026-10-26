// Aceternity UI Background Gradient, adapted to SBH brand colors.
// Source: https://ui.aceternity.com/components/background-gradient
import { cn } from "../../lib/cn";
import React from "react";
import { motion, useReducedMotion } from "motion/react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        aria-hidden="true"
        variants={shouldAnimate ? variants : undefined}
        initial={shouldAnimate ? "initial" : undefined}
        animate={shouldAnimate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: shouldAnimate ? "400% 400%" : undefined,
        }}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
          " bg-[radial-gradient(circle_farthest-side_at_0_100%,#5da4a2,transparent),radial-gradient(circle_farthest-side_at_100%_0,#082e6b,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#318f82,transparent),radial-gradient(circle_farthest-side_at_0_0,#5da4a2,#082e6b)]",
        )}
      />
      <motion.div
        aria-hidden="true"
        variants={shouldAnimate ? variants : undefined}
        initial={shouldAnimate ? "initial" : undefined}
        animate={shouldAnimate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: shouldAnimate ? "400% 400%" : undefined,
        }}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#5da4a2,transparent),radial-gradient(circle_farthest-side_at_100%_0,#082e6b,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#318f82,transparent),radial-gradient(circle_farthest-side_at_0_0,#5da4a2,#082e6b)]",
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
