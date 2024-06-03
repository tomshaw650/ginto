"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitButton({
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const buttonContent = pending ? props.pendingcontent : children;

  return (
    <Button
      type="submit"
      variant={props.variant}
      size={props.size}
      className={props.className}
      disabled={pending}
      {...props}
    >
      {buttonContent}
    </Button>
  );
}

interface SubmitButtonProps {
  children: React.ReactNode | string;
  pendingcontent?: React.ReactNode | string;
  [propName: string]: any;
}
