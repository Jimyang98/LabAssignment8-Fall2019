

export class LocalStorageService<L> {

    constructor(private key: string) {

    }
    saveItemToLocalStorage(items: Array<L> | L) {
        const saveItems = localStorage.setItem(this.key, JSON.stringify(items));
        return saveItems;
    }

    getItemFromLocalStorage(key?: string) {
        let saveItems;
        if (key != null) {
            saveItems = JSON.parse(localStorage.getItem(this.key));

        } else {
            saveItems = JSON.parse(localStorage.getItem(this.key));
        }
        return saveItems;
    }

    clearItemFromLocalStorage(key?: string) {
        if (key != null) {
            const items = null;
            localStorage.setItem(key, JSON.stringify(items));
        } else {
            localStorage.clear();
        }
    }
}
