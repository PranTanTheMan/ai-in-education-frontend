/**
 * @author fullmoonemptysun 10.10.23
 **/

document.addEventListener('DOMContentLoaded', () => {
    const rubricsList = document.getElementById('rubricsList');
    const totalScoreDisplay = document.getElementById('totalScoreDisplay');
    const gradingForm = document.getElementById('grading-form');
    const loadingIcon = document.querySelector('.loading-icon');
    const resultContainer = document.querySelector('.result-container');

    const rubrics = JSON.parse(localStorage.getItem('rubrics')) || [];
    const totalScore = parseInt(localStorage.getItem('totalScore')) || 0;

    rubricsList.innerHTML = "<h3>Rubrics:</h3>";
    rubrics.forEach(rubric => {
        rubricsList.innerHTML += `<p>${rubric.description}: ${rubric.points} points</p>`;
    });

    totalScoreDisplay.textContent = totalScore;

    gradingForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];

        if (file) {
            loadingIcon.style.display = 'block';

            try {
                const extractedText = await extractTextFromImage(file);
                const gptResponse = await sendToGPT(extractedText, rubrics, totalScore);

                loadingIcon.style.display = 'none';

                resultContainer.innerHTML = `<h2>Grading Result:</h2><p>Score: ${gptResponse.score}</p><p>Feedback: ${gptResponse.feedback}</p>`;
            } catch (error) {
                loadingIcon.style.display = 'none';

                alert("Error occurred while processing the document. Please try again.");
                console.error(error);
            }
        } else {
            alert("Please upload a file before grading.");
        }
    });

    async function extractTextFromImage(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function () {
                const image = new Image();
                image.src = reader.result;
                image.onload = function () {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);
                    Tesseract.recognize(
                        canvas,
                        'eng',
                        { logger: info => console.log(info) }
                    ).then(({ data: { text } }) => {
                        resolve(text);
                    }).catch(error => {
                        reject(error);
                    });
                };
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    function sendToGPT(text, rubrics, totalScore) {
        return new Promise((resolve, reject) => {
            const apiUrl ='' //enter the api endpoint; 
    
            const requestData = {
                text: text,
                rubrics: rubrics,
                totalScore: totalScore
            };
    
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                const score = data.score;
                const feedback = data.feedback;
                resolve({ score, feedback });
            })
            .catch(error => {
                reject(error);
            });
        });
    }
});
