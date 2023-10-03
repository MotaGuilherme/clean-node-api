import { CompareFieldsValidation } from "./compare-fields-validation";
import { InvalidParamError } from "../../errors";

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {

    // @ts-ignore
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'wrong_value'
        })
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })

    // @ts-ignore
    test('Should not return if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({
            field: 'any_value',
            fieldToCompare: 'wrong_value'
        })
        expect(error).toBeFalsy()
    })
})