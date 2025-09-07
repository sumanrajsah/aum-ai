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
import SpaceBackground from "../bgspace";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function PageStruct1({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, toggleSidebar } = useSidebarStore();
    const { settings, loading } = useSettingsStore();
    const pathname = usePathname();

    return (
        <>
            {settings.background === "space" && !loading && <SpaceBackground />}
            <Modal />
            {(pathname !== '/login' && pathname !== '/signup' && pathname !== '/term-and-condition') ? <div className="page-struct1">
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
