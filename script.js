const newQuestions = document.querySelector("button")
const main = document.querySelector("main")
const difficulty = document.getElementById("difficulty")
const levels = document.querySelectorAll(".diff");
const resetButton = document.getElementById("reset")
const [easy, medium, hard] = levels

resetButton.addEventListener("click", () => {
    reset();
})

newQuestions.addEventListener("click", (e) => {
    e.preventDefault();

    difficulty.classList.toggle("active")
    newQuestions.disabled = true;

    selectLevel()
    setTimeout(function() {
        // Re-enable the button
        newQuestions.disabled = false;
    }, 5000); 
    
})

const createCard = (data) => {
    for(let i = 0; i < data.length; i++) {
    const article = document.createElement("article")
    const category = document.createElement("h2")
    const question = document.createElement("p")
    const bottomSection = document.createElement("div");
    const button = document.createElement("button")
    const answer = document.createElement("p")
    // console.log(data[i])
    
    category.innerHTML = data[i].category;
    question.innerHTML = data[i].question;
    
    bottomSection.classList.add("bottom-section")
    article.classList.add("card")
    

    
    checkDifficulty(data[i], article);
    showButton(button, answer);

    article.append(category, question, generateBottomSection(data[i], article, i, bottomSection));
    main.append(article);
    }
}

const showButton = (button, answer) => {
    button.addEventListener("click", () => {
        answer.classList.remove("hidden")
        button.remove()
    })
}

const checkDifficulty = (data, article) => {
    const difficulty = data.difficulty;

    if(difficulty === "hard"){
        article.style.borderColor = "#F01414"
    }else if (difficulty === "medium"){
        article.style.borderColor = "#FFE229"
    }
}


const selectLevel = () => {
    levels.forEach(level => {
        level.addEventListener("click", () => {
            getQuestions(level.id);
            difficulty.remove()
        })
    })
}

const getQuestions = (level) => {
    const leveler = level;
    fetch(`https://opentdb.com/api.php?amount=10&difficulty=${leveler}`)
    .then((response) => response.json())
    .then((data) => createCard(data.results))
    .catch((error) => console.error('Error fetching questions:', error))
}

const reset = () => {
    main.children.forEach(child => {
        child.remove()
    })
}

const generateBottomSection = (data, article, idx, bottom) => {

    if(data.correct_answer === "False" || data.correct_answer === "True") {
        const trueButton = document.createElement("input")
        const trueLabel = document.createElement("label")
        const falseButton = document.createElement("input")
        const falseLabel = document.createElement("label")

        trueButton.setAttribute("id", data.correct_answer)
        trueButton.setAttribute("type", "radio")
        trueButton.setAttribute("name", `answer-${idx}`)
        falseButton.setAttribute("id", data.correct_answer)
        falseButton.setAttribute("type", "radio")
        falseButton.setAttribute("name", `answer-${idx}`)

        trueLabel.innerHTML = "True"
        falseLabel.innerHTML = "False"

        // checkingAsnwers(data)

        trueLabel.append(trueButton)
        falseLabel.append(falseButton)
        bottom.append(trueLabel, falseLabel)
    }else {
        const correct = document.createElement("label");
        const correctInput = document.createElement("input");
        const incorrectArr = data.incorrect_answers

        correctInput.setAttribute("name", `answer`)
        correctInput.setAttribute("type", "radio")
        correctInput.setAttribute("id", data.correct_answer)

        correct.innerHTML = data.correct_answer

        correct.append(correctInput)
        bottom.append(correct)

        for(let i = 0; i < incorrectArr.length; i++){
            const ans = document.createElement("label")
            const ansInput = document.createElement("input")

            ansInput.setAttribute("name", `answer`)
            ansInput.setAttribute("type", "radio")
            ansInput.setAttribute("id", incorrectArr[i])
            ans.innerHTML = incorrectArr[i]

            ans.append(ansInput)
            bottom.append(ans)
        }
        
    }
    checkingAsnwers(data)
    
    return bottom
}

const checkingAsnwers = (data) => {
    const buttons = document.getElementsByTagName("input")

    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", () => {
            console.log(buttons[i])
            console.log(data.correct_answer)
            if(buttons[i].id === data.correct_answer){
                buttons[i].parentElement.style.color = "green"
            }else {
                buttons[i].parentElement.style.color = "red"
            }
        })
    }
}