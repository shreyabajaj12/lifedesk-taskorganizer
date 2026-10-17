import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const ThoughtOfTheDay = () => {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    const thought = async () => {
      try {
        const response =  await axiosClient.get("/api/quotes/random");
    
    
        setQuote({
          text: response.data.text,
          author: response.data.author,
        });
      } catch (error) {
        console.error("Failed to fetch quote", error);
      }
    };
    thought();
  },[]);


  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-100 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
            <Sparkles size={16} className="text-violet-500" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-violet-500">
              Daily thought
            </p>

            <h2 className="text-base font-semibold text-slate-900">
              Thought for today
            </h2>
          </div>
        </div>

        {/* Thought */}
        <div className="mt-7">
          <div className="text-xl font-semibold leading-relaxed tracking-tight text-slate-800">
            {quote ? (
              <>
                <p>{quote.text}</p>
                <p>— {quote.author}</p>
              </>
            ) : (
              <>
                <p>“The future depends on what you do today.”</p>
                <p>— Mahatma Gandhi</p>
              </>
            )}
          </div>

          <div className="mt-5 h-px w-12 bg-slate-200" />

          <p className="mt-4 text-xs text-slate-400">
            A little progress is still progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThoughtOfTheDay;
