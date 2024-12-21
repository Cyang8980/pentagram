"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      console.log("before if !data.success")
      if (!data.success) {
        throw new Error(data.error || "Failed to generate image");
      }
      console.log(data.imageUrl)
      if (data.imageUrl) {
        const img = new Image();
        img.onload = () => {
          setImageUrl(data.imageUrl);
        };
        img.src = data.imageUrl;
      }

      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-blue-950 dark:bg-blue-800">
      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <h1 className="text-4xl font-semibold text-center text-white">
          Generate Your Artwork
        </h1>
        
        {imageUrl && (
          <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105">
            <img
              src={imageUrl}
              alt="Generated artwork"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}
      </main>
  
      {/* Footer with Input Form */}
      <footer className="w-full max-w-3xl mx-auto mt-8">
        <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-purple-700 rounded-lg p-6 shadow-md">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-4 rounded-lg bg-purple-100 dark:bg-purple-600 text-black dark:text-black border border-purple-300 dark:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-300 placeholder-black dark:placeholder-gray-400"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 dark:hover:bg-purple-500 transition-all disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );  
}  