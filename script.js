const subjectCodes = ['m', 'r', 'w', 'd']; // Math, Robotics, WAP, DSA
const subjectNames = {
    'm': 'Math',
    'r': 'Robotics',
    'w': 'WAP',
    'd': 'DSA'
};
const assessmentCodes = ['c1', 'c2', 'c3', 'ia1', 'ia2', 'p1', 'p2', 'es', 'cp']; // Contest1-3, IA1-2, Project1-2, End Sem, Class Participation

function calculateResult(subjectCode, assessmentCode) {
    const weightageId = `${subjectCode}-${assessmentCode}-w`;
    const marksObtainedId = `${subjectCode}-${assessmentCode}-mo`;
    const maxMarksId = `${subjectCode}-${assessmentCode}-mm`;
    const resultId = `${subjectCode}-${assessmentCode}-r`;

    const weightageElement = document.getElementById(weightageId);
    const marksObtainedElement = document.getElementById(marksObtainedId);
    const maxMarksElement = document.getElementById(maxMarksId);
    const resultElement = document.getElementById(resultId);

    if (!weightageElement || !marksObtainedElement || !maxMarksElement || !resultElement) {
        // console.error(`One or more elements not found for ${subjectCode}-${assessmentCode}`);
        return;
    }

    const weightage = parseFloat(weightageElement.querySelector('select').value);
    const marksObtained = parseFloat(marksObtainedElement.querySelector('input').value);
    const maxMarks = parseFloat(maxMarksElement.querySelector('input').value);

    if (isNaN(weightage) || isNaN(marksObtained) || isNaN(maxMarks) || maxMarks === 0) {
        resultElement.innerText = '';
        updateSubtotals(); // Update subtotals even if a single result is invalid
        return;
    }

    const result = (marksObtained / maxMarks) * (weightage / 100) * 100;
    resultElement.innerText = result.toFixed(2);
    updateSubtotals();
}

function updateOverallRemarks() {
    subjectCodes.forEach(subjectCode => {
        const subtotalCells = document.querySelectorAll('.subt-divider');
        const subjectIndex = subjectCodes.indexOf(subjectCode);
        let remark = '';
        if (subtotalCells.length > subjectIndex && subtotalCells[subjectIndex].innerText !== '') {
            const subjectSubtotal = parseFloat(subtotalCells[subjectIndex].innerText);
            if (subjectSubtotal < 40) {
                remark = 'Needs significant improvement';
            } else if (subjectSubtotal >= 40 && subjectSubtotal < 60) {
                remark = 'Average performance';
            } else if (subjectSubtotal >= 60 && subjectSubtotal < 80) {
                remark = 'Good performance';
            } else {
                remark = 'Excellent performance';
            }
        }
        const remarkElement = document.querySelector(`.overall-remarks li:nth-child(${subjectIndex + 2})`); // +2 because of the bold tag
        if (remarkElement) {
            remarkElement.innerText = `${subjectNames[subjectCode]} : ${remark}`;
        }
    });
}

function updatePredictedCGPA() {
    let overallTotal = 0;
    document.querySelectorAll('.subt-divider').forEach(cell => {
        if (cell.innerText !== '') {
            overallTotal += parseFloat(cell.innerText);
        }
    });

    let cgpa = 0;
    if (overallTotal >= 90) {
        cgpa = 10;
    } else if (overallTotal >= 80) {
        cgpa = 9;
    } else if (overallTotal >= 70) {
        cgpa = 8;
    } else if (overallTotal >= 60) {
        cgpa = 7;
    } else if (overallTotal >= 50) {
        cgpa = 6;
    } else if (overallTotal >= 40) {
        cgpa = 5;
    } else {
        cgpa = 0; // Failing
    }

    const cgpaElement = document.querySelector('.pre-cpga');
    if (cgpaElement) {
        cgpaElement.innerText = cgpa.toFixed(1);
    }
}

function updateSubtotals() {
    subjectCodes.forEach((subjectCode, index) => {
        let subjectSubtotal = 0;
        assessmentCodes.forEach(assessmentCode => {
            const resultElement = document.getElementById(`${subjectCode}-${assessmentCode}-r`);
            if (resultElement && resultElement.innerText !== '') {
                subjectSubtotal += parseFloat(resultElement.innerText);
            }
        });
        // Find the correct subtotal cell for the subject.
        // Assuming the subtotal cells are in the last row before the TOTAL row,
        // and they are in the same order as subjectCodes
        const subtotalCells = document.querySelectorAll('.subt-divider');
        if (subtotalCells.length > index) {
            subtotalCells[index].innerText = subjectSubtotal.toFixed(2);
        }
    });

    // Calculate overall total
    let overallTotal = 0;
    document.querySelectorAll('.subt-divider').forEach(cell => {
        if (cell.innerText !== '') {
            overallTotal += parseFloat(cell.innerText);
        }
    });
    const totalElement = document.querySelector('.total');
    if (totalElement) {
        totalElement.innerText = `TOTAL : ${overallTotal.toFixed(2)}`;
    }

    updateOverallRemarks();
    updatePredictedCGPA();
}

document.addEventListener('DOMContentLoaded', () => {
    subjectCodes.forEach(subjectCode => {
        assessmentCodes.forEach(assessmentCode => {
            const weightageElement = document.getElementById(`${subjectCode}-${assessmentCode}-w`);
            const marksObtainedElement = document.getElementById(`${subjectCode}-${assessmentCode}-mo`);
            const maxMarksElement = document.getElementById(`${subjectCode}-${assessmentCode}-mm`);

            if (weightageElement) {
                weightageElement.querySelector('select').addEventListener('change', () => {
                    calculateResult(subjectCode, assessmentCode);
                });
            }
            if (marksObtainedElement) {
                marksObtainedElement.querySelector('input').addEventListener('input', () => {
                    calculateResult(subjectCode, assessmentCode);
                });
            }
            if (maxMarksElement) {
                maxMarksElement.querySelector('input').addEventListener('input', () => {
                    calculateResult(subjectCode, assessmentCode);
                });
            }
        });
    });
    updateSubtotals(); // Initial calculation on page load
});