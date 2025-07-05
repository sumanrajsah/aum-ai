"use client"
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Oval } from 'react-loader-spinner'
import './style.css'
import { toast, ToastContainer } from "react-toastify";
import GoogleSignInButton from "@/app/components/GSB";
import Header from "@/app/components/header/header";
import Modal from "@/app/components/modal";
import Sidebar from "@/app/components/sidebar/sidebar";
import axios from "axios";
import AgentCard from "../components/agentCard";
import { useAuth } from "@/hooks/useAuth";

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
}
export default function AgentExplorer() {

    const router = useRouter();
    const [aiAgentsList, setAigentsList] = useState<Agent[]>([]);
    const [isFetching, setFetching] = useState(false)


    const { status, isAuthLoading } = useAuth()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
        async function getAgents() {
            setFetching(true)
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/v1/agents`, { withCredentials: true });
                if (response.data.message === 'success') {
                    setAigentsList(response.data.data)
                    setFetching(false)
                }

            } catch (e) { console.log(e); setFetching(false) }
        }
        getAgents()

    }, [status]);




    return (
        <div className="explorer-agent-body">
            <Modal />

            <div className="explorer-agent-cont">
                {aiAgentsList.map((agent, index) => (
                    <AgentCard data={agent} index={agent.aid} />
                ))}

            </div>

        </div>
    );
}