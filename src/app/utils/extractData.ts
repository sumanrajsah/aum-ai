import * as XLSX from "xlsx";
import * as mammoth from "mammoth";

// Utility to clean whitespace
function cleanText(text: string): string {
    return text
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{2,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
}

// TXT / JSON
export async function extractTextFromTxt(file: File): Promise<string> {
    const text = await file.text();
    return cleanText(text);
}

// DOCX
export async function extractTextFromDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return cleanText(result.value);
}

// XLSX / CSV
export async function extractTextFromXlsx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    return cleanText(csv);
}

// Code / Markup / Config Files
export async function extractTextFromCodeFile(file: File): Promise<string> {
    const text = await file.text();
    return cleanText(text);
}

// Unsupported
const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

export async function extractTextFromUnsupported(file: File): Promise<string> {
    const base64Data = await convertToBase64(file);
    return `data:${file.type};base64,${base64Data}`;
}


export const handleDataExtraction = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    const textFileExtensions = [
        "txt", "json", "js", "ts", "jsx", "tsx", "html", "css", "xml", "md",
        "markdown", "mdown", "log", "ini", "yaml", "yml", "tex", "sql", "py"
    ];
    if (ext && textFileExtensions.includes(ext)) {
        return await extractTextFromCodeFile(file);
    }

    switch (ext) {
        case "txt":
        case "json":
            return await extractTextFromTxt(file);
        // case "pdf":
        //     return await extractTextFromPdf(file);
        case "docx":
            return await extractTextFromDocx(file);
        case "csv":
        case "xlsx":
            return await extractTextFromXlsx(file);
        default:
            return await extractTextFromUnsupported(file);
    }
};
