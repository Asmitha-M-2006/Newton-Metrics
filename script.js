function myFunction(){
    const selectedWeightageForMaths = document.getElementById('weightage').value;
    const marksObtainedForMaths = document.getElementById('marksObatinedc1').value;
    const maxmarksFormaths = document.getElementById('maxMarksc1').value;
    const result = selectedWeightageForMaths * marksObtainedForMaths/maxmarksFormaths;
    const resultForMathsc1 = document.getElementById('resultForMathsc1').innerText = result

}
