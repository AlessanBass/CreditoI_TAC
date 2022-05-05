const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let loteria;
let contas;

beforeEach(async () => {
  contas = await web3.eth.getAccounts();

  loteria = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: contas[0], gas: "1000000" });
});
describe("Contrato Credito", () => {
  it("Deploy a contract", () => {
    // console.log(inbox);
    assert.ok(loteria.options.address);
  });

  //Adiciona uma conta ao contrato 

  it("Permite que uma conta seja adicionada", async () => {
    await loteria.methods.addContaContrato().send({
      from: contas[0],
      value: web3.utils.toWei("0.2", "ether"),
    });

    const jogadores = await loteria.methods.getContas().call({
      from: contas[0],
    });

    assert.strictEqual(contas[0], jogadores[0]);

    assert.strictEqual(1, jogadores.length);
  });

  //Adiciona várias contas ao contrato
  it("Permite que varias contas sejam adicionadas", async () => {
    await loteria.methods.addContaContrato().send({
      from: contas[0],
      value: web3.utils.toWei("0.2", "ether"),
    });
    await loteria.methods.addContaContrato().send({
      from: contas[1],
      value: web3.utils.toWei("0.2", "ether"),
    });
    await loteria.methods.addContaContrato().send({
      from: contas[2],
      value: web3.utils.toWei("0.2", "ether"),
    });

    const jogadores = await loteria.methods.getContas().call({
      from: contas[0],
    });

    assert.strictEqual(contas[0], jogadores[0]);
    assert.strictEqual(contas[1], jogadores[1]);
    assert.strictEqual(contas[2], jogadores[2]);

    assert.strictEqual(3, jogadores.length);
  });

  //Verifica a quantidade de GWEI para que a transação aconteça
  it("Verificando a quantidade mínima de ether", async () => {
    try {
      await loteria.methods.addContaContrato().send({
        from: contas[0],
        value: 0,
      });

      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  //Verifica o gerente
  it("Somente o gerente pode fazer o sorteio", async () => {
    try {
      await loteria.methods.transferencia(contas[1], web3.utils.toWei("0.2", "ether")).send({
        from: contas[1],
      });

      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });


  it("Testando o contrato como um todo", async () => {
    await loteria.methods.addContaContrato().send({
      from: contas[0],
      value: web3.utils.toWei("2", "ether"),
    });
    
    //saldoConta() retorna o saldo da conta
    const saldoInicial = await web3.eth.getBalance(contas[1]);

    await loteria.methods.transferencia(contas[1], web3.utils.toWei("0.2", "ether")).send({ from: contas[0] });

    const saldoFinal = await web3.eth.getBalance(contas[1]);

    const diferenca = saldoFinal - saldoInicial;

    assert(diferenca > web3.utils.toWei("1.8", "ether"));
  });
});