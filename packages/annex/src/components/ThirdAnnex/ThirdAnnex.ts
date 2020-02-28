import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { mdiPrinter, mdiContentSave, mdiArrowLeft, mdiPageNext } from '@mdi/js';

import { ResourceStoreItem } from '@nextgis/ngw-connector';
import NgwMap, { LngLatBoundsArray } from '@nextgis/ngw-map';
import NgwKit from '@nextgis/ngw-kit';

import { NgwLayersList } from '@nextgis/vuetify-ngw-components';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import {
  getBoundsFromGeojson,
  createGeoJsonFromBounds
} from '@veles/common/src/utils/boundsUtils';

import RestoreError from '../RestoreError/RestoreError.vue';
import PlotSelectList from '../PlotSelectList/PlotSelectList.vue';
import SheetLayoutComponent from '../ThirdSheetLayout/ThirdSheetLayout.vue';
import SaveControl from '../SaveControl/SaveControl.vue';
import SelectScale from '../SelectScale/SelectScale.vue';
import SheetLayout from '../ThirdSheetLayout/ThirdSheetLayout';
import {
  AnnexInputAttribution,
  ThirdAnnexDataProperties
} from '../../interfaces';

import { thirdAnnexModule } from '../../store/annex3/annex3';

import {
  ThirdAnnexFeature,
  ThirdAnnexProperties
} from '../../store/interfaces';
import { inputAttributions } from '../../config';

@Component({
  components: {
    LoadingComponent,
    PlotSelectList,
    SheetLayoutComponent,
    NgwLayersList,
    SaveControl,
    SelectScale,
    RestoreError
  }
})
export default class extends Vue {
  @Prop({ type: String }) id!: number;
  @Ref('SheetLayout') readonly sheetLayout!: SheetLayout;
  @Ref('NgwLayersList') readonly ngwLayersList!: NgwLayersList;
  bounds: LngLatBoundsArray | [] = [];
  lesids: number[] = [];
  svg = {
    left: mdiArrowLeft,
    print: mdiPrinter,
    save: mdiContentSave,
    next: mdiPageNext
  };
  isLoading = true;
  isError = false;

  singleSelect = false;
  selectedPlots: ResourceStoreItem[] = [];

  ngwMap?: NgwMap | false = false;

  selectionLayers: string[] = [];

  step = 1;
  activeScale = 0;

  inputAttributions: Array<AnnexInputAttribution> = inputAttributions;

  get module() {
    return thirdAnnexModule;
  }

  get fileName() {
    return 'Приложение 3';
  }

  get visibleInputAttributions() {
    return this.inputAttributions.filter(x => !x.hidden);
  }

  mounted() {
    this._initialize().then(() => {
      this.isLoading = false;
    });
  }

  updated() {
    if (this.sheetLayout) {
      this.ngwMap = this.sheetLayout.ngwMap;
    }
  }

  onUpdateSelected(e: ResourceStoreItem[]) {
    this.selectedPlots = e;
  }

  updateActiveScale(val: number) {
    this.activeScale = val;
  }

  goToConfigStep() {
    this.step = this.selectedPlots.length ? 2 : 1;
  }

  goToList() {
    this.$router.push(`/${this.module.keyname}/list`);
  }

  goToEdit(id: string | number) {
    this.$router.push({ path: `/${this.module.keyname}/edit/${id}` });
  }

  save() {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      const bounds = ngwMap.getBounds();
      if (bounds) {
        const geojson = createGeoJsonFromBounds(bounds) as ThirdAnnexFeature;

        const firstPlot = this.selectedPlots[0];
        const { LES, MUN } = firstPlot;

        geojson.properties = {
          lesids: this.selectedPlots
            .filter(x => x['ID_LES'])
            .map(x => x['ID_LES'])
            .join(';'),
          MUN,
          LES
        } as ThirdAnnexProperties;

        const data: ThirdAnnexDataProperties = {
          ids: this.selectedPlots.map(x => x.id),
          inputAttributions: {},
          layers: []
        };
        this.inputAttributions.forEach(x => {
          const toSave = x.saved !== undefined ? x.saved : true;
          if (toSave) {
            // @ts-ignore
            data.inputAttributions[x.name] = x.value;
          }
        });
        if (this.ngwLayersList) {
          const layers = this.ngwLayersList.selection;
          data.layers = layers;
        }
        geojson.properties.data = JSON.stringify(data);
        geojson.properties =
          (this.updateSavedProperties(
            geojson.properties
          ) as ThirdAnnexProperties) || geojson.properties;
        this.module.patch({
          item: geojson,
          fid: this.id
        });
        this.goToList();
      }
    }
  }

  protected updateSavedProperties(data: Record<string, any>) {
    return data;
  }

  protected async _initialize() {
    if (this.id) {
      try {
        await this._restore(Number(this.id));
      } catch (er) {
        console.log(er);
        this.isError = true;
      }
    }
  }

  protected async _restore(id: number) {
    const store = await this.module.getStore();
    if (store) {
      const item = store.find(x => x.id === Number(id));
      if (item) {
        const data: ThirdAnnexDataProperties = JSON.parse(item.data);
        const lesidArray = data.ids;
        // const lesidArray = item.lesids.split(';').map(x => Number(x));
        const lesid = lesidArray[0];
        if (lesid !== undefined) {
          const resources = await this.module.getResources();
          const resourceId = resources[this.module.keyname];
          const geojson = await NgwKit.utils.getNgwLayerFeature({
            connector: this.module.connector,
            featureId: Number(id),
            resourceId
          });
          this.bounds = await getBoundsFromGeojson(geojson);
          this.lesids = lesidArray;
          this.step = 2;
        }

        const inputAttributions = data.inputAttributions;
        if (inputAttributions) {
          this.inputAttributions.forEach(x => {
            const value = inputAttributions[x.name];
            if (value !== undefined) {
              x.value = value;
            }
          });
        }

        if (data.layers) {
          this.selectionLayers = data.layers;
        }
      }
    }
  }
}
