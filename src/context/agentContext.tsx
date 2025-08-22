// context/ChatContext.tsx
'use client'
import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../hooks/useAuth";
import { v7 as uuidv7 } from 'uuid'
import { useAlert } from "./alertContext";
import VideoPlayground from "@/app/video-playground/page";
import { useLLMStyleStore } from "@/store/useLLMStyleStore";
import { getMediaSupportByModelName } from "@/app/utils/models-list";