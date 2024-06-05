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

export interface IRegisterData {
    private_keys: {
        x: string
    },
    public_keys: IPublicKeys,
    certificate: {
        certification_center_public_key: IPublicKeys,
        user_public_key: IPublicKeys
    },
    certificate_sign?: ICertificateSign,

    pChecks?: string[],
    qChecks?: string[]
}

interface ICertificationStore {
    CLIENT_ID?: string;
    PEER_ID?: string;

    private_keys?: {
        x: string
    },
    public_keys?: IPublicKeys,
    certificate?: {
        certification_center_public_key: IPublicKeys,
        user_public_key: IPublicKeys
    },
    certificate_sign?: ICertificateSign,
    pChecks?: string[],
    qChecks?: string[]

    setAttr: <K extends keyof ICertificationStore>(key: K, value: ICertificationStore[K]| undefined) => void,
    getValue: <K extends keyof ICertificationStore>(key: K) => ICertificationStore[K] | undefined,
}

export const useCertificationStore = create<ICertificationStore>((set, get) => ({
    setAttr: (key, value) => set(() => ({ [key]: value })),
    getValue: (key) => get()[key]
}))