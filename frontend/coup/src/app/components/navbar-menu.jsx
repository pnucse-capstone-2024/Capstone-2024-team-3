"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children
}) => {
  return (
    (<div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer opacity-[0.9] hover:opacity-[1] text-white">
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}>
          {active === item && (
            <div
              className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                // layoutId ensures smooth animation
                layoutId="active"
                className="bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-white shadow-xl">
                <motion.div
                  // layout ensures smooth animation
                  layout
                  className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>)
  );
};

export const Menu = ({
  setActive,
  children
}) => {
  return (
    (<nav
      // resets the state
      onMouseLeave={() => setActive(null)}
      className="w-full relative rounded-full border border-transparent bg-black border-white shadow-input flex justify-center space-x-4 px-8 py-6">
      {children}
    </nav>)
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src
}) => {
  return (
    (<Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl" />
      <div>
        <h4 className="text-xl font-bold mb-1 text-white">
          {title}
        </h4>
        <p className="text-sm max-w-[10rem] text-neutral-200 hover:text-white">
          {description}
        </p>
      </div>
    </Link>)
  );
};

export const HoveredLink = ({
  children,
  ...rest
}) => {
  return (
    (<Link
      {...rest}
      className="text-neutral-200 hover:text-white ">
      {children}
    </Link>)
  );
};
