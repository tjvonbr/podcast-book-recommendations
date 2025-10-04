import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={[
        "rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-[#0a0a0a] shadow-sm",
        className || "",
      ].join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div className={["p-4 sm:p-6", className || ""].join(" ")} {...props} />
  );
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <h3
      className={[
        "text-base sm:text-lg font-semibold leading-none tracking-tight",
        className || "",
      ].join(" ")}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: DivProps) {
  return (
    <p
      className={["text-sm text-black/60 dark:text-white/60", className || ""].join(" ")}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return (
    <div className={["p-4 sm:p-6 pt-0", className || ""].join(" ")} {...props} />
  );
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div className={["p-4 sm:p-6 pt-0", className || ""].join(" ")} {...props} />
  );
}


