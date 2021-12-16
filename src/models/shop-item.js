import { IdGenerator } from '../utils/id-generator';

export class ShopItem {

    id = null;
    title = null;
    price = null;
    link = null;
    amount = 0;

    constructor(title, price, link, amount = 0) {
        this.id = IdGenerator.generateId();
        this.title = title;
        this.price = price;
        this.link = link;
        this.amount = amount;
    }

    clone() {
        return ShopItem.fromJson(this.toJson());
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            link: this.link,
            amount: this.amount
        }
    }

    static fromJson(data) {
        const instance = new ShopItem(
            data['title'],
            data['price'],
            data['link'],
            data['amount']
        );
        instance.id = data['id'];
        return instance;
    }
}