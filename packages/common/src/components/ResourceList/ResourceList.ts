import { Vue, Component } from 'vue-property-decorator';
import { ResourceStore } from '@nextgis/vuex-ngw';
import { LoadingComponent } from '@veles/common';
import { ResourceStoreItem } from '@nextgis/ngw-connector';
import { mdiPencil, mdiTrashCan } from '@mdi/js';
import { AppVue } from '../../interfaces';
import { GeoJsonProperties, Geometry } from 'geojson';

@Component({
  components: { LoadingComponent }
})
export default class ResourceList<
  P extends GeoJsonProperties = GeoJsonProperties,
  G extends Geometry | null = Geometry
> extends Vue {
  module!: ResourceStore<P, G>;

  exclude: string[] = [];
  displayFields: Record<string, (val: string) => string> = {};

  $root!: AppVue;

  svg = {
    edit: mdiPencil,
    delete: mdiTrashCan
  };
  isLoading = true;
  showActions = true;

  get keyname() {
    return this.module.keyname;
  }

  get items(): ResourceStoreItem[] {
    return this.module.resourceItem;
  }

  get fields() {
    const fields = this.module.fields;
    const headers: any[] = [];
    if (this.showActions) {
      headers.push({ text: '', value: 'action', sortable: false });
    }
    fields.forEach(x => {
      const allowedField =
        this.exclude.indexOf(x.keyname) === -1 && x.grid_visibility;
      if (allowedField) {
        headers.push({
          text: x.display_name,
          value: x.keyname
        });
      }
    });
    return headers;
  }

  mounted() {
    this._updateStore();
  }

  goToEdit(lesid: string | number) {
    this.$router.push(`/${this.keyname}/edit/${lesid}`);
  }

  editItem(item: ResourceStoreItem) {
    this.goToEdit(item.id);
  }

  async deleteItem(item: ResourceStoreItem) {
    const confirm = this.$root.$confirm;
    const resp = await confirm.open({
      message: `Вы уверены что хотите удалить объект - ${item.id}`
    });
    if (resp) {
      await this.module.delete(Number(item.id));
    }
  }

  private async _updateStore() {
    // const module = this.module;
    await this.module.getFields();
    await this.module.getStore();
    this.isLoading = false;
  }
}
