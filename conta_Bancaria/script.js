const form = document.getElementById('cadastroForm');


form.addEventListener('submit', (event) => {
   event.preventDefault();


   // Validação dos campos
   if (!form.nome.value || !form.email.value || !form.cpf.value || !form.dataNascimento.value) {
       alert('Por favor, preencha todos os campos.');
       return;
   }


   if (!isValidEmail(form.email.value)) {
       alert('Por favor, insira um email válido.');
       return;
   }


   // ... outras validações


   // Se todas as validações passarem, enviar os dados para o servidor
   const formData = new FormData(form);
   const data = Object.fromEntries(formData.entries());


   fetch('/cadastro', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
   })
   .then(response => {
       if (response.ok) {
           window.location.href = 'operator.html';
       } else {
           // Tratar erro
       }
   })
   .catch(error => {
       console.error('Erro ao cadastrar:', error);
   });
});


// Funções de validação
function isValidEmail(email) {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email);
}


function validarCPF(cpf) {
   // Elimina caracteres não numéricos
   cpf = cpf.replace(/\D/g, '');
    // Verifica se o CPF tem 11 dígitos
   if (cpf.length !== 11) {
     return false;
   }
    // Verifica se todos os dígitos são iguais
   if (/^(\d)\1{10}$/.test(cpf)) {
     return false;
    }
    // Validação dos dígitos verificadores
   let soma = 0;
   let resto;
   for (let i = 1; i <= 9; i++) {
     soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
   }
   resto = (soma * 10) % 11;
   if (resto === 10 || resto === 11) {
     resto = 0;
   }
   if (resto !== parseInt(cpf.substring(9,
  10))) {
     return false;
   }
    soma = 0;
   for (let i = 1; i <= 10; i++) {
     soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
   }
   resto = (soma * 10) % 11;
   if (resto === 10 || resto === 11) {
     resto = 0;
   }
   if (resto !== parseInt(cpf.substring(10,
  11))) {
     return false;
    }
    // Se passou por todas as validações, o CPF é válido
   return true;
 }

form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Validação dos campos
    if (!form.nome.value || !form.email.value || !form.cpf.value || !form.dataNascimento.value) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!isValidEmail(form.email.value)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // ... outras validações

    // Se todas as validações passarem, enviar os dados para o servidor
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Status da resposta:', response.status);
        console.log('Corpo da resposta:', response.json()); // Assumindo que a resposta é JSON
    
        if (response.ok) {
            console.log('Redirecionando para operator.html');
            window.location.href = 'operator.html';
        } else {
            console.error('Erro:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
    });
});

// Funções de validação
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCPF(cpf) {
    // Elimina caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
  
    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }
  
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
  
    }
  
    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9,
   10))) {
      return false;
    }
  
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10,
   11))) {
      return false;
  
    }
  
    // Se passou por todas as validações, o CPF é válido
    return true;
  }

def menu();
  menu = """\n
  ============== MENU ===============
  [d]\tDepositar
  [s]\tSacar
  [e]\tExtrato
  [nc]\tNova conta
  [lc]\tListar contas
  [nu]\tNovo usuário
  [q]\tSair
  => """
  return input(textwrap.dedent(menu))


def depositar(saldo, valor, extrato, /):
  if valor > 0:
      saldo += valor
      extrato += f"Depósito:\tR$ {valor: .2f}\n"
      print("\n Saldo Realizado com sucesso!")
  else:
      print("\n Operação não realizada!")


  return saldo, extrato   


def sacar(*, saldo, valor, extrato, limite, numero_saques, limite_saques):
  excedeu_saldo = valor > saldo
  excedeu_limite = valor > limite
  excedeu_saques = numero_saques >= limite_saques


  if excedeu_saldo:
      print("\n Operação falhou! Saldo insuficiênte.")


  elif excedeu_limite:
      print("\n Operação Falhou! O valor do saque excede o limite.")


  elif excedeu_saques:
      print("\n Operação falhou! Excedeu o número de saques Diários.")


  elif valor > 0:
      saldo -= valor
      extrato += f"Saque:\t\tR$ {valor:.2f}\n"
      numero_saques += 1
      print(" Saque realizado com sucesso!")


  else:
      print("Operação falhou! O valor infiormado é inválido")  


  return saldo, extrato 


def exibir_extrato(saldo, /, *, extrato):
  print("\n================ EXTRATO ===============")
  print("Não forma realizados movimentações." if not extrato else extrato)
  print(f"\nSaldo:\t\tR$ {saldo:.2f}")
  print("==========================================")


def criar_usuario(usuarios):
  cpf = input("Informe o CPF (somente números):")
  usuario = filtrar_usuario(cpf, usuarios)
 
  if usuario:
      print(" Já exixt usuário com esse CPF cadastrado!")
      return


  nome = input("Informe seu nome completo:")
  data_nascimento = input("Informe a data de nascimento (dd-mm-aaaa):")
  endereco = input("Informe o endereço (logradouro, número - bairro - cidade/sigla estado):")


  usuarios.append({"nome": nome, "data_nascimento": data_nascimento, "cpf": cpf, "endereco": endereco})
  print("Usuario cadastrado com sucesso!")




def filtrar_usuario(cpf, usuarios):
  usuarios_fitrados = [usuario for usuario in usuarios if usuario["cpf"] == cpf]
  return usuarios_fitrados[0] if usuarios_fitrados else None


def criar_conta(agencia, numero_conta, usuarios):
  cpf = input("Informe o CPF do usuário:")
  usuario = filtrar_usuario(cpf, usuarios)


  if usuario:
      print("\n Conta criada com sucesso!")
      return {"agencia": agencia, "numero_conta": numero_conta, "usuario": usuario}
 
  print("Usuário não encontrado, Não foi possível criar a conta")


def listar_contas(contas):
  for conta in contas:
      linha = f"""\
           Agência:\t{conta['agencia']}
           C/C:\t{conta['numero_conta']}
           Titular:\t{conta['usuario']['nome']}
      """
      print("=" * 100)
      print(textwrap.dedent(linha))




def main():
  LIMITE_SAQUES = 3
  AGENCIA = "0001"


  saldo = 0
  limite = 500
  extrato = ""
  numero_saques = 0
  usuarios = []
  contas = []


  while True:
      opcao = menu()


      if opcao == "d":
          valor = float(input("Informe o valor do depósito: "))


          saldo, extrato = depositar(saldo, valor, extrato)          


      elif opcao == "s":
          valor = float(input("Informe o valor do saque: "))


          saldo, extrato, numero_saques = sacar(
              saldo=saldo,
              valor=valor,
              extrato=extrato,
              limite=limite,
              numero_saques=numero_saques,
              limite_saques=LIMITE_SAQUES
          )
         
      elif opcao == "e";
          exibir_extrato(saldo, extrato=extrato)


      elif opcao == "nu";
          criar_usuario(usuarios)
     
      elif opcao == "nc";
          numero_conta = len(contas) + 1
          conta = criar_conta(AGENCIA, numero_conta, usuarios)
     
          if conta;
              contas.append(conta)


      elif opcao == "lc";
          listar_contas(contas)


      elif opcao == "q";
          break


  else;
      print("Operação inválida, por favor certifique-se de escolher corretamente a operação desejada.")




main()


  function executarOperacao() {
    const operacaoSelecionada = document.getElementById('operacao').value;

    switch (operacaoSelecionada) {
        case 'deposito':
            // Chamar a função da operação 1
            depositar();
            break;
        case 'sacar':
            // Chamar a função da operação 2
            sacar();
            break;
            case 'extrato':
              // Chamar a função da operação 2
              exibir_extrato();
              break;
    }
}

function depositar() {
  // Lógica da operação 1
  console.log("Executando a depósito");
}

function sacar() {
  // Lógica da operação 2
  console.log("Executando saque");
}

function exibir_extrato() {
  // Lógica da operação 2
  console.log("Consolidando extrato");
}