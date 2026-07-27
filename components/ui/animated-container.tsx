"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedContainer({ children, className, delay = 0 }: AnimatedContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedStaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
