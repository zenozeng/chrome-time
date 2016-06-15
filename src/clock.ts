/**
 * Time clocking library
 * 
 * Some design was steal from time clocking of Emacs's Org mode
 */

interface ClockLog {
    key: string;
    in: number; // getTime() for clockIn time
    out: number; // getTime() for clockOut time;
}

interface ClockData {
    currentLog: ClockLog;
    logs: Array<ClockLog>;
}

class Clock {

    _localStorageKey: string;
    _data: ClockData;

    /**
     * Constructor tiem clocking object and load data based on given storageKey 
     */
    constructor(storageKey: string) {
        this._localStorageKey = storageKey;
        this._data = JSON.parse(localStorage.getItem(this._localStorageKey) || '{}');
    }

    _save() {
        localStorage.setItem(this._localStorageKey, JSON.stringify(this._data));
    }

    /**
     * @note: calling clockIn many times will extends current clock's clockOut time
     */
    clockIn(key: string) {
        const now = Date.now();
        if (!this._data.currentLog) {
            // currentLog not exists, create one 
            this._data.currentLog = {key, in: now, out: now};
            this._data.logs.push(this._data.currentLog);
            return;
        } else if (key === this._data.currentLog.key) {
            // still same key, extends current object
            this._data.currentLog.out = now;            
        } else {

        }
        this._save();
    }

    clockOut() {
        if (this._data.currentLog) {
            this._data.currentLog.out = Date.now();
            this._data.currentLog = null;
            this._save();       
        }
    }

    export() {
        return JSON.stringify(this._data);
    }

    import() {
        // TODO: merge data
    }

}