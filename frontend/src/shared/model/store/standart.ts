import { create } from "zustand";

export interface IPublicKeys {
    a: string,
    p: string,
    q: string,
    y: string
}

export interface ICertificateSign {
    h?: string,
    w2?: string,
    s?: string
}

interface ICertificationStore {
    private_keys?: {
        x: string
    },
    public_keys?: IPublicKeys,
    certificate?: {
        certification_center_public_key: IPublicKeys,
        user_public_key: IPublicKeys
    },
    certificate_sign?: ICertificateSign
    setAttr: (key: keyof ICertificationStore, value: bigint | number | undefined) => void,
}

export const useCertificationStore= create<ICertificationStore>((set) => ({
    setAttr: (key, value) => set(() => ({ [key]: value })),
}))