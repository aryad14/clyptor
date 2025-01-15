import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/lib/verification-token';
import { getResetTokenByEmail } from '@/lib/passwordResetToken';

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); //token expires in 1Hr

    const existingToken = await getResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }

    const resetToken = await db.passwordResetToken.create({
        data: {
            token,
            email,
            expires
        }
    });
    return resetToken;
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); //token expires in 1Hr

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            token,
            email,
            expires
        }
    });
    return verificationToken;
}