import { CreatureIcon } from '../components/icons/CreatureIcon';
import { FolderIcon } from '../components/icons/FolderIcon';
import { ItemIcon } from '../components/icons/ItemIcon';
import { LocationIcon } from '../components/icons/LocationIcon';
import { NPCIcon } from '../components/icons/NPCIcon';
import { QuillIcon } from '../components/icons/QuillIcon';
import { ShopIcon } from '../components/icons/ShopIcon';
import { BaseElement } from '../models/base-element';

export class ElmentIconsMapper {
    static getIcon(elementType: string) {
        const icons: any = {};
        icons[BaseElement.TYPES.PARAGRAPH] = <QuillIcon />;
        icons[BaseElement.TYPES.CONTAINER] = <FolderIcon />;
        icons[BaseElement.TYPES.LOCATION] = <LocationIcon />;
        icons[BaseElement.TYPES.SHOP] = <ShopIcon />;
        icons[BaseElement.TYPES.NPC] = <NPCIcon />;
        icons[BaseElement.TYPES.CREATURE] = <CreatureIcon />;
        icons[BaseElement.TYPES.ITEM] = <ItemIcon />;
        return icons[elementType];
    }

    static getIconFromElement(element: BaseElement) {
        return this.getIcon(element.type);
    }
}
