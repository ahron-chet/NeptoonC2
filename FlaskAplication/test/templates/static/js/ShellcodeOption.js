import { Loading } from './Loader.js';

const loader = new Loading();
export function SendInjectShellCodeLocal(getFileMethod, id){
    getFileMethod().then(shellonbase => {
        loader.DisplayLoading()
      return fetch("/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message:{command: "2dbab3bcba2fe64f1d2133bc50796496",shellonbase:shellonbase}, id: id})
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(res => {
        console.log(res)
        loader.EndLoading()
        displayResult(res.message)
      })
    });
  }

  function displayResult(condition) {
    let existingDiv = document.getElementById('result');
    if (existingDiv) existingDiv.remove();
    
    const divElement = document.createElement('div');
    divElement.id = 'result';
    
    if (condition) {
        divElement.innerHTML = '<i class="far fa-check-circle check"></i>';
    } else {
        divElement.innerHTML = '<i class="fa-regular fa-circle-xmark failuer"></i>';
    }
    
    divElement.style.position = 'fixed';
    divElement.style.top = '50%';
    divElement.style.left = '50%';
    divElement.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(divElement);
    
    setTimeout(function() {
        document.body.removeChild(divElement);
    }, 2800);
}