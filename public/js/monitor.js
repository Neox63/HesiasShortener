const socket = io();

const visits = document.querySelector("#visits");
const status = document.querySelector("#status");
const total = document.querySelector("#total");
const code = visits.dataset.code;

socket.on("connect", () => {
  status.textContent = "Connecté";

  socket.emit("watch", code, (reply) => {
    if (reply.error) status.textContent = reply.error;
  });
});

socket.on("disconnect", () => {
  status.textContent = "Déconnecté";
});

socket.on("connect_error", (err) => {
  status.textContent = err.message;
});

socket.on("visit", ({ at, referer }) => {
  const row = visits.insertRow(0);

  row.insertCell().textContent = new Date(at).toLocaleString("fr-FR");
  row.insertCell().textContent = referer ?? "Accès direct";

  row.classList.add("flash");
  setTimeout(() => row.classList.remove("flash"), 500);
});

socket.on("click", ({ code: clickedCode, clicks }) => {
  if (clickedCode === code) total.textContent = clicks;
});
