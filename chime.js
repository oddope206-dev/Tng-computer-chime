// TNG-style double chime with tweakable parameters.
// Uses Tone.js (Web Audio). Call window.playChime() to trigger.
(function () {
  const defaultParams = {
    pitch1: 1560,
    pitch2: 1720,
    glide: 1.06,
    gap: 0.07,
    hipass: 1200,
    wet: 0.12,
    decay: 0.60,
    vol: -10
  };

  // Read from URL params (so you can share exact timbre)
  const url = new URL(window.location.href);
  const P = Object.fromEntries(Object.entries(defaultParams).map(([k,v]) => {
    const raw = url.searchParams.get(k);
    const num = raw === null ? v : Number(raw);
    return [k, Number.isFinite(num) ? num : v];
  }));

  const synth = new Tone.FMSynth({
    harmonicity: 2.5,
    modulationIndex: 8,
    oscillator: { type: "sine" },
    modulation: { type: "triangle" },
    envelope: { attack: 0.002, decay: 0.12, sustain: 0.0, release: 0.08 },
    modulationEnvelope: { attack: 0.001, decay: 0.06, sustain: 0.0, release: 0.03 }
  }).toDestination();

  const hiPass = new Tone.Filter(P.hipass, "highpass").toDestination();
  synth.connect(hiPass);

  const verb = new Tone.Reverb({ decay: P.decay, wet: P.wet }).toDestination();
  hiPass.connect(verb);

  Tone.getDestination().volume.value = P.vol;

  async function playChime() {
    await Tone.start();
    const now = Tone.now();

    // chirp #1 (slight upward bend)
    synth.frequency.setValueAtTime(P.pitch1, now);
    synth.frequency.exponentialRampToValueAtTime(P.pitch1 * P.glide, now + 0.06);
    synth.triggerAttackRelease(P.pitch1, 0.09, now);

    // chirp #2
    const t2 = now + P.gap;
    synth.frequency.setValueAtTime(P.pitch2, t2);
    synth.frequency.exponentialRampToValueAtTime(P.pitch2 * P.glide, t2 + 0.05);
    synth.triggerAttackRelease(P.pitch2, 0.08, t2);
  }

  // UI wiring (sliders ↔ params ↔ URL)
  function $(id){ return document.getElementById(id); }
  function bindSlider(id, key) {
    const el = $(id);
    const out = el.parentElement.querySelector("output");
    el.value = P[key];
    out.textContent = el.value;
    el.addEventListener("input", () => {
      P[key] = Number(el.value);
      out.textContent = el.value;
      // live update
      if (key === "hipass") hiPass.frequency.value = P.hipass;
      if (key === "wet") verb.wet.value = P.wet;
      if (key === "decay") verb.decay = P.decay;
      if (key === "vol") Tone.getDestination().volume.value = P.vol;
      // update URL
      const u = new URL(window.location.href);
      Object.entries(P).forEach(([k,v]) => u.searchParams.set(k, v));
      history.replaceState({}, "", u);
    });
  }

  ["pitch1","pitch2","glide","gap","hipass","wet","decay","vol"].forEach(k => bindSlider(k,k));

  $("play").addEventListener("click", playChime);
  $("copy").addEventListener("click", async () => {
    const u = new URL(window.location.href);
    Object.entries(P).forEach(([k,v]) => u.searchParams.set(k, v));
    try {
      await navigator.clipboard.writeText(u.toString());
      alert("URL with settings copied to clipboard.");
    } catch(e) {
      prompt("Copy this URL:", u.toString());
    }
  });

  // expose
  window.playChime = playChime;
})();