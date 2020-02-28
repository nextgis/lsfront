import { Map } from 'leaflet';
import {
  mdiPencil,
  mdiExport,
  mdiImport,
  mdiContentSave,
  mdiClose,
  mdiTrashCan
} from '@mdi/js';
import { Component, Mixins, Watch, Prop, Vue } from 'vue-property-decorator';
import NgwMap, { LayerAdapter, PropertiesFilter } from '@nextgis/ngw-map';
import { NgwLayersList } from '@nextgis/vuetify-ngw-components';
import { LoadingComponent } from '@veles/common/src/components/LoadingComponent';
import { connector } from '@veles/common/src/ngw/connector';
// @ts-ignore
import { VBtn } from 'vuetify/lib';
// @ts-ignore
import PlotAttributes from '../PlotAttributes/PlotAttributes.vue';
// @ts-ignore
import PlotFilter from '../PlotFilter/PlotFilter.vue';
import PlotNgwMap from '../PlotNgwMap/PlotNgwMap';
import { plotModule } from '../../store/plot';
import { PlotEditorMixin } from './mixins/PlotEditorMixin';

import { PlotProperties, PlotLayerDefinition } from '../../interfaces';
import { tokml } from '../../utils/kml';
import { download } from '../../utils/download';

export type Modes = 'show' | 'edit';
interface ToolbarItem {
  title: string;
  icon: string;
  right?: boolean;
  method?: string;
  onClick?: (...args: any[]) => void;
  disabled?: () => boolean;
  show?: () => boolean;
}

@Component({
  components: {
    PlotNgwMap,
    NgwLayersList,
    PlotAttributes,
    LoadingComponent,
    PlotFilter
  }
})
export default class PlotMap extends Mixins(PlotEditorMixin) {
  @Prop({ type: String, default: '' }) lesid!: string;
  @Prop({ type: String, default: 'edit' }) mode!: Modes;
  @Prop({ type: Boolean, default: true }) fit!: boolean;

  svg = {
    mdiPencil,
    mdiExport,
    mdiImport,
    mdiClose
  };
  attrDrawer = false;
  layersDrawer = false;
  plotNgwMap: PlotNgwMap | false = false;
  ngwMap: NgwMap<Map> | false = false;

  requiredPlotFields: Array<keyof PlotProperties> = [];

  overlay = false;
  isLoading = false;

  baseLayers: LayerAdapter[] = [];

  promises: Record<string, Promise<any>> = {};
  plotFilter: PropertiesFilter = [];
  filteredFields: string[] = ['KV', 'YEAR_DEV', 'SENDER_NAM'];

  get toolbarItems() {
    const plotNgwMap = this.plotNgwMap;
    if (plotNgwMap) {
      const items: Record<Modes, ToolbarItem[]> = {
        edit: [
          {
            title: 'Импорт GPS',
            icon: mdiImport,
            onClick: () => plotNgwMap.import()
          },
          {
            title: 'Экспорт GPS',
            icon: mdiExport,
            onClick: () => plotNgwMap.export(),
            disabled: () => !plotNgwMap.validatePlot()
          },
          {
            title: 'Удалить',
            icon: mdiTrashCan,
            right: true,
            onClick: () => {
              this.isLoading = true;
              plotNgwMap.remove();
              this.isLoading = false;
            },
            show: () => !!this.lesid,
            disabled: () => !plotNgwMap.validatePlot()
          },
          {
            title: 'Сохранить',
            icon: mdiContentSave,
            right: true,
            onClick: async () => {
              this.isLoading = true;
              try {
                await plotNgwMap.save();
              } catch (er) {
                // ignore
              } finally {
                this.isLoading = false;
              }
            },
            disabled: () => !plotNgwMap.validatePlot()
          }
        ],
        show: [
          // { title: 'Редактор', icon: mdiPencil, onClick: () => (this.mode = 'edit') },
          {
            title: 'Экспорт GPS',
            icon: mdiExport,
            onClick: () => this.exportBbox()
          }
        ]
      };
      return items[this.mode].filter(x => {
        if (x.show) {
          return x.show();
        } else {
          return true;
        }
      });
    }
    return [];
  }

  get toolbarItemsLeft() {
    return this.toolbarItems.filter(x => !x.right);
  }
  get toolbarItemsRight() {
    return this.toolbarItems.filter(x => x.right);
  }

  get connector() {
    return connector;
  }

  mounted() {
    const plotRef = this.$refs.PlotNgwMap as PlotNgwMap;
    const ngwMap = plotRef.ngwMap;

    if (ngwMap) {
      this.plotNgwMap = plotRef;
      this.ngwMap = ngwMap;
      ngwMap.emitter.on('ngw:select', e => {
        if (e && this.mode === 'show') {
          plotRef.setPlotHighlightLayer(e);
        }
      });
    }
  }

  @Watch('lesid')
  async updateLesId(lesid: string) {
    if (this.plotNgwMap) {
      await this.plotNgwMap.updateBaseLayers();
      this.plotNgwMap.updateLayers();
    }
    if (lesid) {
      this.mode = 'edit';
    }
  }

  @Watch('mode')
  toggleMode(mode: Modes, oldMode?: Modes) {
    const plotNgwMap = this.plotNgwMap;
    if (plotNgwMap && plotNgwMap.layerCreated) {
      if (oldMode === 'edit' || mode === 'edit') {
        this.toggleEditorMode(mode === 'edit');
      }
    }
  }

  @Watch('plotFilter')
  setPlotFilter() {
    if (this.plotNgwMap) {
      this.plotNgwMap.plotFilter = this.plotFilter.length
        ? this.plotFilter
        : false;
    }
  }

  onMenuItemClick(item: ToolbarItem) {
    if (item.onClick) {
      item.onClick();
    }
  }

  isDisabled(item: ToolbarItem) {
    if (item.disabled) {
      return item.disabled();
    }
    return false;
  }

  createPlotHighlightLayerPopup(e: PlotLayerDefinition) {
    const element = document.createElement('div');
    // element.innerHTML = '1234';
    setTimeout(() => {
      const plotId = e.feature && e.feature.id;
      if (plotId) {
        const popupContentComponent = new Vue({
          // el: element,
          components: { VBtn },
          methods: {
            goToEdit: () => this.plotNgwMap && this.plotNgwMap.goToEdit(plotId)
          },
          template: `
            <div class="text-center">
              <div class="title">Лесосека #${plotId}</div>
              <v-btn @click="goToEdit">Редактировать</v-btn>
            </div>
          `
        });
        popupContentComponent.$mount(element);
      }
    }, 10);
    return element;
  }

  async exportBbox() {
    this.isLoading = true;
    try {
      const features = await this.getFeaturesFromBbox();
      if (features) {
        features.features.forEach(x => {
          x.properties['fill-opacity'] = 0.1;
          x.properties['stroke'] = '#ff0000';
          x.properties['fill'] = '#ff0000';
          x.properties['stroke-opacity'] = 1;
          x.properties['stroke-width'] = 2;
        });
        const kml = await tokml(features);
        download('plots.kml', kml);
      }
    } catch {
      //
    } finally {
      this.isLoading = false;
    }
  }

  async getFeaturesFromBbox() {
    const ngwMap = this.ngwMap;
    if (ngwMap) {
      const geojson = ngwMap.getBoundsPolygon();
      if (geojson) {
        const { prepareGeomToNgw } = await import(
          '../../../../../nextgisweb_frontend/packages/vuex-ngw/src/utils/prepareGeomToNgw'
        );
        const wkt = prepareGeomToNgw(geojson);
        const { plot } = await plotModule.getResources();
        return ngwMap.getNgwLayerFeatures({
          resourceId: plot,
          intersects: wkt
        });
      }
    }
  }
}
