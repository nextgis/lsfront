import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { mdiPrinter, mdiContentSave, mdiArrowLeft } from '@mdi/js';
import { FeatureCollection, Feature, Polygon } from 'geojson';

import { ResourceStoreItem } from '@nextgis/ngw-connector';

import { LoadingComponent } from '@veles/common';
import { PlotLayerDefinition } from '@veles/plot/src/interfaces';
import {
  createGeoJsonFromBounds,
  getBoundsFromGeojson
} from '@veles/common/src/utils/boundsUtils';
import { LngLatBoundsArray } from '@nextgis/webmap';

import { fourthAnnexModule } from '../../store/annex4/annex4';
import RestoreError from '../RestoreError/RestoreError.vue';
import ThirdAnnexSelectList from '../ThirdAnnexSelectList/ThirdAnnexSelectList.vue';
import SaveControl from '../SaveControl/SaveControl.vue';
import SheetLayout from '../FourthSheetLayout/FourthSheetLayout';
import SheetLayoutComponent from '../FourthSheetLayout/FourthSheetLayout.vue';
import {
  FourthAnnexFeature,
  FourthAnnexProperties
} from '../../store/interfaces';
import {
  FourthAnnexDataProperties,
  FourthSheetProperties,
  AnnexInputAttribution
} from '../../interfaces';
import { thirdAnnexModule } from '../../store/annex3/annex3';
import { inputAttributions } from '../../config';

@Component({
  components: {
    LoadingComponent,
    SheetLayoutComponent,
    ThirdAnnexSelectList,
    SaveControl,
    RestoreError
  }
})
export default class extends Vue {
  @Prop({ type: String }) id!: number;

  annex3ids: number[] = [];
  svg = {
    left: mdiArrowLeft,
    print: mdiPrinter,
    save: mdiContentSave
  };
  isLoading = true;
  isError = false;

  selected: ResourceStoreItem[] = [];

  selectScaleItems: { text: string; value: number }[] = [];
  selectionLayers: string[] = [];

  sheetLayouts: SheetLayout[] = [];

  restoreData: FourthAnnexDataProperties | false = false;

  step = 0;

  inputAttributions: Array<AnnexInputAttribution> = inputAttributions;

  get fileName() {
    return 'Приложение 4';
  }

  get lesids() {
    const ids =
      this.selected &&
      this.selected.reduce((a, b) => {
        const lesids = JSON.parse(b.data).ids.map(String);
        return a.concat(lesids);
      }, []);
    return ids || [];
  }

  get visibleInputAttributions() {
    return this.inputAttributions.filter(x => !x.hidden);
  }

  get restoredSheets(): FourthSheetProperties[] {
    const sheets = this.restoreData && this.restoreData.sheets;
    return sheets || [];
  }

  getSheet(sheetId: string) {
    return this.restoredSheets.find(x => x.id === sheetId);
  }

  getSheetBounds(sheetId: string): LngLatBoundsArray {
    const sheet = this.getSheet(sheetId);
    if (sheet) {
      return sheet.bounds;
    }
    return [];
  }

  mounted() {
    this._initialize().then(() => {
      this.isLoading = true;
    });
  }

  updated() {
    const sheets: SheetLayout[] = [];
    this.lesids.forEach(x => {
      const sheetLayout = this.$refs['SheetLayout' + x] as SheetLayout[];
      if (sheetLayout) {
        sheets.push(sheetLayout[0]);
      }
    });
    this.sheetLayouts = sheets;
  }

  onUpdateSelected(e: ResourceStoreItem[]) {
    this.selected = e;
  }

  @Watch('selected')
  goToConfigStep() {
    this.step = this.selected.length ? 2 : 1;
  }

  goToList() {
    this.$router.push('/annex4/list');
  }

  goToEdit(id: string | number) {
    this.$router.push({ path: `/annex4/edit/${id}` });
  }

  async save() {
    const data: FourthAnnexDataProperties = {
      sheets: [],
      inputAttributions: {}
    };
    const features: Feature<Polygon>[] = [];
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features
    };
    let firstPlot: PlotLayerDefinition | undefined;
    if (this.sheetLayouts.length) {
      for (const sheet of this.sheetLayouts) {
        const ngwMap = sheet.ngwMap;
        if (ngwMap) {
          if (sheet.plot) {
            firstPlot = sheet.plot;
          }
          const boundArray = ngwMap.getBounds();
          if (boundArray) {
            const latLngs = createGeoJsonFromBounds(boundArray);
            features.push(latLngs);
            const sheetProperty: FourthSheetProperties = {
              id: sheet.lesids,
              bounds: boundArray
            };
            data.sheets.push(sheetProperty);
          }
          this.inputAttributions.forEach(x => {
            const toSave = x.saved !== undefined ? x.saved : true;
            if (toSave) {
              data.inputAttributions[x.name] = x.value;
            }
          });
        }
      }
      const { LES, MUN } =
        (firstPlot && firstPlot.feature && firstPlot.feature.properties) || {};
      const properties: FourthAnnexProperties = {
        annex3ids: this.selected.map(x => x.id).join(';'),
        lesids: this.selected
          .filter(x => x.lesids)
          .map(x => x.lesids)
          .join(';'),
        MUN,
        LES,
        data: JSON.stringify(data)
      };

      const bbox = await getBoundsFromGeojson(featureCollection);

      const geojson = createGeoJsonFromBounds(bbox) as FourthAnnexFeature;
      geojson.properties = properties;
      fourthAnnexModule.patch({
        item: geojson,
        fid: this.id
      });
      this.goToList();
    }
  }

  private async _initialize() {
    if (this.id) {
      try {
        await this._restore(Number(this.id));
      } catch (er) {
        console.log(er);
        this.isError = true;
      }
    }
    this.isLoading = false;
  }

  private async _restore(id: number) {
    const store = await fourthAnnexModule.getStore();
    console.log(store);
    if (store) {
      const item = store.find(x => x.id === Number(id));
      if (item && item.annex3ids) {
        await thirdAnnexModule.getStore();
        this.annex3ids = item.annex3ids.split(';').map(Number);
        this.restoreData = JSON.parse(item.data);
        if (this.restoreData) {
          const inputAttributions = this.restoreData.inputAttributions;
          if (inputAttributions) {
            this.inputAttributions.forEach(x => {
              const value = inputAttributions[x.name];
              if (value !== undefined) {
                x.value = value;
              }
            });
          }
        }

        this.step = 2;
      }
    }
  }
}
