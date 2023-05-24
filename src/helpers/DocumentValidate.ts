export class DocumentValidate {
  static valideCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf == '') return false

    if (
      cpf.length != 11 ||
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999'
    )
      return false

    let add = 0
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
    let rev = 11 - (add % 11)
    if (rev == 10 || rev == 11) rev = 0
    if (rev != parseInt(cpf.charAt(9))) return false
    // Valida 2o digito
    add = 0
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
    rev = 11 - (add % 11)
    if (rev == 10 || rev == 11) rev = 0
    if (rev != parseInt(cpf.charAt(10))) return false
    return true
  }
  static valideCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (
      cnpj == '' ||
      cnpj.length != 14 ||
      cnpj == '00000000000000' ||
      cnpj == '11111111111111' ||
      cnpj == '22222222222222' ||
      cnpj == '33333333333333' ||
      cnpj == '44444444444444' ||
      cnpj == '55555555555555' ||
      cnpj == '66666666666666' ||
      cnpj == '77777777777777' ||
      cnpj == '88888888888888' ||
      cnpj == '99999999999999'
    )
      return false

    let digitos = cnpj.substring(12)
    const indexDigite = [0, 1]

    return indexDigite.every((index) => {
      let tamanho = 12 + index
      let soma = 0
      let pos = tamanho - 7
      let numeros = cnpj.substring(0, tamanho)
      for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros.charAt(tamanho - i)) * pos--
        if (pos < 2) pos = 9
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
      if (resultado != Number(digitos.charAt(index))) return false
      return true
    })
  }
}
