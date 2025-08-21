window.onload = () => {
  const blocks = document.querySelectorAll(".healthBar .health-block");
  const total = blocks.length;
  blocks.forEach((block, i) => {
    // Calculate a percentage from 0 → 1 (top to bottom)
    let ratio =1 - ( i / (total - 1));

    // Interpolate from green (0,255,0) → yellow (255,255,0) → red (255,0,0)
    let r, g, b = 0;

    if (ratio < 0.5) {
      // Green → Yellow (increase red)
      r = Math.floor(255 * (ratio / 0.5));
      g = 255;
    } else {
      // Yellow → Red (decrease green)
      r = 255;
      g = Math.floor(255 * (1 - (ratio - 0.5) / 0.5));
    }

    block.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  });
};
