"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LanguageModelingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/category/language-modeling");
  }, [router]);
  return null;
}
