import { v4 as uuidv4 } from 'uuid';

export class IdGenerator {
    static generateId() {
        return uuidv4();
    }
}
