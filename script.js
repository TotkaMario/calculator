class calculator {   
    calcScreen = document.getElementById("calcScreen");
    operateScreen = document.getElementById("operateScreen");
    startOperation = true;
    currentOperation = null;

    clearAll() {
        this.calcScreen.innerHTML = "";
        this.operateScreen.innerHTML = "";
        this.startOperation = true;
        this.currentOperation = null;
        this.toAC();
    }

    backspace() {
        if (this.calcScreen.innerHTML.length > 0) {
            this.calcScreen.innerHTML = this.calcScreen.innerHTML.slice(0, -1);
            if (this.calcScreen.innerHTML === "") this.toAC();
        }
    }

    toAC() {
        let btn = document.getElementById("symbolAC");
        btn.value = "AC";
        btn.setAttribute("onclick", "calc.clearAll();");
    }

    toBackspace() {
        let btn = document.getElementById("symbolAC");
        btn.value = "⌫";
        btn.setAttribute("onclick", "calc.backspace();");
    }

    operationStringToArray(string) {
        return string.split(/(?<=[+\-*/%])|(?=[+\-*/%])/);
    }

    replacementZero(string) {
        let operationArray = this.operationStringToArray(string);
        let prevChar = string.charAt(string.length - 2);

        if (/[\+\-*]/.test(prevChar)) return true;
        else if (operationArray[0] === "0") return true;
        else return false;
    }

    lastCharNumber(string) {
        let lastChar = string.charAt(string.length - 1);
        return /\d$/.test(lastChar);
    }

    lastElement(string) {
        let operationArray = this.operationStringToArray(string);
        return operationArray[operationArray.length-1];
    }

    insertDot() {
        if (!(this.lastElement(this.calcScreen.innerHTML).includes("."))) {
            if(this.lastElement(this.calcScreen.innerHTML) == "") {
                this.calcScreen.innerHTML += "0.";
            } else if(!(this.lastCharNumber(this.calcScreen.innerHTML))) {
                this.calcScreen.innerHTML += "0.";
            } else {
                this.calcScreen.innerHTML += ".";
            } 
            this.toBackspace();
        }
    }

    changeSign() {
        let operation =  this.operationStringToArray(this.calcScreen.innerHTML);

        if (operation[(operation.length-2)] == "+") {
            operation.splice((operation.length-2),1,"-" );
            this.calcScreen.innerHTML = operation.join("");
        } else if (operation[(operation.length-2)] == "-") {
            operation.splice((operation.length-2),1, "+");
            this.calcScreen.innerHTML = operation.join("");
        } else if (operation.length == 1) {
            this.calcScreen.innerHTML = "-" + this.calcScreen.innerHTML;
        }
    }

    insertNumber(number) {
        if (number === "0") {
            if(this.currentOperation !== "/") {
                let operationArray = this.operationStringToArray(this.calcScreen.innerHTML);
                if ( operationArray[0] !== "0") {
                    this.calcScreen.innerHTML += "0";
                    this.startOperation = false;
                } 
            } else {
                if(this.lastCharNumber(this.calcScreen.innerHTML)) {
                    this.calcScreen.innerHTML += "0";
                }
            }
            this.toBackspace();
        } else {
            if (this.startOperation) {
                this.calcScreen.innerHTML = number;
                this.startOperation = false;
            } else {
                if ((this.calcScreen.innerHTML).slice(-1) === "0" ){
                    if(this.replacementZero(this.calcScreen.innerHTML)){
                        this.calcScreen.innerHTML = this.calcScreen.innerHTML.slice(0, -1 ) + number;
                    } else {
                        this.calcScreen.innerHTML += number;
                    }
                } else {
                    this.calcScreen.innerHTML += number;
                }  
            }
            this.toBackspace();
        }
    }

    insertOperation(symbol) {
        if (this.calcScreen !== null) {
            if (this.lastCharNumber(this.calcScreen.innerHTML)){
                this.calcScreen.innerHTML += symbol;
                this.currentOperation = symbol;
                this.startOperation = false; 
            } else if (this.lastElement(this.calcScreen.innerHTML) === "%") {
                this.calcScreen.innerHTML += symbol;
                this.currentOperation = symbol;
                this.startOperation = false; 
            } else {
                this.calcScreen.innerHTML = this.calcScreen.innerHTML.slice(0, -1 ) + symbol;
                this.currentOperation = symbol;
                this.startOperation = false; 
            }
            this.toBackspace();
        }
    }
    
    equal (){
        let operation = this.operationStringToArray(this.calcScreen.innerHTML);

        if (this.lastCharNumber(this.calcScreen.innerHTML)) {
            // handle percent
            let i = 0;
            while (i < operation.length){
                if (operation[i] === "%"){
                    let result = Number(operation[i-1]) * 0.01;
                    operation.splice(i-1,2,result.toString());
                    i=0;
                } else{
                    i++;
                }
            }
            // handle multiply/divide
            i = 0;
            while (i < operation.length) {
                if (operation[i] === "*") {
                    const result = Number(operation[i - 1]) * Number(operation[i + 1]);
                    operation.splice(i - 1, 3, result.toString());
                    i = 0;
                } else if (operation[i] === "/") {
                    const result = Number(operation[i - 1]) / Number(operation[i + 1]);
                    operation.splice(i - 1, 3, result.toString());
                    i = 0;
                } else {
                    i++;
                }
            }
            // handle add/subtract
            i = 0;
            while (i < operation.length) {
                if (operation[i] === "+") {
                    const result = Number(operation[i - 1]) + Number(operation[i + 1]);
                    operation.splice(i - 1, 3, result.toString());
                    i = 0;
                } else if (operation[i] === "-") {
                    const result = Number(operation[i - 1]) - Number(operation[i + 1]);
                    operation.splice(i - 1, 3, result.toString());
                    i = 0;
                } else {
                    i++;
                }
            }

            this.operateScreen.innerHTML = this.calcScreen.innerHTML;
            this.calcScreen.innerHTML = operation;
            this.startOperation = true;
            this.currentOperation = null;
            this.toAC();
        }   
    }
}
const calc = new calculator();
