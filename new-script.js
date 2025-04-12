// Include crypto-js library in your HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

const correctkelmetser = "lets_test_it"; 
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

// This would be injected via GitHub Actions, containing your encrypted key
const encryptedDecryptionKey = window.ENCRYPTED_KEY;
const keyPassphrase = "your-secure-passphrase"; // This will be what users need to enter

// function authenticate() {
//   const input = document.getElementById("kelmetser").value;
//   if (input === correctkelmetser) {
//     document.getElementById("auth").classList.add("hidden");
//     document.getElementById("key-auth").classList.remove("hidden");
//   } else {
//     document.getElementById("auth-error").classList.remove("hidden");
//   }
// }

function validateKeyPassphrase() {
  const passphraseInput = document.getElementById("key-passphrase").value;
  try {
    // First, decrypt the key itself using the provided passphrase
    const decryptedKeyBytes = CryptoJS.AES.decrypt(encryptedDecryptionKey, passphraseInput);
    const decryptionKey = decryptedKeyBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptionKey) {
      document.getElementById("key-auth-error").classList.remove("hidden");
      return;
    }
    
    // Store the decrypted key in memory (not localStorage for security)
    window.decryptionKey = decryptionKey;
    
    // Hide passphrase input and load data
    document.getElementById("key-auth").classList.add("hidden");
    document.getElementById("key-auth-error").classList.add("hidden");
    loadFamilyInfo();
  } catch (err) {
    console.error("Error decrypting key:", err);
    document.getElementById("key-auth-error").classList.remove("hidden");
  }
}

async function loadFamilyInfo() {
  try {
    // Fetch the encrypted data
    const response = await fetch("encrypted_family_data.json");
    const encryptedData = await response.text();
    
    // Use the decrypted key from memory
    const decryptionKey = window.decryptionKey;
    
    if (!decryptionKey) {
      console.error("Decryption key not available!");
      return;
    }
    
    // Decrypt the data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      console.error("Failed to decrypt data. Invalid key or corrupted data.");
      return;
    }
    
    // Parse the JSON
    const data = JSON.parse(decryptedText);
    
    // Continue with existing logic
    if (!token || !data[token]) {
      document.getElementById("not-found").classList.remove("hidden");
      return;
    }
    
    const family = data[token];
    // const parent = document.getElementById("Parent-Name")
    document.getElementById("Parent-Name").textContent = family.primary_name;
    const list = document.getElementById("members-list");
    family.family_members.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });
    
    document.getElementById("family-info").classList.remove("hidden");
  } catch (err) {
    console.error("Error loading or decrypting data:", err);
  }
}
