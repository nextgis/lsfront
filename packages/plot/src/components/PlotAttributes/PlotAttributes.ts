import { Vue, Component, Prop } from 'vue-property-decorator';
import { LoadingComponent } from '@veles/common';
import { plotModule } from '../../store/plot';
import { PlotLayerDefinition } from '../../interfaces';
import { ResourceItemDatatype, NgwDateFormat } from '@nextgis/ngw-connector';

interface Field {
  text: string;
  value: any;
  type?: ResourceItemDatatype;
}

@Component({
  components: { LoadingComponent }
})
export default class PlotAttributes extends Vue {
  @Prop() plot!: PlotLayerDefinition;
  @Prop({ type: Boolean, default: false }) editable!: boolean;

  get fields(): Field[] {
    const fields = plotModule.fields;
    const headers = fields.map(x => {
      return {
        text: x.display_name,
        value: x.keyname,
        type: x.datatype
      };
    });
    return headers;
  }

  get lookupTables() {
    return plotModule.lookupTables;
  }

  getFieldValue(field: Field, value: any) {
    if (field.type === 'DATE') {
      return this._getStrFromDateField(value);
    }
    return value;
  }

  setFieldValue(f: Field, val: any) {
    if (f.type === 'DATE') {
      val = this._getDateFieldFromStr(val);
    }
    // @ts-ignore
    this.plot.feature.properties[f.value] = val;
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

  mounted() {
    plotModule.getFields();
  }

  private _getDateFieldFromStr(date: string | Date): NgwDateFormat | undefined {
    if (!date) {
      return undefined;
    }
    let dt: Date | undefined;
    if (date instanceof Date) {
      dt = date;
    } else {
      const parse = Date.parse(date);
      if (parse) {
        dt = new Date(parse);
      }
    }
    if (dt) {
      return {
        year: dt.getFullYear(),
        month: dt.getMonth() + 1,
        day: dt.getDate()
      };
    }
  }

  private _getStrFromDateField(date: NgwDateFormat) {
    return date ? [date.year, date.month, date.day].join('-') : '';
  }
}
