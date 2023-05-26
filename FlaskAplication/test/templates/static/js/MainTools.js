class CreatStatusVX{
    constructor(parentElement,elementToHide=null){
        this.parentElement = parentElement;
        this.elementToHide = elementToHide;
    }

    _creatIcon(type){
        const types = {
            v: {
                class: 'fas fa-check-circle',
                color: 'green'
            },
            x: {
                class: 'fas fa-times-circle',
                color: 'red'
            }
        }
        if (this.elementToHide) this.elementToHide.style.display = 'none';
        const icon = document.createElement('i');
        icon.className = types[type].class;
        icon.id = "checkIconVx";
        icon.style.fontSize = '50px';
        icon.style.color = types[type].color;
        icon.addEventListener("animationend", () => {
            icon.style.display = "none";
            if (this.elementToHide) this.elementToHide.style.display = 'block';
        });
        this.parentElement.appendChild(icon)
    }
    creatSuccess(){
        this._creatIcon('v');
    }
    creatXmark(){
        this._creatIcon('x');
    }
}


class CreatLoader{
    constructor(parentElement){
      this.parentElement = parentElement;
      this._creatLoader();
    }
    _creatLoader(){
      this.loader = document.createElement("div");
      this.loader.className = "LoadingLoader";
      this.loader.id = "LoadingLoader";
      this.loader.style.display = "none";
      this.parentElement.appendChild(this.loader);
    }
    DisplayLoading() {
      this.loader.style.display = 'block';
    }
  
    EndLoading() {
      this.loader.style.display = 'none';
    }
  }