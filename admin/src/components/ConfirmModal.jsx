import { motion, AnimatePresence } from 'framer-motion'
import { HiExclamation } from 'react-icons/hi'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, danger = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            className="relative bg-[#141B2D] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4
              ${danger ? 'bg-red-500/10 border border-red-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
              <HiExclamation size={24} className={danger ? 'text-red-400' : 'text-orange-400'} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title || 'Are you sure?'}</h3>
            <p className="text-slate-400 text-sm mb-6">{message || 'This action cannot be undone.'}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} disabled={loading}
                className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                className={`flex-1 justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50
                  ${danger ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'btn-primary'}`}>
                {loading ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : null}
                {loading ? 'Deleting…' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
