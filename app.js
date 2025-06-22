    const key = "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";
    const inputText = document.getElementById("input");
    const image = document.getElementById("image");
    const GenBtn = document.getElementById("btn");
    const img = document.getElementById("img");
    const loading = document.getElementById("loading");
    const resetBtn = document.getElementById("reset");
    const downloadBtn = document.getElementById("download");

    async function query(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
        {
          headers: {
            Authorization: `Bearer ${key}`,
            Accept: "image/png",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ inputs: data }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate image. Model may be loading or invalid input.");
      }
      return await response.blob();
    }

    async function generate() {
      const prompt = inputText.value.trim();
      if (!prompt) return alert("Please enter a description.");
      loading.style.display = "block";
      image.style.display = "none";

      try {
        const blob = await query(prompt);
        const objectUrl = URL.createObjectURL(blob);
        image.src = objectUrl;
        image.style.display = "block";
        loading.style.display = "none";

        downloadBtn.onclick = () => download(objectUrl);
      } catch (err) {
        loading.style.display = "none";
        alert(err.message);
      }
    }

    GenBtn.addEventListener("click", () => {
      generate();
      img.style.display = "none";
    });

    inputText.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        generate();
        img.style.display = "none";
      }
    });

    resetBtn.addEventListener("click", () => {
      inputText.value = "";
      image.style.display = "none";
    });

    function download(objectUrl) {
      fetch(objectUrl)
        .then((res) => res.blob())
        .then((file) => {
          let a = document.createElement("a");
          a.href = URL.createObjectURL(file);
          a.download = new Date().getTime() + ".png";
          a.click();
        })
        .catch(() => alert("Download failed."));
    }
