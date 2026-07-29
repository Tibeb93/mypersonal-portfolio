import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={`relative bg-[#141B2D] border border-white/[0.08] rounded-2xl w-full ${sizes[size]}
              shadow-2xl max-h-[90vh] flex flex-col`}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06] flex-shrink-0">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400
                  hover:text-white hover:bg-white/5 transition-colors">
                <HiX size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
