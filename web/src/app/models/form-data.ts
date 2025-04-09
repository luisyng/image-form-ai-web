export interface DataValue {
    id: string;
    value: any;
}

export interface FormData {
    id: string;
    values: DataValue[];
}

export type FormDataProjection = { [key: string]: any }