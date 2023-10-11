/**
 * @author fullmoonemptysun 10.10.23
 */


function setRubricPoints() {
    const rubrics = [];
    for (let i = 1; i <= 4; i++) {
        const rubricDesc = document.getElementById(`rubric${i}Desc`).value;
        const rubricPoints = parseInt(document.getElementById(`rubric${i}Points`).value);
        if (rubricDesc && !isNaN(rubricPoints)) {
            rubrics.push({ description: rubricDesc, points: rubricPoints });
        }
    }
    const totalScore = parseInt(document.getElementById('totalScore').value);
    localStorage.setItem('rubrics', JSON.stringify(rubrics));
    localStorage.setItem('totalScore', totalScore);
    alert("Rubric Points Set Successfully!");
}

