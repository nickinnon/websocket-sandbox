import { Credential } from "./types/credential";

// Credentials are just a base64 JSON for demo purposes.
export class CredentialUtil {
    public decodeCredential(encodedCredential: string) {
        const decoded = CredentialUtil.decodeBase64(encodedCredential.replace('Bearer ', ''));
        return JSON.parse(decoded);
    }

    private static decodeBase64(credential: string) {
        return Buffer.from(credential, 'base64').toString('ascii');
    }

    private static encodeBase64(user: Object) {
        return Buffer.from(JSON.stringify(user)).toString('base64');
    }

    public static generateBearerTokens() {
        const users = [
            {
              "sub": "1",
              "name": "Alice",
              "role": "admin",
              "iat": 1711670400,
              "exp": 1711674000
            },
            {
              "sub": "2",
              "name": "Bob",
              "role": "user",
              "iat": 1711670450,
              "exp": 1711674050
            },
            {
              "sub": "3",
              "name": "Charlie",
              "role": "moderator",
              "iat": 1711670500,
              "exp": 1711674100
            },
            {
              "sub": "4",
              "name": "Dana",
              "role": "admin",
              "iat": 1711670550,
              "exp": 1711674150
            },
            {
              "sub": "5",
              "name": "Eve",
              "role": "user",
              "iat": 1711670600,
              "exp": 1711674200
            }
        ];

        return users.map(CredentialUtil.encodeBase64);
    }
}