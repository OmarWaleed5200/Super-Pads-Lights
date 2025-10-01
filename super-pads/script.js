const pads = document.querySelectorAll(".pad");

pads.forEach(pad => {
  pad.addEventListener("click", () => {
    const sound = pad.dataset.sound;
    const audio = new Audio(`sounds/${sound}.mp3`);
    audio.play();

    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 200);
  });
});
