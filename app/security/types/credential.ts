export interface Credential {
    sub: string
    name: string
    role: Role,
    iat: number,
    exp: number,
}

export enum Role {
    ADMIN,
    USER,
}