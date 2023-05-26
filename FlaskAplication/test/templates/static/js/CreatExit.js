


class ExitButton{
    constructor(Parentelement){
        this.Parentelement = Parentelement;
    }

    creatExit(ContainerToRm=null){
        ContainerToRm = ContainerToRm || this.Parentelement;
        let icon = document.createElement('i');
        icon.className = 'fa-sharp fa-solid fa-circle-xmark float-right';
        icon.id = 'ExitIconIdFaSharp'; 
        icon.style.position = 'sticky';
        icon.style.top = '0px'; 
        icon.addEventListener('click', () => {
            ContainerToRm.remove();
        });
        this.Parentelement.appendChild(icon);
    }
}