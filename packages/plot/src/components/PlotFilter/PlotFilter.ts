import { Vue, Component, Prop, Model } from 'vue-property-decorator';

import { ResourceItemDatatype } from '@nextgis/ngw-connector';
import { PropertiesFilter, checkIfPropertyFilter } from '@nextgis/utils';

import { LoadingComponent } from '@veles/common';

import { plotModule } from '../../store/plot';

interface Field {
  text: string;
  value: any;
  type?: ResourceItemDatatype;
}

@Component({
  components: { LoadingComponent }
})
export default class PlotFilter extends Vue {
  @Prop({ type: Array, default: () => [] }) filteredFields!: string[];
  @Model('filterSet', { type: Array, default: () => [] })
  readonly filter!: PropertiesFilter;

  filtersValues: { [filterField: string]: any } = {};

  get fields(): Field[] {
    const fields = plotModule.fields;
    const headers: Field[] = [];
    fields.forEach(x => {
      if (this.filteredFields.includes(x.keyname)) {
        headers.push({
          text: x.display_name,
          value: x.keyname,
          type: x.datatype
        });
      }
    });
    return headers;
  }

  get lookupTables() {
    return plotModule.lookupTables;
  }

  setFilter() {
    const filter: PropertiesFilter = [];
    for (const f in this.filtersValues) {
      const val = this.filtersValues[f];
      if (val) {
        filter.push([f, 'eq', val]);
      }
    }
    this.$emit('filterSet', filter);
  }

  cleanFilter() {
    for (const f in this.filtersValues) {
      this.filtersValues[f] = undefined;
    }
    this.setFilter();
  }

  getLookupItems(field: Field): Field[] {
    const lookupTable = this.lookupTables[field.value];
    if (lookupTable) {
      return Object.keys(lookupTable).map(key => {
        return { text: lookupTable[key], value: key };
      });
    }
    return [];
  }

  beforeMount() {
    this.filteredFields.forEach(x => {
      Vue.set(this.filtersValues, x, '');
    });
    this._parseFilter();
  }

  mounted() {
    plotModule.getFields();
  }

  private _parseFilter() {
    this.filter.forEach(x => {
      if (checkIfPropertyFilter(x)) {
        this.filtersValues[x[0]] = x[2];
      }
    });
  }
}
