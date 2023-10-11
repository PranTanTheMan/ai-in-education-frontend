import { useState } from "react";

function SetRubrics() {
  const [rubrics, setRubrics] = useState([
    { description: "", points: 0 },
    { description: "", points: 0 },
    { description: "", points: 0 },
    { description: "", points: 0 },
  ]);
  const [totalScore, setTotalScore] = useState(0);

  const handleRubricChange = (index, field, value) => {
    const newRubrics = [...rubrics];
    newRubrics[index][field] = value;
    setRubrics(newRubrics);
  };

  const handleSubmit = () => {
    const validRubrics = rubrics.filter((r) => r.description && r.points > 0);
    localStorage.setItem("rubrics", JSON.stringify(validRubrics));
    localStorage.setItem("totalScore", totalScore);
    alert("Rubrics and total score set successfully!");
  };

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">
        iGrader - Instructor Interface
      </h1>
      <div className="bg-white p-6 rounded shadow-lg w-[35rem] my-20">
        {rubrics.map((rubric, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Rubric {index + 1} Description:
            </label>
            <textarea
              value={rubric.description}
              placeholder="Enter Rubric Description"
              onChange={(e) =>
                handleRubricChange(index, "description", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <label className="block text-sm font-medium mt-4 mb-2">
              Points:
            </label>
            <input
              type="number"
              min="0"
              value={rubric.points}
              onChange={(e) =>
                handleRubricChange(index, "points", parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Total Score:</label>
          <input
            type="number"
            min="0"
            value={totalScore}
            onChange={(e) => setTotalScore(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-br from-green-600 from-40% to-green-400 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800"
        >
          Set Rubrics
        </button>
      </div>
    </div>
  );
}

export default SetRubrics;
