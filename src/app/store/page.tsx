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
import { useAuth } from "@/hooks/useAuth";
import { useMcpServer } from "@/context/ChatContext";
import MCPServerCard from "../components/mcpComp/mcpcard";

export default function ExplorerPage() {
    const { status, isAuthLoading } = useAuth()



    return (
        <div className="explorer">

        </div>

    );
}