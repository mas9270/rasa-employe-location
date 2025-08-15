import React from 'react'
export interface StructureInfo {
    loading: boolean,
    paths: {
        mode: "view" | "add" | "edit",
        pathList: any[],
        clickPathInfo: any,
    },
    locations: {
        mode: "view" | "add" | "edit",
        pathList: any[],
        latLng: any[]
    },
}

export type StructureInfoSet = React.Dispatch<React.SetStateAction<StructureInfo>>