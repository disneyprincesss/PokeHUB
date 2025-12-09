export default function Loading() {
  return (
    <div className="w-screen h-screen bg-[url('/image/library-bg.gif')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-black/50 rounded-xl px-8 py-6 text-center">
        <div className="animate-bounce text-4xl mb-4">📜</div>
        <p className="text-amber-200 font-jersey text-2xl">Loading Library...</p>
      </div>
      </div>
  );
}
