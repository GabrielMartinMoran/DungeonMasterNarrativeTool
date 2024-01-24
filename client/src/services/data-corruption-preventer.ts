import { AppContext } from '../app-context';
import { DirtyDBError } from '../errors/dirty-db-error';
import { getOrInstantiateRepository } from '../hooks/use-repository';
import { NarrativeContextRepository } from '../repositories/narrative-context-repository';

export class DataCorruptionPreventer {
    _appContext: AppContext;
    _interval: NodeJS.Timer | null = null;
    _INTERVAL_TIME = 2000;
    _lastDBSaveTime: Date | null = null;
    _LAST_SAVE_DATE_KEY = 'last_save_date';

    constructor(appContext: AppContext) {
        this._appContext = appContext;
        this._lastDBSaveTime = this._getStoredDate();
        this._registerAfterSaveHook();
        this._registerOnDirtyDBCallback();
    }

    _registerAfterSaveHook() {
        getOrInstantiateRepository(NarrativeContextRepository).registerAfterSaveHook(() => {
            this._updateLastSaveInfo();
        });
    }

    _registerOnDirtyDBCallback() {
        getOrInstantiateRepository(NarrativeContextRepository).registerOnDirtyDBCallback(() => {
            this._onDirtyDB();
            throw new DirtyDBError('Dirty db');
        });
    }

    _updateLastSaveInfo() {
        const saveDate = new Date();
        this._lastDBSaveTime = saveDate;
        localStorage.setItem(this._LAST_SAVE_DATE_KEY, saveDate.toString());
    }

    _getStoredDate() {
        const lastSaveDateStr = localStorage.getItem(this._LAST_SAVE_DATE_KEY);
        if (!lastSaveDateStr) return null;
        return new Date(lastSaveDateStr);
    }

    _isWorkingDirty() {
        const storedDate = this._getStoredDate();
        return (
            (storedDate && !this._lastDBSaveTime) ||
            (storedDate && this._lastDBSaveTime && this._lastDBSaveTime < storedDate)
        );
    }

    start() {
        this._interval = setInterval(() => {
            if (this._isWorkingDirty()) {
                getOrInstantiateRepository(NarrativeContextRepository).enableSavingPrevention();
                clearInterval(this._interval!);
                this._onDirtyDB();
            }
        }, this._INTERVAL_TIME);
    }

    _onDirtyDB() {
        const shouldReload = window.confirm(
            "Al parecer se han realizado cambios en otras pestañas, por lo cual, para evitar que estos se pierdan por favor recarga la aplicación para poder volver a utilizarla con normalidad o haz click en 'Ok' para hacerlo automáticamente."
        );
        if (shouldReload) window.location.reload();
    }
}
