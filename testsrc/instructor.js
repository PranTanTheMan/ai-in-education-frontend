document.addEventListener('DOMContentLoaded', () => {
    const setRubricBtn = document.getElementById('setRubricBtn');

    setRubricBtn.addEventListener('click', () => {
        const rubrics = [];
        for (let i = 1; i <= 4; i++) {
            const description = document.getElementById(`rubric${i}Desc`).value;
            const points = parseInt(document.getElementById(`rubric${i}Points`).value);
            if (description && !isNaN(points)) {
                rubrics.push({ description, points });
            }
        }

        const totalScore = parseInt(document.getElementById('totalScore').value);
        // Send rubrics and total score to student interface
        updateStudentInterface(rubrics, totalScore);
        alert('Rubrics and total score set successfully!');
    });

    function updateStudentInterface(rubrics, totalScore) {
        
        localStorage.setItem('rubrics', JSON.stringify(rubrics));
        localStorage.setItem('totalScore', totalScore);
    }
});
