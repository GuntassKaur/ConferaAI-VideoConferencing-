"use client";

export default function MeetingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">
          Meeting Connected
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-xl aspect-video"></div>
          <div className="bg-slate-800 rounded-xl aspect-video"></div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="bg-indigo-500 px-4 py-2 rounded-lg">
            Mic
          </button>

          <button className="bg-indigo-500 px-4 py-2 rounded-lg">
            Camera
          </button>

          <button className="bg-red-500 px-4 py-2 rounded-lg">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
