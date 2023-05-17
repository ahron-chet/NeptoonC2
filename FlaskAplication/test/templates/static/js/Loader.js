export class Loading 
{
    constructor() {
      this.loader = document.getElementById("LoadingLoader");
    }
  
    DisplayLoading() {
      this.loader.style.display = 'block';
    }
  
    EndLoading() {
      this.loader.style.display = 'none';
    }
}