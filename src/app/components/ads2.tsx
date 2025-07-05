import { useEffect, useRef } from "react";

const AdComponent2 = () => {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (adRef.current) {
            // Clear existing content (prevents duplication)
            adRef.current.innerHTML = "";

            // Create ad configuration script
            const script1 = document.createElement("script");
            script1.type = "text/javascript";
            script1.innerHTML = `
                atOptions = {
                    'key' : '03776d5c77782cd6c742367e9cdc4ed2',
                    'format' : 'iframe',
                    'height' : 300,
                    'width' : 160,
                    'params' : {}
                };
            `;
            adRef.current.appendChild(script1);

            // Create ad loading script
            const script2 = document.createElement("script");
            script2.type = "text/javascript";
            script2.src = "//gappoison.com/03776d5c77782cd6c742367e9cdc4ed2/invoke.js";
            script2.async = true;
            adRef.current.appendChild(script2);
        }
    }, []);

    return (
        <div>
            <div ref={adRef} style={{ width: "160px", height: "300px" }}></div>
        </div>
    );
};

export default AdComponent2;
