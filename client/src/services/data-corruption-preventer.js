import { DBRepository } from '../repositories/db-repository';

export class DataCorruptionPreventer {

    _appContext = null;
    _interval = null;
    _INTERVAL_TIME = 2000;
    _lastDBSaveTime = null;
    _LAST_SAVE_DATE_KEY = 'last_save_date';

    constructor(appContext) {
        this._appContext = appContext;
        this._lastDBSaveTime = this._getStoredDate();
        this._registerAfterSaveHook();
        this._registerOnDirtyDBCallback();
    }

    _registerAfterSaveHook() {
        this._appContext.getRepository(DBRepository).registerAfterSaveHook(() => {
            this._updateLastSaveInfo();
        });
    }

    _registerOnDirtyDBCallback() {
        this._appContext.getRepository(DBRepository).registerOnDirtyDBCallback(() => {
            this._onDirtyDB();
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
        return (storedDate && !this._lastDBSaveTime) || (storedDate && this._lastDBSaveTime && this._lastDBSaveTime < storedDate);
    }

    start() {
        this._interval = setInterval(() => {
            if (this._isWorkingDirty()) {
                this._appContext.getRepository(DBRepository).enableSavingPrevention();
                clearInterval(this._interval);
                this._onDirtyDB();
            }
        }, this._INTERVAL_TIME)
    }

    _onDirtyDB() {
        const shouldReload = window.confirm('Usted esta trabajando con una version desactualizada de la base de datos local y no podra guardar cambios en esta.' +
            ' Por favor recargue la aplicación para poder volver a utilizarla con normalidad o haga click en aceptar para hacerlo automáticamente.');
        if (shouldReload) window.location.reload();
    }
}