/**
 * @author fullmoonemptysun 10.10.23
 **/

document.addEventListener('DOMContentLoaded', () => {
    const rubrics = JSON.parse(localStorage.getItem('rubrics')) || [];
    const totalScore = parseInt(localStorage.getItem('totalScore')) || 0;

    const rubricsList = document.getElementById('rubricsList');
    rubricsList.innerHTML = "<h3>Rubrics:</h3>";
    rubrics.forEach(rubric => {
        rubricsList.innerHTML += `<p>${rubric.description}: ${rubric.points} points</p>`;
    });

    const totalScoreDisplay = document.getElementById('totalScoreDisplay');
    totalScoreDisplay.textContent = totalScore;

    document.getElementById('grading-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];

        if (file) {
            try {
                const extractedText = await extractTextFromImage(file);
                const gptResponse = await sendToGPT(extractedText, rubrics, totalScore);

                //displaying the response
                const resultContainer = document.querySelector('.result-container');
                resultContainer.innerHTML = `<h2>Grading Result:</h2><p>Score: ${gptResponse.score}</p><p>Feedback: ${gptResponse.feedback}</p>`;
            } catch (error) {
                alert("Error occurred while processing the document. Please try again.");
                console.error(error);
            }
        } else {
            alert("Please upload a file before grading.");
        }
    });
});

async function extractTextFromImage(imageFile) {
    return new Promise((resolve, reject) => {
        // assuming you guys have tesseract.js set up for client-side OCR
        const Tesseract = window.Tesseract;
        Tesseract.recognize(
            imageFile,
            'eng', 
            { logger: info => console.log(info) } 
        ).then(({ data: { text } }) => {
            resolve(text);
        }).catch(error => {
            reject(error);
        });
    });
}

async function sendToGPT(text, rubrics, totalScore) {
    return new Promise((resolve, reject) => {
        const apiUrl = //put api endpoint here; 

        // preparing the data here
        const requestData = {
            text: text,
            rubrics: rubrics,
            totalScore: totalScore
        };

        // sending the prepared data
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // handle the response from the GPT API
            const score = data.score;
            const feedback = data.feedback;
            resolve({ score, feedback });
        })
        .catch(error => {
            reject(error);
        });
    });
}

