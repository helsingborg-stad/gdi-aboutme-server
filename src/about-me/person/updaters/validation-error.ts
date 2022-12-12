import { GraphQLError } from 'graphql'

export const throwValidationErrorForField = (fieldName: string): void => {
	throw new GraphQLError('Validation error', {
		extensions: {
			'validation-failed-for-field': fieldName,
		},
	})
}