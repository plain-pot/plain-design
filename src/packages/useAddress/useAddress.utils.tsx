export interface iAddressData {
    id: string,
    code: string,
    name: string,
    parentCode: string,
    parentName: string,
    deep: number,
}

export interface iGetAddressByCodes {
    (codes: string[]): Promise<Record<string, iAddressData>>
}

export interface iGetAddressByParentCodes {
    (codes: string[]): Promise<Record<string, iAddressData[]>>
}

export interface iGetAddressByName {
    (name: string, deep?: number): Promise<iAddressData[]>
}

export interface iAddressConfig {
    getAddressByCodes: iGetAddressByCodes,
    getAddressByParentCodes: iGetAddressByParentCodes,
    getAddressByName: iGetAddressByName,
}

export interface iUseAddressConfig {
    (): iAddressConfig
}

export interface iAddressService {
    getAddrByCode: (code: string) => Promise<iAddressData>,
    getNameByCodeComputed: (code: string) => string,
    getAddressByParentCode: (code: string) => Promise<iAddressData[]>,
    config: iAddressConfig,
}

export interface iUseAddress {
    (): { $address: iAddressService }
}
