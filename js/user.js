window.addEventListener('load', async function() {

	if (!ethEnabled()) {
  		alert("Por favor, instale um navegador compatível com Ethereum ou uma extensão como o MetaMask para utilizar esse dApp!");
	}
	else {
		getMyAccounts(await web3.eth.getAccounts());

		eleicao = new web3.eth.Contract(VotingContractInterface, CONTRACT_ADDRESS);
		getCandidatos(eleicao, populaCandidatos);
		getVoterInfo(eleicao, web3.utils.toHex(myAddress), updateMyStatus);
	}
});

$("#btnVote").on('click',function(){
	candidato = $("#candidate-options").children("option:selected").val();

        eleicao.methods.vote(candidato).send({from: myAddress})
	       .on('receipt',function(receipt) {
			windows.location.reaload(true);
		})
		.on('error',function(error) {
			console.log(error.message);
               		return;     
        	});  

});

function updateMyStatus(voterInfo) {
	if (voterInfo.weight > 0) {
		if (voterInfo.voted) {
			document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-success">Voce ja votou</h3>';
		} else if(voterInfo.delegate !== ZERO_ADDRESS) {
			document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-warning">Voce delegou o voto</h3>';
		} else {
			document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-info">Voce ainda nao votou</h3>';
		}
	} else {
		document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-danger">Voce nao tem direito a voto</h3>';
	}
}