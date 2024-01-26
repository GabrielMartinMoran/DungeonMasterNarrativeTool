export const isStatblock = (data: any) => {
    return data.name && data.source && data.hp;
};

export const cleanStatblockData = (data: any) => {
    const keysToPreserve = [
        'name',
        'size',
        'type',
        'alignment',
        'ac',
        'hp',
        'speed',
        'str',
        'dex',
        'con',
        'int',
        'wis',
        'cha',
        'senses',
        'passive',
        'resist',
        'inmune',
        'conditionImmune',
        'languages',
        'action',
        'bonus',
        'reaction',
        'legendary',
        'legendaryGroup',
        'spellcasting',
        'skill',
        'save',
        'pbNote',
        'level',
        'trait',
        'bonus',
        'cr',
        'environment'
    ];
    let reduced: any = {};
    for (const key of keysToPreserve) {
        if (data[key]) reduced[key] = data[key];
    }
    return reduced;
};
