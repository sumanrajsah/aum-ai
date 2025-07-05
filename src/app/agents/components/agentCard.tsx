"use client"
import React, { useEffect } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Oval } from 'react-loader-spinner'

import { toast, ToastContainer } from "react-toastify";

interface Demo {
    id: number;
    input: string;
    output: string;
}
interface Tools {
    prebuilt: string[];
    user: string[];
}
export interface Agent {
    name: string;
    instructions: string;
    demos: Demo[];
    image: string | null;
    tools: Tools;
    isPublic: boolean;
    [key: string]: any;
    uid: string;
}
export default function AgentCard({ data }: any) {

    const router = useRouter();

    return (
        <div className="agent-card-body">
            <Image alt="one-agent" height={100} width={100} src={data.image} />
            <h3>{data.name}</h3>
            <p>{data.description}</p>
            <p>{data.uid}</p>

        </div>
    );
}