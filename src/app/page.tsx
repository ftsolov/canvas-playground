"use client";
import {
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useMouse } from "@uidotdev/usehooks";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster, toast } from "sonner";
import pasteContent from "~/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import PolaroidPicture from "~/components/PolaroidPicture";

export default function Canvas() {
  const [links, setLinks] = useState([]);
  const [images, setImages] = useState([]);
  const [hidden, setHidden] = useState(false);

  const [mouse, ref] = useMouse();
  const canvasRef = useRef(null);

  useHotkeys("mod+v", () => handlePaste());

  const handlePaste = async () => {
    const pasteData = await pasteContent();
    if (pasteData.type === "url") {
      setLinks((prevLinks) => [...prevLinks, pasteData]);
      toast.success("Pasted a link");
    } else if (pasteData.type === "image") {
      setImages((prevImages) => [...prevImages, pasteData]);
      console.log(images);
      toast.success("Pasted an image");
    }
  };

  const handleClick = (link: string) => {
    window.open(link, "_blank");
    console.log(link);
  };

  const handleDelete = (itemToRemove: string) => {
    console.log("delete");
    setLinks((prevLinks) => prevLinks.filter((link) => link !== itemToRemove));
  };

  return (
    <main className="h-screen w-screen" ref={canvasRef}>
      <Toaster />
      <button
        className="absolute right-4 top-4 rounded-full bg-white"
        onClick={() => setHidden((prev) => !prev)}
      >
        {hidden ? (
          <EyeSlashIcon className="h-5 w-5 text-slate-400" />
        ) : (
          <EyeIcon className="h-5 w-5 text-slate-400" />
        )}
      </button>
      <motion.div
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
          duration: 2,
        }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? 10 : 0 }}
      >
        <AnimatePresence>
          {links.map((link) => (
            <motion.div
              dragConstraints={canvasRef}
              dragElastic={0.2}
              dragTransition={{
                power: 0.1,
              }}
              key={link.id}
              drag
              initial={{
                opacity: 0,
                scale: 0.9,
                rotate: -3,
                x: mouse.x,
                y: mouse.y,
              }}
              exit={{ opacity: 0, scale: 0.9, rotate: -3 }}
              style={{ originX: 0.5, originY: 0.5 }}
              whileDrag={{ opacity: 0.7, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className={`border-1 group absolute flex flex-row items-center justify-center gap-2 rounded-lg border border-slate-100 bg-white p-4 shadow-md transition-shadow duration-100 hover:cursor-pointer hover:shadow-lg`}
            >
              <LinkIcon
                className="z-10 h-4 w-4 text-slate-300"
                onClick={() => handleClick(link.url)}
              />
              {/* <TrashIcon
                className="absolute -right-2 -top-2 z-10 hidden h-8 w-8 rounded-full border border-slate-100 bg-white p-1 text-red-300 shadow group-hover:block"
                onClick={() => handleDelete(link)}
              /> */}
              <p className="font-medium text-slate-700">{link.url}</p>
            </motion.div>
          ))}
          {images.length > 0 &&
            images.map((image) => (
              <PolaroidPicture
                image={image}
                key={image.id}
                mouse={mouse}
                canvasRef={canvasRef}
              />
            ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
