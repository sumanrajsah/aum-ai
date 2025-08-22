'use client'
import Image from "next/image";
import './style.css'
import SideBar from "../sidebar/sidebar";
import React from "react";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import { useSidebarStore } from "@/store/useSidebarStore";
import { usePathname } from "next/navigation";
import Modal from "../modal";
import HistoryBar from "../sidebar/historyBar";

export default function PageStruct1({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, toggleSidebar } = useSidebarStore();
    const pathname = usePathname();

    return (
        <>
            <Modal />
            {(pathname !== '/login' && pathname !== '/signup') ? <div className="page-struct1">
                <Header />
                <Sidebar />
                <HistoryBar />
                <div className={`page-struct1-body ${isSidebarOpen ? 'collapsed-page' : 'expanded'} `} >
                    {children}
                </div>

            </div> : <>{children}</>}
        </>
    );
}
