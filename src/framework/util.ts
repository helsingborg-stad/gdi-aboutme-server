export const mapValues = <T, S>(obj: Record<string, T>, valueFn: ((v: T) => S)): Record<string, S> => Object
	.entries(obj)
	.reduce((agg, [ k, v ]) => ({
		...agg,
		[k]: valueFn(v),
	}), {} as Record<string, S>)
