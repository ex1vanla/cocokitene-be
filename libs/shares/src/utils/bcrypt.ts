import * as bcrypt from 'bcrypt'
import configuration from '@shares/config/configuration'

export const hashPassword = async (plainPassword: string) => {
    return await bcrypt.hash(
        plainPassword + configuration().secretPasswordKey.secretKey,
        10,
    )
}

export const comparePassword = async (
    plainPassword,
    encryptedPassword,
): Promise<boolean> => {
    return await bcrypt.compare(
        plainPassword + configuration().secretPasswordKey.secretKey,
        encryptedPassword,
    )
}
