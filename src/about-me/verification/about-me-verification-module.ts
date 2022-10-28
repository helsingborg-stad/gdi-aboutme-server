import { ApplicationContext, ApplicationModule } from '@helsingborg-stad/gdi-api-node'
import { AboutMeServices } from '../../types'


/** Expose About Me Verification REST api */
export const aboutMeVerificationModule = ({ persons }: AboutMeServices): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi({
	aboutMeVerifyEmail: async ctx => {
		const { params: { verificationCode } } = ctx
		const found = await persons.verifyEmail(verificationCode)
		ctx.body = {
			verified: !!found,
		}
	},
	aboutMeVerifyPhone: async ctx => {
		const { params: { verificationCode } } = ctx
		const found = await persons.verifyPhone(verificationCode)
		ctx.body = {
			verified: !!found,
		}
	},
})
