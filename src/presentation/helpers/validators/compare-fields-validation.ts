import { Validation } from "../../protocols/validation";
import { MissingParamError } from "../../errors";

export class CompareFieldsValidation implements Validation {

    constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {
       this.fieldName = fieldName
       this.fieldToCompareName = fieldToCompareName
    }

    validate(input: any): Error {
        if (!input[this.fieldName] !== input[this.fieldToCompareName]) {
            return new MissingParamError(this.fieldToCompareName)
        }
    }
}