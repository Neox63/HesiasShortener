const socket = io();

socket.on("click", ({ code, clicks }) => {
  const cell = document.querySelector(`.clicks[data-code="${code}]`);

  if (!cell) return;

  cell.textContent = clicks;
  cell.classList.add("flash");
  setTimeout(() => cell.classList.remove("flash"), 500);
});
