export interface iAddressData {
    id: string,
    code: string,
    name: string,
    parentCode: string,
    parentName: string,
    deep: number,
}

export interface iGetAddressByCodes {
    (codes: string[]): iAddressData[]
}

export interface iGetAddressByParentCodes {
    (codes: string[] | undefined): iAddressData[]
}

export interface iGetAddressByName {
    (name: string): iAddressData[]
}