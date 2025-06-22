 const key = "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";
    const input = document.getElementById("input");
    const btn = document.getElementById("btn");
    const loading = document.getElementById("loading");
    const imgEl = document.getElementById("image");
    const dlBtn = document.getElementById("download");

    async function query(prompt) {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt })
        }
      );
      if (res.status === 503) throw new Error("Model is loading, try again in a few seconds.");
      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
      const blob = await res.blob();
      return blob;
    }

    async function generate() {
      const prompt = input.value.trim();
      if (!prompt) return alert("Enter a prompt.");
      loading.style.display = "block";
      imgEl.style.display = "none";
      dlBtn.style.display = "none";
      try {
        const blob = await query(prompt);
        const url = URL.createObjectURL(blob);
        imgEl.src = url; imgEl.style.display = "block";
        dlBtn.style.display = "inline-block";
        dlBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = url;
          a.download = `img_${Date.now()}.png`;
          a.click();
        };
      } catch (err) {
        alert(err.message);
      } finally {
        loading.style.display = "none";
      }
    }

    btn.onclick = generate;
    input.onkeydown = e => { if (e.key === "Enter") generate(); };
