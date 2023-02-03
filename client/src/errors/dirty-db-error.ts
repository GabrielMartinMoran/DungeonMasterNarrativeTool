export class DirtyDBError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
