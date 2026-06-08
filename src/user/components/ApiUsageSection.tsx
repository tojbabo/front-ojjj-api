"use client";

import { useEffect } from "react";
import { RequestUsageTotal } from "../api/userApi";
import { useAuthStore } from "@/src/auth/store/authStore";

export default function ApiUsageSection() {
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {

        const getUsageTotal = async () => {
            if(accessToken){
                const result = await RequestUsageTotal(accessToken);
                return result;

                // 이제 서비스 별로 count를 가져올 수 있음.
                // 그런데 count 가 0 인 서비스는 service:0 이렇게 안나옴
                // service A: 1, service B: 2, service C: 0 이렇게 나오도록 해야함 
            }
            return null;
        }

        getUsageTotal();
      }, [])
      


    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6 mt-4">
            <h2 className="text-lg font-semibold">API 서비스별 사용량</h2>
            <p className="mt-1 text-sm text-muted">
            
            </p>
            <div className="mt-4 overflow-x-auto">
            <div className="min-w-[900px] rounded-2xl border border-border bg-background">
            </div>
            </div>
        </div>
    )
}

