const message = "I'd like to sign in";

async function main() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    try {
      // ask user permission to access his accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();

      const hashMessage = web3.eth.accounts.hashMessage(message);
      const eipString = getEIPString(hashMessage);
      const hashEIP = web3.eth.accounts.hashMessage(eipString);

      const hashSignature = await web3.eth.sign(hashEIP, accounts[0]);

      const signatureRef = document.createElement("p");
      signatureRef.textContent = hashSignature;

      document.body.appendChild(signatureRef);
    } catch (error) {
      console.error(error);
    }
  } else {
    throw "Must install MetaMask";
  }
}

function getEIPString(message) {
  return "\x19Ethereum Signed Message:\n" + message.length + message;
}

window.addEventListener("load", main);
