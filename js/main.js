class TriviaGame {
    constructor() {
      this.team1Score = 0;
      this.team2Score = 0;
      this.currentQuestion = {};
      this.gameOver = false;
    }
  
    init() {
      this.addEventListeners();
      // this.fetchQuestion();
    }
  
    addEventListeners() {
      // document.addEventListener('DOMContentLoaded', () => this.fetchQuestion());
      document.getElementById('newQuestion').addEventListener('click', () => {
        this.fetchQuestion()
        this.displayQuestion()
      });
      document.getElementById('revealAnswer').addEventListener('click', () => this.revealAnswer());
      document.querySelectorAll('.category, .difficulty').forEach(checkbox => {
        checkbox.addEventListener('change', () => this.fetchQuestion());
      });
      document.getElementById('increaseTeam1').addEventListener('click', () => this.increaseScore(1));
      document.getElementById('increaseTeam2').addEventListener('click', () => this.increaseScore(2));
      document.getElementById('reset').addEventListener('click', () => this.resetGame());
    }
  
    fetchQuestion() {
      const category = Array.from(document.querySelectorAll('.category:checked')).map(checkbox => checkbox.value);
      const difficulty = Array.from(document.querySelectorAll('.difficulty:checked')).map(checkbox => checkbox.value);
  
      const url = `https://opentdb.com/api.php?amount=1&category=${category.join(',')}&difficulty=${difficulty.join(',')}`;
      // const url = 'https://opentdb.com/api.php?amount=1';
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // if(questionContainer.innerHTML !== ""){
          //   this.clearQuestion(); // Clear the previous question
          // }
          if (data.results.length > 0) {
            this.currentQuestion = data.results[0];
            // console.log(data.results[0].question);
            this.displayQuestion(); // Display the new question
           
          } else {
            alert('No questions found with the selected filters.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to fetch question from the API.');
        });
    }

    // clearQuestion() {
    //   const questionContainer = document.getElementById('questionDisplayedHere');
    //   questionContainer.innerHTML = ''; // Clear the question container
    // }
  
    displayQuestion() {
      const questionContainer = document.getElementById('questionDisplayedHere');
      
      questionContainer.innerHTML = `
        <h2>${this.currentQuestion.question}</h2>
        <p>Category: ${this.currentQuestion.category}</p>
        <p>Difficulty: ${this.currentQuestion.difficulty}</p>
      `;
    
      if (this.currentQuestion.type === "boolean") {
        const booleanElement = document.createElement('h2');
        booleanElement.innerHTML = `True or false?`;
        questionContainer.appendChild(booleanElement);
      } else if (this.currentQuestion.type === "multiple") {
        const answerOptions = this.shuffleAnswers([...this.currentQuestion.incorrect_answers, this.currentQuestion.correct_answer]);
        const answersHtml = answerOptions.map(answer => `<li>${answer}</li>`).join('');
        const answersElement = document.createElement('ul');
        answersElement.innerHTML = answersHtml;
        questionContainer.appendChild(answersElement);
      }
    }
    
    revealAnswer() {
      const questionContainer = document.getElementById('questionDisplayedHere');
      const answerElement = document.createElement('h2');
      answerElement.innerHTML = `Answer: ${this.currentQuestion.correct_answer}`;
    
      if (this.currentQuestion.type === "multiple") {
        const answerOptions = Array.from(questionContainer.getElementsByTagName('li'));
        for (const option of answerOptions) {
          if (option.textContent === this.currentQuestion.correct_answer) {
            option.style.color = "green";
            break;
          }
        }
      }
    
      if (questionContainer.querySelector('h2.answer') === null) {
        answerElement.classList.add('answer');
        questionContainer.appendChild(answerElement);
      }
      
      this.updateScores();
      this.checkGameOver();
    }
    
    shuffleAnswers(answers) {
      const shuffledAnswers = [...answers];
      for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
      }
      return shuffledAnswers;
    }
    
  
    increaseScore(team) {
      if (!this.gameOver) {
        if (team === 1) {
          this.team1Score++;
          document.getElementById('team1Score').textContent = this.team1Score;
        } else if (team === 2) {
          this.team2Score++;
          document.getElementById('team2Score').textContent = this.team2Score;
        }
      }
      this.checkGameOver()
    }
  
    checkGameOver() {
      if (this.team1Score === 7 || this.team2Score === 7) {
        this.gameOver = true;
        const winner = this.team1Score === 7 ? 'Team 1' : 'Team 2';
        alert(`${winner} wins the game!`);
        this.resetGame()
      }
    }
  
  
    resetGame() {
      this.team1Score = 0;
      this.team2Score = 0;
      this.gameOver = false;
  
      document.getElementById('team1Score').textContent = this.team1Score;
      document.getElementById('team2Score').textContent = this.team2Score;
  
      const questionContainer = document.getElementById('questionDisplayedHere');
      questionContainer.innerHTML = '';
  
      document.querySelectorAll('.category:checked').forEach(checkbox => checkbox.checked = false);
      document.querySelectorAll('.difficulty:checked').forEach(checkbox => checkbox.checked = false);
    }
  }
  
  const triviaGame = new TriviaGame();
  triviaGame.init();
  
  