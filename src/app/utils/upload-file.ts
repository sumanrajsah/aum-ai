import axios from "axios";

export const uploadFileToServer = async (
    file: File, uid: string
): Promise<{ url: string; data: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URI}/v1/user/assets/${uid}`,
            formData,
            {
                withCredentials: true
            }
        );

        const result = response.data;

        return {
            url: result?.url || '',
            data: result?.message || '',
        };
    } catch (error: any) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'Something went wrong during upload');
    }
};
