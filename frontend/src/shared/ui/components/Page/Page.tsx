import { motion } from 'framer-motion'

export function Page({ children }: React.PropsWithChildren) {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .7 }}>
      {children}
    </motion.div>
  )
}
