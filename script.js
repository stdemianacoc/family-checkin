const correctkelmetser = "lets_test_it"; //
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

function authenticate() {
  const input = document.getElementById("kelmetser").value;
  if (input === correctkelmetser) {
    document.getElementById("auth").classList.add("hidden");
    loadFamilyInfo();
  } else {
    document.getElementById("auth-error").classList.remove("hidden");
  }
}

function loadFamilyInfo() {
  fetch("family_data.json")
    .then((res) => res.json())
    .then((data) => {
      if (!token || !data[token]) {
        document.getElementById("not-found").classList.remove("hidden");
        return;
      }

      const family = data[token];
      const list = document.getElementById("members-list");
      family.family_members.forEach((name) => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
      });

      document.getElementById("family-info").classList.remove("hidden");
    })
    .catch((err) => {
      console.error("Error loading data:", err);
    });
}
