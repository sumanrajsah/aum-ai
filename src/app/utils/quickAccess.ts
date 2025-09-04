// utils/quickAccess.ts

export async function updateQuickAccess(
    userId: string,
    agentId: string,
    action: "add" | "remove"
) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/quick-access`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // keep cookies/session if required
            body: JSON.stringify({ userId, agentId, action }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to update quick access");
        }

        return await res.json(); // { message, quickAccess }
    } catch (err: any) {
        console.error("Quick access update failed:", err.message);
        throw err;
    }
}
// utils/getQuickAccess.ts

export async function getQuickAccess(userId: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URI}/v1/user/quick-access/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // keep cookies/session if needed
            }
        );

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to fetch quick access");
        }

        return await res.json(); // { uid, agents, mcp, prompts }
    } catch (err: any) {
        console.error("Quick access fetch failed:", err.message);
        throw err;
    }
}
