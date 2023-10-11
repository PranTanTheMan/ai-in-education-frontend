import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useAnimate } from "framer-motion";

export default function Home() {
  const [scope, animate] = useAnimate();

  const [size, setSize] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    generateGridCount();
    window.addEventListener("resize", generateGridCount);

    return () => window.removeEventListener("resize", generateGridCount);
  }, []);

  const generateGridCount = () => {
    const columns = Math.floor(document.body.clientWidth / 75);
    const rows = Math.floor(document.body.clientHeight / 75);

    setSize({
      columns,
      rows,
    });
  };

  const handleMouseLeave = (e) => {
    const id = `#${e.target.id}`;
    animate(id, { background: "rgba(129, 140, 248, 0)" }, { duration: 1.5 });
  };

  const handleMouseEnter = (e) => {
    const id = `#${e.target.id}`;
    animate(id, { background: "#18BB54" }, { duration: 0.15 });
  };

  return (
    <div className="bg-neutral-950">
      <div
        ref={scope}
        className="grid h-screen w-full grid-cols-[repeat(auto-fit,_minmax(75px,_1fr))] grid-rows-[repeat(auto-fit,_minmax(75px,_1fr))]"
      >
        {[...Array(size.rows * size.columns)].map((_, i) => (
          <div
            key={i}
            id={`square-${i}`}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="h-full w-full border-[1px] border-neutral-900"
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-8">
        <h1 className="text-center text-7xl font-black uppercase text-white sm:text-8xl md:text-9xl">
          <span className="lowercase">i</span>grader
        </h1>
        <p className="mb-6 mt-4 max-w-4xl text-center text-lg font-normal text-neutral-500 md:text-2xl">
          An automated grading system for teachers to use Tesseract OCR and
          GPT-4 to grade students' work.
        </p>
        <div className="flex gap-5">
          <button
            onClick={() => Router.push("/dashboard")}
            className="pointer-events-auto transition-all ease-in-out duration-300 hover:bg-green-300 bg-green-500 px-4 py-2 text-xl font-bold uppercase text-neutral-950 mix-blend-difference"
          >
            Get started!
          </button>
          <button
            onClick={() => Router.push("/grading")}
            className="pointer-events-auto hover:underline px-4 py-2 text-xl font-bold uppercase text-white mix-blend-difference"
          >
            Are you a student? Click here!
          </button>
        </div>
      </div>
      <div>hellow rolds</div>
    </div>
  );
}
