const message = "I'd like to sign in";

async function main() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      // ask user permission to access his accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = provider.getSigner();

      const hashSignature = await signer.signMessage(message);

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

window.addEventListener("load", main);
