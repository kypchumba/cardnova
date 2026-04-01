export default function ToastStack({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[80] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-slate-950/90 bg-slate-950 px-4 py-3 text-white shadow-2xl backdrop-blur-xl animate-[toastIn_.25s_ease-out]"
        >
          <div className="text-sm font-semibold">{toast.title}</div>
          {toast.message ? (
            <div className="mt-1 text-sm text-slate-200">{toast.message}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
