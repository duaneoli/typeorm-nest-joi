import * as Joi from 'joi'
import { DocumentValidate } from '../helpers/DocumentValidate'

export const JoiValidDocument = (...documents: Array<'CNPJ' | 'CPF'>) =>
  Joi.custom((value) => {
    let [isError, errorMessage] = [true, 'Document type ']
    documents.forEach((document) => {
      if (!isError) return

      switch (document) {
        case 'CNPJ':
          isError = !DocumentValidate.valideCNPJ(value)
          errorMessage += 'CNPJ, '
          break
        default:
          isError = !DocumentValidate.valideCPF(value)
          errorMessage += 'CPF, '
          break
      }
    })
    if (isError) throw Error(errorMessage + 'nothing valid number')

    return value.replace(/\D/g, '')
  })
