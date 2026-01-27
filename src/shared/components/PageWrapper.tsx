import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    )
}