import React, { useState, useEffect } from "react";

const StickerRenderer = ({ theme, count = 5 }) => {
  const [stickers, setStickers] = useState([]);
  const [fade, setFade] = useState(false);

  const stickerSets = {
    theme_happy: { id: 1, src: "/stickers/happy.png" },
    theme_love: { id: 1, src: "/stickers/love.png" },
    theme_sad: { id: 1, src: "/stickers/sad.png" },
    theme_angry: { id: 1, src: "/stickers/angry.png" },
    theme_calm: { id: 1, src: "/stickers/calm.png" },
    theme_neutral: { id: 1, src: "/stickers/neutral.png" },
  };

  // Generate stickers with even distribution and slight randomness
  const generateStickers = (selectedTheme) => {
    const selectedSticker =
      stickerSets[selectedTheme] || stickerSets.theme_neutral;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    return Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const baseX = (col + 0.5) * (100 / cols);
      const baseY = (row + 0.5) * (100 / rows);
      const offsetX = (Math.random() - 0.5) * (20 / cols);
      const offsetY = (Math.random() - 0.5) * (20 / rows);
      const x = `${Math.min(Math.max(baseX + offsetX, 5), 95)}%`;
      const y = `${Math.min(Math.max(baseY + offsetY, 5), 95)}%`;
      const randomSize = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
      const randomRotation = Math.floor(Math.random() * (30 - -30 + 1)) - 30;

      return {
        ...selectedSticker,
        id: `${selectedSticker.id}-${index}`,
        x,
        y,
        size: randomSize,
        rotation: randomRotation,
      };
    });
  };

  // Initialize stickers on mount
  useEffect(() => {
    setStickers(generateStickers(theme));
    setTimeout(() => setFade(true), 50); // Minimal delay for initial fade-in
  }, []);

  // Update stickers on theme or count change
  useEffect(() => {
    if (!stickers.length) return;

    setFade(false); // Start fade-out
    setTimeout(() => {
      const newStickers = generateStickers(theme);
      setStickers(newStickers);

      // Wait for all images to load
      const loadImages = newStickers.map((s) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = s.src;
          img.onload = resolve;
          img.onerror = resolve; // Handle error gracefully
        });
      });

      Promise.all(loadImages).then(() => {
        setFade(true); // Start fade-in after all images are ready
      });
    }, 1000); // Match your fade-out timing
  }, [theme, count]);

  return (
    <div className="sticker-container">
      {stickers.map((sticker) => (
        <img
          key={sticker.id}
          src={sticker.src}
          alt="sticker"
          className={`sticker ${fade ? "fade-in" : "fade-out"}`}
          style={{
            left: sticker.x,
            top: sticker.y,
            width: `${sticker.size}px`,
            transform: `rotate(${sticker.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default StickerRenderer;
