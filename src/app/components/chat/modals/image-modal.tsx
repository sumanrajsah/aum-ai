import { useEffect, useRef, useState } from "react";
import './image-modal.css'
import { BrainCircuit, Images, Info, Layers, LogOut, Pickaxe, PlusCircle, Server, Settings, Telescope, User2, Wrench, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useAuth } from "../../../../hooks/useAuth";
import { useAlert } from "../../../../context/alertContext";
import Image from "next/image";
import axios from "axios";
import { useChat, useImagePlaygound, useWorkspace } from "../../../../context/ChatContext";
import ModalCont from "../../modal/modalCont";



const ImageModal = () => {
    const { expandImage } = useImagePlaygound() as { expandImage?: ImageMetadata };
    const [imageLoaded, setImageLoaded] = useState(false);
    const [image, setImage] = useState(true);
    if (!expandImage) {
        return null;
    }

    useEffect(() => {

        const img = new (typeof window !== "undefined" ? window.Image : globalThis.Image)();
        img.src = expandImage.image_url;

        img.onload = () => {
            setImageLoaded(true);

        };

        img.onerror = (error) => {
            console.error("Image failed to load", error);
            setImageLoaded(true); // Set true to prevent loading spinner loop

        };
    }, [expandImage?.image_url]);



    return (
        <ModalCont>
            <div className="toggle-buttons">
                <button
                    className={image ? 'active' : ''}
                    onClick={() => setImage(true)}
                >
                    <Images size={12} /> Image
                </button>
                <button
                    className={!image ? 'active' : ''}
                    onClick={() => setImage(false)}
                >
                    <Info size={12} />Info
                </button>
            </div>

            {!imageLoaded && <div className='loading-img'> <Image
                src={'/sitraone.png'} // Icons stored in the public folder
                alt={'0xXplorer AI'}
                width={30}
                height={30}
            /></div>}
            {imageLoaded && expandImage && image && <img
                src={expandImage.image_url}
                alt={expandImage.revised_prompt}

                className="expanded-img"
            />}
            {!image && <div className="image-info">
                <label>Model:</label>
                <p>{expandImage?.model.name}</p>
                <label>Created:</label>
                <p>{expandImage?.created ? new Date(expandImage.created).toLocaleString() : ''}</p>
                {expandImage?.revised_prompt && <label>Revised Prompt</label>}
                {expandImage?.revised_prompt && <p>{expandImage?.revised_prompt}</p>}
                {expandImage?.prompt && <label>Prompt</label>}
                {expandImage?.prompt && <p>{expandImage?.prompt}</p>}
                {expandImage?.config && <label>Config</label>}
                {expandImage?.config && <p>{expandImage?.config.size}</p>}
            </div>}

        </ModalCont>
    );
};

export default ImageModal;
