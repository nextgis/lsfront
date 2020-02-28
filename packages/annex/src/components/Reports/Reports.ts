import { Component, Watch, Mixins } from 'vue-property-decorator';

import { NgwLayersList } from '@nextgis/vuetify-ngw-components';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';

import ThirdAnnex from '../ThirdAnnex/ThirdAnnex';
import RestoreError from '../RestoreError/RestoreError.vue';
import PlotSelectList from '../PlotSelectList/PlotSelectList.vue';
import SaveControl from '../SaveControl/SaveControl.vue';
import SelectScale from '../SelectScale/SelectScale.vue';
import SheetLayoutComponent from '../ReportsSheetLayout/ReportsSheetLayout.vue';
import SatelliteSelector from '../SatelliteSelector/SatelliteSelector.vue';
import { AnnexInputAttribution } from '../../interfaces';

import { reportsModule } from '../../store/reports/reports';

@Component({
  components: {
    LoadingComponent,
    PlotSelectList,
    SheetLayoutComponent,
    NgwLayersList,
    SatelliteSelector,
    SaveControl,
    SelectScale,
    RestoreError
  }
})
export default class extends Mixins(ThirdAnnex) {
  singleSelect = true;
  modes: { text: string; value: string }[] = [
    { text: 'Восстановление', value: 'recovery' },
    { text: 'Использование', value: 'usage' }
  ];

  inputAttributions: Array<AnnexInputAttribution> = [
    {
      name: 'org',
      label: 'Наименование организации',
      value: 'ОАО «Тернейлес»'
    },
    { name: 'inn', label: 'ИНН', value: '' },
    { name: 'mode', label: 'Режим', value: 'recovery', hidden: true },
    { name: 'satellite', label: 'Спутниковый снимок', value: '', hidden: true },
    {
      name: 'satelliteType',
      label: 'Тип съемки',
      value: 'оптическая',
      hidden: true,
      saved: true
    },
    {
      name: 'satelliteSystem',
      label: 'Съемочная система',
      value: '',
      hidden: true,
      saved: true
    },
    {
      name: 'satelliteId',
      label: 'ID снимка',
      value: '',
      hidden: true,
      saved: true
    },
    {
      name: 'satelliteResolution',
      label: 'Разрешение снимка',
      value: '',
      hidden: true,
      saved: true
    },
    {
      name: 'satelliteDate',
      label: 'Дата съемки',
      value: '',
      hidden: true,
      saved: true
    }
  ];

  get module() {
    return reportsModule;
  }

  get fileName() {
    return 'Отчёт';
  }

  get mode() {
    const item = this.inputAttributions.find(x => x.name === 'mode');
    return (item && item.value) || '';
  }

  set mode(value: string) {
    const item = this.inputAttributions.find(x => x.name === 'mode');
    if (item) {
      item.value = value;
    }
  }

  get satellite() {
    const item = this.inputAttributions.find(x => x.name === 'satellite');
    return (item && item.value) || '';
  }

  set satellite(value: string) {
    const item = this.inputAttributions.find(x => x.name === 'satellite');
    if (item) {
      item.value = value;
    }
  }

  @Watch('satellite')
  setSatelliteInputAttributions(satellite: string) {
    const [
      x,
      satelliteDate,
      y,
      satelliteSystem,
      satelliteId,
      satelliteResolution
    ] = satellite.split('_');
    const attrs = {
      x,
      satelliteDate:
        satelliteDate &&
        satelliteDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3'),
      y,
      satelliteSystem,
      satelliteId,
      satelliteResolution: satelliteResolution && satelliteResolution + ' м'
    };
    Object.entries(attrs).forEach(([key, value]) => {
      const attr = this.inputAttributions.find(x => x.name === key);
      if (attr) {
        attr.value = value;
      }
    });
  }

  @Watch('selectedPlots')
  goToConfigStep() {
    this.step = this.selectedPlots.length ? 2 : 1;
  }

  mounted() {
    if (this.satellite) {
      this.setSatelliteInputAttributions(this.satellite);
    }
    this.isLoading = false;
  }

  protected updateSavedProperties(data: Record<string, any>) {
    // const mode = this.modes.find(x => x.value === this.mode);
    // data.mode = mode && mode.text;
    data.mode = this.mode;
    return data;
  }
}
