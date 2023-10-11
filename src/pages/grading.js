import { useState, useEffect } from "react";
import * as Tesseract from "tesseract.js";
import OpenAI from "openai";

// import "../styles/styles.css";

export default function Grading() {
  const [rubrics, setRubrics] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});

  useEffect(() => {
    setRubrics(JSON.parse(localStorage.getItem("rubrics")) || []);
    setTotalScore(parseInt(localStorage.getItem("totalScore")) || 0);
  }, []);

  const processImagesWithOCR = async (files) => {
    const texts = [];
    for (let i = 0; i < files.length; i++) {
      const text = await processImageWithOCR(files[i]);

      texts.push(text);
    }

    return texts;
  };

  const processImageWithOCR = async (file) => {
    return new Promise((resolve, reject) => {
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
  };

  const sendToGPT = async (text, rubrics, totalScore) => {
    const rubricsString = rubrics
      .map((r) => `${r.description}: ${r.points} points`)
      .join(", ");

    console.log("Sending to GPT:", text, rubricsString, totalScore);
    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a grading assistant. Based on the rubrics provided and the content of the text, provide a score and feedback. Format your response as 'Score: XX points. Feedback: ...'.",
            },
            {
              role: "user",
              content: `The rubrics are: ${rubricsString}. The total score is ${totalScore}.`,
            },
            { role: "user", content: text },
          ],
          model: "gpt-4",
        }),
      });

      const data = await response.json();

      console.log("GPT response:", data);

      const gptResponse = data.choices[0].message.content.trim();

      // Extract score
      const scoreMatch = gptResponse.match(/Score: (\d+) points/);
      const score = scoreMatch ? scoreMatch[1] : null;

      // Extract feedback
      const feedbackMatch = gptResponse.match(/Feedback: (.+)/);
      const feedback = feedbackMatch ? feedbackMatch[1] : null;

      return {
        score: score,
        feedback: feedback,
      };
    } catch (error) {
      console.error("Error while communicating with GPT:", error);

      throw new Error("Failed to communicate with the GPT server.");
    }
  };

  const handleGradeSubmission = async (event) => {
    event.preventDefault();
    setLoading(true);

    const fileInput = document.getElementById("file");
    const files = fileInput.files;

    if (files && files.length > 0) {
      try {
        const allTexts = await processImagesWithOCR(files);
        const combinedText = allTexts.join("\n\n");

        const gptResponse = await sendToGPT(combinedText, rubrics, totalScore);

        setResult({
          score: gptResponse.score,
          feedback: gptResponse.feedback,
        });
      } catch (error) {
        setResult({
          error: error.message,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setResult({
        error: "Please upload files before grading.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col justify-center items-center text-white py-28">
      <h1 className="text-5xl mt-20 mb-20">iGrader - Student Interface</h1>

      <div className="flex w-full max-w-6xl mb-8">
        <div className="rubrics-container w-1/2 pr-8">
          <h2 className="text-2xl mb-4">Rubric and Scores</h2>
          <div id="rubricsList" className="mb-4">
            <h3 className="text-xl mb-2">Rubric:</h3>
            {rubrics.map((rubric) => (
              <p key={rubric.description} className="mb-1">
                {rubric.description}:{" "}
                <span className="font-bold">{rubric.points} points</span>
              </p>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="totalScoreDisplay" className="mr-2">
              Total Score Set by Instructor:
            </label>
            <span id="totalScoreDisplay" className="font-bold">
              {totalScore}
            </span>
          </div>
        </div>

        <div className="result-container w-1/2 pl-8 border-l-2 border-white">
          <h2 className="text-2xl mb-4">Grading Result:</h2>
          {result.score && (
            <p className="text-xl">
              Score: <span className="font-bold">{result.score}</span>
            </p>
          )}
          {result.feedback && (
            <p className="mt-6">
              <span className="font-bold ">Feedback:</span>{" "}
              <span className="font-italic">{result.feedback}</span>
            </p>
          )}
        </div>
      </div>

      <form
        id="grading-form"
        className="w-full mb-8 pl-96"
        onSubmit={handleGradeSubmission}
      >
        <div className="form-group mb-4">
          <label htmlFor="file" className="block mb-2">
            Upload Document(s)
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            multiple
            required
            className="bg-white text-black p-2 rounded"
          />
        </div>

        {loading ? (
          <div className="inline-block align-middle">
            <span
              className="animate-spin absolute h-12 w-12 border-t-2 border-transparent border-solid rounded-full"
              style={{
                borderTopColor: "green",
                borderWidth: "3px",
              }}
            ></span>
          </div>
        ) : (
          <button
            type="submit"
            id="gradeBtn"
            className="px-4 py-2 rounded bg-gradient-to-br from-green-600 from-40% to-green-400 transition-colors"
            disabled={loading}
          >
            Grade Document
          </button>
        )}
      </form>

      <div className="gpt-response w-full max-w-3xl"></div>
    </div>
  );
}
