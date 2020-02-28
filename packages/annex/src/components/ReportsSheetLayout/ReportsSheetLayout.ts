import '../../sheetLayout.css';
import { Component, Prop } from 'vue-property-decorator';
import { Graticule } from 'ol';
import Map from 'ol/Map';
import Stroke from 'ol/style/Stroke';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import ResourceMap from '@veles/common/src/components/ResourceMapOl';
import BaseSheetLayout from '../BaseSheetLayout/BaseSheetLayout';

@Component({
  components: { LoadingComponent, PlotNgwMap: ResourceMap }
})
export default class extends BaseSheetLayout {
  @Prop({ type: String, default: 'reportwebmap' }) webmap!: string;

  get plotAttributes() {
    const attributes = [
      { name: 'Субъект Российской федерации', field: 'REG' },
      { name: 'Лесничество', field: 'LES' },
      { name: 'Участковое лесничество', field: 'UCH_LES' },
      { name: 'Квартал', field: 'KV' },
      { name: 'Выдел', field: 'VD' },
      { name: 'Делянка', field: 'NOM_LESKEY' },
      { name: 'Эксплуатационная площадь, га', field: 'AREA_OPER' },
      { name: 'Общая площадь, га', field: 'AREA_REAL' },
      { name: 'Форма рубки', field: 'FORMA_RUB', mode: 'usage' },
      { name: 'Вид рубки', field: 'TYPE_RUB', mode: 'usage' },
      {
        name: 'Тип лесовосстановительного мероприятия',
        field: 'TYPE_MER',
        mode: 'recovery'
      }
    ];
    return attributes.filter(x => {
      if (x.mode !== undefined) {
        return this.mode == x.mode;
      }
      return true;
    });
  }

  get orgAttributes() {
    return this.inputAttributions.filter(x => {
      return ['org', 'inn'].indexOf(x.name) !== -1;
    });
  }

  get satelliteAttributes() {
    return this.inputAttributions.filter(x => {
      return x.name !== 'satellite' && x.name.indexOf('satellite') !== -1;
    });
  }

  get title() {
    const aliases: Record<string, string> = {
      recovery: 'Отчёт о восстановлении лесов',
      usage: 'Отчёт об использовании лесов'
    };
    return aliases[this.mode];
  }

  get mode() {
    const item = this.inputAttributions.find(x => x.name === 'mode');
    return (item && item.value) || '';
  }

  async mounted() {
    if (this.ngwMap) {
      const ngwMap = await this.ngwMap.onLoad();

      const olMap = ngwMap.mapAdapter.map as Map;
      if (olMap) {
        const graticule = new Graticule({
          zIndex: 1000,
          showLabels: true,
          // the style to use for the lines, optional.
          strokeStyle: new Stroke({
            // color: 'rgba(255,120,0,0.9)',
            width: 1,
            lineDash: [0.5, 4]
          })
        });
        olMap.addLayer(graticule);
      }
    }
  }
}
