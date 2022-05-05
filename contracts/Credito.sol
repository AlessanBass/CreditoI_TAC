// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract pagamento{
    address  public gerente;
    address payable[] public contas;
    constructor (){
        gerente = msg.sender;
    }



   function addContaContrato() public  payable{
      require(msg.value > 0 gwei);
      contas.push(msg.sender);
    }

    //Transferência da conta contrato para demais contas
    function transferencia(address payable doa, uint256 valor) public payable verificaGerente{
        require(msg.sender == gerente);
        doa.transfer(valor);
    }


    //Retorna o saldo da conta contrato
    function saldoConta() public view returns(uint){
        return gerente.balance;
    }
    
    function getContas() public view returns(address payable[] memory){
        return contas;
    }

    modifier verificaGerente(){
        require(msg.sender == gerente);
        _;
    }

}
