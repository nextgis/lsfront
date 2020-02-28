import { AnnexInputAttribution } from './interfaces';

export const inputAttributions: AnnexInputAttribution[] = [
  {
    name: 'person',
    label: 'Лицо, подавшее декларацию',
    value: '',
    hidden: false
  },
  { name: 'head', label: 'Ф.И.О.', value: '', hidden: false },
  {
    name: 'sign',
    label: '(подпись, печать)',
    value: '',
    hidden: true,
    saved: false
  },
  { name: 'date', label: 'Дата', value: '', hidden: false }
];

export const defaultScales: number[] = [10000, 25000, 50000, 100000, 250000];
