import { Accountability, Filter } from '../types';
import { toArray } from '../utils/to-array';
import { adjustDate } from './adjust-date';
import { deepMap } from './deep-map';

export function parseFilter(filter: Filter, accountability: Accountability | null): any {
	return deepMap(filter, (val, key) => {
		if (val === 'true') return true;
		if (val === 'false') return false;
		if (val === 'null' || val === 'NULL') return null;

		if (['_in', '_nin', '_between', '_nbetween'].includes(String(key))) {
			if (typeof val === 'string' && val.includes(',')) return val.split(',');
			else return toArray(val);
		}

		if (val && val.startsWith('$NOW')) {
			if (val.includes('(') && val.includes(')')) {
				const adjustment = val.match(/\(([^)]+)\)/)?.[1];
				return adjustDate(new Date(), adjustment);
			}

			return new Date();
		}
		if (val === '$CURRENT_USER') return accountability?.user || null;
		if (val === '$CURRENT_ROLE') return accountability?.role || null;

		return val;
	});
}
