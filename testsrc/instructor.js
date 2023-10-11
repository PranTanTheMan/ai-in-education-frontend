/**
 * @author fullmoonemptysun 10.10.23
 */


function setRubricPoints() {
    const rubrics = [];

    for (let i = 1; i <= 4; i++) {
        const rubricDesc = document.getElementById(`rubric${i}Desc`).value;
        const rubricPoints = parseInt(document.getElementById(`rubric${i}`).value);
        if (rubricDesc && !isNaN(rubricPoints)) {
            rubrics.push({ description: rubricDesc, points: rubricPoints });
        }
    }

    const totalScore = parseInt(document.getElementById('totalScore').value);
    localStorage.setItem('rubrics', JSON.stringify(rubrics));
    localStorage.setItem('totalScore', totalScore);
    alert("Rubric Points Set Successfully!");

    
    updateStudentInterface(rubrics, totalScore);
}

function updateStudentInterface(rubrics, totalScore) {
    const rubricsList = document.getElementById('rubricsList');
    rubricsList.innerHTML = "<h3>Rubrics:</h3>";
    rubrics.forEach(rubric => {
        rubricsList.innerHTML += `<p>${rubric.description}: ${rubric.points} points</p>`;
    });

    const totalScoreDisplay = document.getElementById('totalScoreDisplay');
    totalScoreDisplay.textContent = totalScore;
}

