"use client";
import { useRouter } from "next/navigation"
import { verifyJWT } from "../app/actions/auth"
import { useEffect } from "react";


export default function verifier() {
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
          const token = localStorage.getItem("token");
          if (token) {
            const result = await verifyJWT(token);
            if (result.success) {
              return;
            } else {
              localStorage.removeItem("token");
            }
          }
          router.push("/");
        };
    
        checkToken();
      }, []);

      return (
        <></>
      );
}