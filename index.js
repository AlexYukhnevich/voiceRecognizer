
class Controller { 
    start() {
        const btnAudio = document.querySelector('.btn-audio');
        const formWrapper = document.querySelector('.form-wrapper');
        let view = new View(null);
        let model = new Model();
        document.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-audio') && e.target.innerText === 'Click here') {
                e.target.innerText = 'Speak';
                model.recognize();
            } else if(e.target.classList.contains('btn-audio') && e.target.innerText === 'Speak') {
                e.target.innerText = 'Click here';
            } else if(e.target.classList.contains('true')) {
                e.target.classList.add('btn-active');
                model.sendHttpRequest();
            } else if(e.target.classList.contains('false')) {
                e.target.classList.add('btn-active');
                model.sendHttpRequest();
                model.recognize();
            } else if (e.target.classList.contains('popup-button') || e.target.classList.contains('popup-button__span') ){
                 document.querySelector('.popup').classList.toggle('popup-active');
            }   
        });
    }    
}

class Model {

    userData() {
        const string = document.querySelector('.user-data').innerText;
        const dataArray = string.split(' ');
        const btnActive = document.querySelector('.btn-active');

        const dataObj = {
            name: dataArray[0],
            surname: dataArray[1] ,
            status: btnActive.getAttribute('data-status')
        };
        btnActive.classList.remove('btn-active');
        return JSON.stringify(dataObj);
    }

    recognize() {
        const activeOption = document.querySelector('.option-active');
        const select = document.querySelector('#lang');
        let recognizer = new webkitSpeechRecognition();
        recognizer.interimResults = true;
        recognizer.lang = select.options[select.selectedIndex].value;
        recognizer.onresult = (event) => {
            let result = event.results[event.resultIndex];
            if (result.isFinal) {
                let view = new View(result[0].transcript);
                view.render();
                this.talk();
            } 
        };
        recognizer.start();
    }

    sendHttpRequest() {
        const userData = this.userData();
        const url = "DBSaveServlet";
        const request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function(e) {
            if(this.status === 200 && this.readyState == 4) {
                console.log('it is working');
            } else {
                console.error('It isn`t working');
            }
        };

        request.send(userData);
    }

    talk() {
        const select = document.querySelector('#lang');
        const utterance = new SpeechSynthesisUtterance(document.querySelector('.user-data').innerText);
        utterance.lang = select.options[select.selectedIndex].value;
        window.speechSynthesis.speak(utterance);
    }
}

class View {
    constructor(data) {
        this.data = data;
    }

    render() {
        const fullName = document.querySelector('.user-data');
        const btnAudio = document.querySelector('.btn-audio');
        fullName.innerText = this.data;
        btnAudio.innerText = 'Click here';
        btnAudio.classList.remove('btn-active');
    }
}

const controller = new Controller();
controller.start();





