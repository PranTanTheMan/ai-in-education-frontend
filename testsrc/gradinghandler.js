document.addEventListener("DOMContentLoaded", () => {
  const rubrics = JSON.parse(localStorage.getItem("rubrics")) || [];
  const totalScore = parseInt(localStorage.getItem("totalScore")) || 0;

  const rubricsList = document.getElementById("rubricsList");
  rubricsList.innerHTML = "<h3>Rubrics:</h3>";
  rubrics.forEach((rubric) => {
    rubricsList.innerHTML += `<p>${rubric.description}: ${rubric.points} points</p>`;
  });

  const totalScoreDisplay = document.getElementById("totalScoreDisplay");
  totalScoreDisplay.textContent = totalScore;

  const gradingForm = document.getElementById("grading-form");
  const loadingIcon = document.querySelector(".loading-icon");
  const resultContainer = document.querySelector(".result-container");

  gradingForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    loadingIcon.style.display = "block";

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (file) {
      try {
        const text = await processImageWithOCR(file);
        const gptResponse = await sendToGPT(text, rubrics, totalScore);

        resultContainer.innerHTML = `<h2>Grading Result:</h2><p>Score: ${gptResponse.score}</p><p>Feedback: ${gptResponse.feedback}</p>`;
      } catch (error) {
        resultContainer.innerHTML = `<h2>Error:</h2><p>${error.message}</p>`;
      } finally {
        loadingIcon.style.display = "none";
      }
    } else {
      resultContainer.innerHTML = `<h2>Error:</h2><p>Please upload a file before grading.</p>`;
      loadingIcon.style.display = "none";
    }
  });

  async function processImageWithOCR(file) {
    return new Promise((resolve, reject) => {
      //a sample tesseract instance as well
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          Tesseract.recognize(image, "eng", {
            logger: (info) => console.log(info),
          })
            .then(({ data: { text } }) => {
              resolve(text);
            })
            .catch((error) => {
              reject(error);
            });
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function sendToGPT(text, rubrics, totalScore) {
    // this is a mock API call, replace it with the actual API endpoint and logic
    const apiUrl = "https://api.example.com/gpt";

    const requestData = {
      text: text,
      rubrics: rubrics,
      totalScore: totalScore,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          score: data.score,
          feedback: data.feedback,
        };
      } else {
        throw new Error("Failed to grade the document.");
      }
    } catch (error) {
      throw new Error("Failed to communicate with the server.");
    }
  }
});
