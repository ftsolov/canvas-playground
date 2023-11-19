import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

type PolaroidPictureProps = {
  image: any;
  mouse: any;
  canvasRef: any;
  key: "string";
};

export default function PolaroidPicture({
  image,
  mouse,
  canvasRef,
  key,
}: PolaroidPictureProps) {
  return (
    <motion.div
      key={key}
      dragConstraints={canvasRef}
      dragElastic={0.2}
      dragTransition={{
        power: 0.1,
      }}
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
      className={`border-1 absolute h-32 w-32 overflow-hidden rounded-lg shadow-md transition-shadow duration-100 hover:cursor-pointer hover:shadow-lg`}
    >
      <Image src={image.url} alt="image" layout="fill" draggable={false} />
    </motion.div>
  );
}
