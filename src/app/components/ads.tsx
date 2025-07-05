import { useEffect, useRef } from "react";

const AdComponent = () => {
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
                    'key' : '507d4af45edca5d3a2b14adde5810520',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            `;
            adRef.current.appendChild(script1);

            // Create ad loading script
            const script2 = document.createElement("script");
            script2.type = "text/javascript";
            script2.src = "//gappoison.com/507d4af45edca5d3a2b14adde5810520/invoke.js";
            script2.async = true;
            adRef.current.appendChild(script2);
        }
    }, []);

    return (
        <div>
            <div ref={adRef} style={{ width: "320px", height: "50px" }}></div>
        </div>
    );
};

export default AdComponent;
