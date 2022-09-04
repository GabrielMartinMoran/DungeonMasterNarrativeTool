import { IdGenerator } from '../utils/id-generator';

export class ShopItem {
    id: string;
    title: string;
    price: string;
    link: string;
    amount: number;

    constructor(title: string, price: string, link: string, amount: number = 0) {
        this.id = IdGenerator.generateId();
        this.title = title;
        this.price = price;
        this.link = link;
        this.amount = amount;
    }

    clone(): ShopItem {
        return ShopItem.fromJson(this.toJson());
    }

    toJson(): any {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            link: this.link,
            amount: this.amount,
        };
    }

    static fromJson(data: any): ShopItem {
        const instance = new ShopItem(data.title, data.price, data.link, data.amount);
        instance.id = data.id;
        return instance;
    }
}
